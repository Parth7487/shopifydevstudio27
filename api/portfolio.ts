import { neon } from "@netlify/neon";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const sql = neon(process.env.DATABASE_URL || "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const projectId = (req.query.id as string) || (() => {
    const url = new URL(req.url || "", `https://${req.headers.host}`);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    return pathSegments[pathSegments.length - 1] !== "portfolio" ? pathSegments[pathSegments.length - 1] : null;
  })();

  try {
    if (req.method === "GET") {
      if (projectId) {
        // Admin can fetch any project by ID regardless of status
        const project = await sql`
          SELECT * FROM portfolio_projects 
          WHERE id = ${projectId}
        `;
        if (project.length) {
          return res.status(200).json(project[0]);
        }
        return res.status(404).json({ error: "Project not found" });
      } else {
        const projects = await sql`
          SELECT * FROM portfolio_projects 
          WHERE status = 'published'
          ORDER BY sort_order ASC, created_at DESC
        `;
        return res.status(200).json(projects);
      }
    }

    if (req.method === "POST") {
      const {
        title,
        brand,
        description,
        image,
        video_url,
        category,
        tags = [],
        tech = [],
        metrics = { conversion: "0%", load_time: "0s" },
        live_url,
        featured = false,
        has_video = false,
        status = "published"
      } = req.body;

      if (!title || !brand || !description || !image || !category || !live_url) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const [newProject] = await sql`
        INSERT INTO portfolio_projects (
          title, brand, description, image, video_url, category, 
          tags, tech, metrics, live_url, featured, has_video, status
        ) VALUES (
          ${title}, ${brand}, ${description}, ${image}, ${video_url}, ${category},
          ${tags}, ${tech}, ${JSON.stringify(metrics)}, ${live_url}, ${featured}, ${has_video}, ${status}
        ) RETURNING *
      `;
      return res.status(201).json(newProject);
    }

    if (req.method === "PUT" && projectId) {
      const {
        title,
        brand,
        description,
        image,
        video_url,
        category,
        tags,
        tech,
        metrics,
        live_url,
        featured,
        has_video,
        status
      } = req.body;

      // Use explicit SET for all fields — booleans break with COALESCE (false is treated as NULL)
      const [updatedProject] = await sql`
        UPDATE portfolio_projects SET
          title = ${title ?? sql`title`},
          brand = ${brand ?? sql`brand`},
          description = ${description ?? sql`description`},
          image = ${image ?? sql`image`},
          video_url = ${video_url !== undefined ? video_url : sql`video_url`},
          category = ${category ?? sql`category`},
          tags = ${tags ?? sql`tags`},
          tech = ${tech ?? sql`tech`},
          metrics = ${metrics ? JSON.stringify(metrics) : sql`metrics`},
          live_url = ${live_url ?? sql`live_url`},
          featured = ${featured !== undefined ? featured : sql`featured`},
          has_video = ${has_video !== undefined ? has_video : sql`has_video`},
          status = ${status ?? sql`status`},
          updated_at = NOW()
        WHERE id = ${projectId}
        RETURNING *
      `;
      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      return res.status(200).json(updatedProject);
    }

    if (req.method === "DELETE" && projectId) {
      await sql`DELETE FROM portfolio_projects WHERE id = ${projectId}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
