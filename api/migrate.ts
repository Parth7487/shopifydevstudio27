import { neon } from "@netlify/neon";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const sql = neon(process.env.DATABASE_URL || "");

const defaultTestimonials = [
  {
    author: "Sarah Chen",
    role: "UX/UI Design Lead",
    company: "Figma Community",
    quote: "Their design implementation perfectly captures our vision while maintaining performance.",
    avatar: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F2db76c02fb2f4424869be58cff012b97?format=webp&width=80",
    rating: 5,
    metric: "50K+ Design Downloads",
    industry: "Design",
    verified: true,
    sort_order: 0
  },
  {
    author: "Marcus Williams",
    role: "Performance Optimization Specialist",
    company: "ShopifyPlus Partner",
    quote: "They consistently deliver lightning-fast stores that convert at industry-leading rates.",
    avatar: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F12b9f370a7b141828551d29b95ea5b8e?format=webp&width=80",
    rating: 5,
    metric: "40% Average Speed Increase",
    industry: "ShopifyPlus",
    verified: true,
    sort_order: 1
  }
];

const defaultSettings = [
  {
    key: "footer",
    value: {
      copyright: "© 2026 Shopifydevstudio. All rights reserved.",
      logo_text: "Dev Studio",
      email: "shopifydevstudioo@gmail.com"
    }
  },
  {
    key: "socials",
    value: {
      whatsapp: "+917487080421",
      telegram: "prime2357"
    }
  },
  {
    key: "navigation",
    value: [
      { id: "hero", label: "Home" },
      { id: "services", label: "Services" },
      { id: "process", label: "Process" },
      { id: "work", label: "Work" },
      { id: "partners", label: "Partners" },
      { id: "about", label: "About" }
    ]
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    // 1. Projects table alterations
    await sql`
      ALTER TABLE portfolio_projects 
      ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0
    `;

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

    // 2. Create testimonials table
    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author TEXT NOT NULL,
        role TEXT NOT NULL,
        company TEXT NOT NULL,
        quote TEXT NOT NULL,
        avatar TEXT,
        rating INTEGER DEFAULT 5,
        metric TEXT,
        industry TEXT,
        verified BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Create site_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL
      )
    `;

    // 4. Create audit_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        action TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        payload JSONB,
        author TEXT DEFAULT 'Admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 4. Seed testimonials if empty
    const testimonialCount = await sql`SELECT COUNT(*)::integer FROM testimonials`;
    if (testimonialCount[0].count === 0) {
      for (const t of defaultTestimonials) {
        await sql`
          INSERT INTO testimonials (author, role, company, quote, avatar, rating, metric, industry, verified, sort_order)
          VALUES (${t.author}, ${t.role}, ${t.company}, ${t.quote}, ${t.avatar}, ${t.rating}, ${t.metric}, ${t.industry}, ${t.verified}, ${t.sort_order})
        `;
      }
    }

    // 5. Seed site settings if empty
    const settingsCount = await sql`SELECT COUNT(*)::integer FROM site_settings`;
    if (settingsCount[0].count === 0) {
      for (const s of defaultSettings) {
        await sql`
          INSERT INTO site_settings (key, value)
          VALUES (${s.key}, ${JSON.stringify(s.value)})
        `;
      }
    }

    return res.status(200).json({ success: true, message: "Migration complete" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
