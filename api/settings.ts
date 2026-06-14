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

  const key = req.query.key as string;

  try {
    if (req.method === "GET") {
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
      if (key) {
        const setting = await sql`
          SELECT * FROM site_settings 
          WHERE key = ${key}
        `;
        if (setting.length) {
          return res.status(200).json(setting[0].value);
        }
        return res.status(404).json({ error: "Setting key not found" });
      } else {
        const settings = await sql`
          SELECT * FROM site_settings
        `;
        // Format as a single key-value object
        const settingsMap: Record<string, any> = {};
        for (const row of settings) {
          settingsMap[row.key] = row.value;
        }
        return res.status(200).json(settingsMap);
      }
    }

    if (req.method === "POST") {
      const { key: newKey, value } = req.body;

      if (!newKey || value === undefined) {
        return res.status(400).json({ error: "Missing required fields (key, value)" });
      }

      // Fetch previous settings for audit logs rollback
      const prevSetting = await sql`
        SELECT value FROM site_settings WHERE key = ${newKey}
      `;
      const prevValue = prevSetting.length ? prevSetting[0].value : null;

      await sql`
        INSERT INTO site_settings (key, value)
        VALUES (${newKey}, ${JSON.stringify(value)})
        ON CONFLICT (key) DO UPDATE
        SET value = ${JSON.stringify(value)}
      `;

      // Log the settings update action to audit logs
      const actionName = `Updated ${newKey.charAt(0).toUpperCase() + newKey.slice(1)} Settings`;
      const descText = `Modified ${newKey} settings inside the admin customization panel.`;
      await sql`
        INSERT INTO audit_logs (action, description, category, payload)
        VALUES (${actionName}, ${descText}, 'admin', ${JSON.stringify({ type: 'settings', key: newKey, value: prevValue })})
      `;

      return res.status(200).json({ success: true, message: `Setting '${newKey}' updated` });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
