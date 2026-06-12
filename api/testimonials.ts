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

  const testimonialId = (req.query.id as string) || (() => {
    const url = new URL(req.url || "", `https://${req.headers.host}`);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    return pathSegments[pathSegments.length - 1] !== "testimonials" ? pathSegments[pathSegments.length - 1] : null;
  })();

  try {
    if (req.method === "GET") {
      if (testimonialId) {
        const testimonial = await sql`
          SELECT * FROM testimonials 
          WHERE id = ${testimonialId}
        `;
        if (testimonial.length) {
          return res.status(200).json(testimonial[0]);
        }
        return res.status(404).json({ error: "Testimonial not found" });
      } else {
        const testimonials = await sql`
          SELECT * FROM testimonials 
          ORDER BY sort_order ASC, created_at DESC
        `;
        return res.status(200).json(testimonials);
      }
    }

    if (req.method === "POST") {
      const {
        author,
        role,
        company,
        quote,
        avatar,
        rating = 5,
        metric,
        industry,
        verified = true,
        sort_order = 0
      } = req.body;

      if (!author || !role || !company || !quote) {
        return res.status(400).json({ error: "Missing required fields (author, role, company, quote)" });
      }

      const [newTestimonial] = await sql`
        INSERT INTO testimonials (
          author, role, company, quote, avatar, rating, metric, industry, verified, sort_order
        ) VALUES (
          ${author}, ${role}, ${company}, ${quote}, ${avatar}, ${rating}, ${metric}, ${industry}, ${verified}, ${sort_order}
        ) RETURNING *
      `;
      return res.status(201).json(newTestimonial);
    }

    if (req.method === "PUT" && testimonialId) {
      const {
        author,
        role,
        company,
        quote,
        avatar,
        rating,
        metric,
        industry,
        verified,
        sort_order
      } = req.body;

      const [updatedTestimonial] = await sql`
        UPDATE testimonials SET
          author = ${author ?? sql`author`},
          role = ${role ?? sql`role`},
          company = ${company ?? sql`company`},
          quote = ${quote ?? sql`quote`},
          avatar = ${avatar !== undefined ? avatar : sql`avatar`},
          rating = ${rating !== undefined ? rating : sql`rating`},
          metric = ${metric !== undefined ? metric : sql`metric`},
          industry = ${industry !== undefined ? industry : sql`industry`},
          verified = ${verified !== undefined ? verified : sql`verified`},
          sort_order = ${sort_order !== undefined ? sort_order : sql`sort_order`}
        WHERE id = ${testimonialId}
        RETURNING *
      `;
      if (!updatedTestimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      return res.status(200).json(updatedTestimonial);
    }

    if (req.method === "DELETE" && testimonialId) {
      await sql`DELETE FROM testimonials WHERE id = ${testimonialId}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
