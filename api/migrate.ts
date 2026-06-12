import { neon } from "@netlify/neon";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const sql = neon(process.env.DATABASE_URL || "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    // Add sort_order column if it doesn't exist
    await sql`
      ALTER TABLE portfolio_projects 
      ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0
    `;

    // Add images column if it doesn't exist
    await sql`
      ALTER TABLE portfolio_projects 
      ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'
    `;

    // Backfill sort_order based on created_at order for existing rows
    await sql`
      WITH ranked AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS rn
        FROM portfolio_projects
      )
      UPDATE portfolio_projects
      SET sort_order = ranked.rn
      FROM ranked
      WHERE portfolio_projects.id = ranked.id
        AND portfolio_projects.sort_order = 0
    `;

    return res.status(200).json({ success: true, message: "Migration complete" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
