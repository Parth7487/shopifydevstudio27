import type { Context } from "@netlify/functions";

const RESEND_API = "https://api.resend.com/emails";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  }

  try {
    const body = await req.json();
    const {
      name = "",
      email = "",
      company = "",
      projectType = "",
      budget = "",
      message = "",
    } = body || {};

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, email, message" }), { status: 400, headers: { "Content-Type": "application/json" } });
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
      return new Response(JSON.stringify({ error: "RESEND_API_KEY is not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
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

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: "Failed to send email", details: err }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unexpected error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
