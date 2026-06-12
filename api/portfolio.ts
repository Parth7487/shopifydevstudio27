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
        const project = await sql`
          SELECT * FROM portfolio_projects 
          WHERE id = ${projectId} AND status = 'published'
        `;
        if (project.length) {
          return res.status(200).json(project[0]);
        }
        return res.status(404).json({ error: "Project not found" });
      } else {
        const projects = await sql`
          SELECT * FROM portfolio_projects 
          WHERE status = 'published'
          ORDER BY created_at DESC
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

      const [updatedProject] = await sql`
        UPDATE portfolio_projects SET
          title = COALESCE(${title}, title),
          brand = COALESCE(${brand}, brand),
          description = COALESCE(${description}, description),
          image = COALESCE(${image}, image),
          video_url = COALESCE(${video_url}, video_url),
          category = COALESCE(${category}, category),
          tags = COALESCE(${tags}, tags),
          tech = COALESCE(${tech}, tech),
          metrics = COALESCE(${metrics ? JSON.stringify(metrics) : null}, metrics),
          live_url = COALESCE(${live_url}, live_url),
          featured = COALESCE(${featured}, featured),
          has_video = COALESCE(${has_video}, has_video),
          status = COALESCE(${status}, status),
          updated_at = NOW()
        WHERE id = ${projectId}
        RETURNING *
      `;
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
