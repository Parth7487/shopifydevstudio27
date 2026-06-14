import { neon } from "@netlify/neon";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const sql = neon(process.env.DATABASE_URL || "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      // 1. Fetch recent database audit logs (last 50)
      const dbLogs = await sql`
        SELECT id, action, description, category, payload, author, created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 50
      `;

      // 2. Fetch recent GitHub commits (last 20)
      let gitHubLogs: any[] = [];
      try {
        const githubResponse = await fetch(
          "https://api.github.com/repos/Parth7487/shopifydevstudio27/commits?per_page=20",
          {
            headers: {
              "User-Agent": "Vercel-Serverless-AuditLogs",
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (githubResponse.ok) {
          const commits = await githubResponse.json();
          if (Array.isArray(commits)) {
            gitHubLogs = commits.map((c: any) => ({
              id: c.sha,
              action: "GitHub Code Commit",
              description: c.commit.message || "No commit message",
              category: "github",
              payload: { commitUrl: c.html_url },
              author: c.commit.author?.name || c.author?.login || "GitHub Developer",
              created_at: c.commit.author?.date || new Date().toISOString(),
            }));
          }
        } else {
          console.warn("GitHub API returned status:", githubResponse.status);
        }
      } catch (err) {
        console.warn("Failed to fetch GitHub commits:", err);
        // Fallback: continue with empty GitHub logs if rate limit is hit or API is down
      }

      // 3. Combine and sort chronologically (descending)
      const combinedLogs = [...dbLogs, ...gitHubLogs].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return res.status(200).json(combinedLogs);
    }

    if (req.method === "POST") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing required field (id)" });
      }

      // Fetch the log entry
      const logs = await sql`
        SELECT * FROM audit_logs WHERE id = ${id}
      `;
      if (!logs.length) {
        return res.status(404).json({ error: "Log entry not found" });
      }

      const log = logs[0];
      const payload = log.payload;

      if (!payload || !payload.type) {
        return res.status(400).json({ error: "Log entry does not contain a restorable payload" });
      }

      // Perform rollback based on payload type
      if (payload.type === "settings") {
        if (payload.value === null) {
          // Revert a newly created setting by deleting it
          await sql`
            DELETE FROM site_settings WHERE key = ${payload.key}
          `;
        } else {
          await sql`
            INSERT INTO site_settings (key, value)
            VALUES (${payload.key}, ${JSON.stringify(payload.value)})
            ON CONFLICT (key) DO UPDATE
            SET value = ${JSON.stringify(payload.value)}
          `;
        }
      } else if (payload.type === "portfolio_create") {
        // Rollback creation by deleting the project
        await sql`
          DELETE FROM portfolio_projects WHERE id = ${payload.id}
        `;
      } else if (payload.type === "portfolio_update") {
        const p = payload.value;
        if (p) {
          await sql`
            UPDATE portfolio_projects SET
              title = ${p.title},
              brand = ${p.brand},
              description = ${p.description},
              image = ${p.image},
              video_url = ${p.video_url},
              category = ${p.category},
              tags = ${p.tags},
              tech = ${p.tech},
              metrics = ${JSON.stringify(p.metrics)},
              live_url = ${p.live_url},
              featured = ${p.featured},
              has_video = ${p.has_video},
              status = ${p.status},
              images = ${p.images},
              updated_at = NOW()
            WHERE id = ${payload.id}
          `;
        }
      } else if (payload.type === "portfolio_delete") {
        const p = payload.value;
        if (p) {
          await sql`
            INSERT INTO portfolio_projects (
              id, title, brand, description, image, video_url, category, 
              tags, tech, metrics, live_url, featured, has_video, status, images, created_at
            ) VALUES (
              ${payload.id}, ${p.title}, ${p.brand}, ${p.description}, ${p.image}, ${p.video_url}, ${p.category},
              ${p.tags}, ${p.tech}, ${JSON.stringify(p.metrics)}, ${p.live_url}, ${p.featured}, ${p.has_video}, ${p.status}, ${p.images}, ${p.created_at}
            )
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              brand = EXCLUDED.brand,
              description = EXCLUDED.description,
              image = EXCLUDED.image,
              video_url = EXCLUDED.video_url,
              category = EXCLUDED.category,
              tags = EXCLUDED.tags,
              tech = EXCLUDED.tech,
              metrics = EXCLUDED.metrics,
              live_url = EXCLUDED.live_url,
              featured = EXCLUDED.featured,
              has_video = EXCLUDED.has_video,
              status = EXCLUDED.status,
              images = EXCLUDED.images
          `;
        }
      } else {
        return res.status(400).json({ error: "Unsupported rollback payload type" });
      }

      // Log the restore action itself
      const restoreAction = `Reverted Action: ${log.action}`;
      const restoreDesc = `Reverted settings or content changes back to the state recorded in log ID: ${id}.`;
      await sql`
        INSERT INTO audit_logs (action, description, category)
        VALUES (${restoreAction}, ${restoreDesc}, 'admin')
      `;

      return res.status(200).json({ success: true, message: "System state successfully restored!" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
