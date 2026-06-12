import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@netlify/neon";

const sql = neon(process.env.DATABASE_URL || "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "PATCH") return res.status(405).json({ error: "PATCH only" });

  try {
    // Expects body: { order: ["id1", "id2", "id3", ...] }
    const { order } = req.body as { order: string[] };
    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ error: "order must be a non-empty array of IDs" });
    }

    // Update each project's sort_order based on its position in the array
    for (let i = 0; i < order.length; i++) {
      await sql`
        UPDATE portfolio_projects
        SET sort_order = ${i}, updated_at = NOW()
        WHERE id = ${order[i]}
      `;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
