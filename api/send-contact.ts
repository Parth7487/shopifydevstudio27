import type { VercelRequest, VercelResponse } from "@vercel/node";

const RESEND_API = "https://api.resend.com/emails";

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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name = "",
      email = "",
      company = "",
      projectType = "",
      budget = "",
      message = "",
    } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Missing required fields: name, email, message",
      });
    }

    const to = "shopifydevstudioo@gmail.com";
    const subject = `Free Analysis Request from ${name}`;

    const html = `
      <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #0A0A0A;">
        <h2 style="margin:0 0 16px;">New Free Analysis Request</h2>
        <p style="margin:0 0 8px;">You received a new submission from the website contact form.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><strong>Company</strong></td><td>${escapeHtml(company)}</td></tr>
          <tr><td><strong>Project Type</strong></td><td>${escapeHtml(projectType)}</td></tr>
          <tr><td><strong>Budget</strong></td><td>${escapeHtml(budget)}</td></tr>
        </table>
        <h3 style="margin:16px 0 8px;">Message</h3>
        <pre style="white-space:pre-wrap;background:#f8f8f8;padding:12px;border-radius:8px;">${escapeHtml(message)}</pre>
      </div>
    `;

    const text = `New Free Analysis Request\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nProject Type: ${projectType}\nBudget: ${budget}\n\nMessage:\n${message}`;

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.FROM_EMAIL || "no-reply@shopifydev.studio";
    if (!apiKey) {
      return res.status(500).json({ error: "RESEND_API_KEY is not configured" });
    }

    const emailRes = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      return res.status(502).json({ error: "Failed to send email", details: err });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Unexpected error" });
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
