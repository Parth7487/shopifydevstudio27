import type { VercelRequest, VercelResponse } from "@vercel/node";

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
      businessName = "",
      storeUrl = "",
      projectType = "",
      budget = "",
      message = "",
      challenges = "",
      source = "Website Form",
    } = req.body || {};

    const clientName = name || businessName || "Anonymous Lead";
    const clientEmail = email;
    const clientCompany = company || storeUrl || "N/A";
    const clientMessage = message || challenges || "(No message provided)";
    const clientProjectType = projectType || "N/A";

    if (!clientEmail) {
      return res.status(400).json({
        error: "Missing required field: email",
      });
    }

    const toEmail = process.env.TO_EMAIL || "shopifydevstudioo@gmail.com";
    const fromEmail = process.env.FROM_EMAIL || "no-reply@shopifydev.studio";
    const emailSubject = `[${source}] Lead from ${clientName}`;

    const emailHtml = `
      <div style="font-family: Inter, system-ui, -apple-system, sans-serif; color: #0A0A0A; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 24px; border-radius: 12px;">
        <h2 style="margin: 0 0 16px; color: #e6b17e;">New Website Lead</h2>
        <p style="margin: 0 0 16px; color: #666;">You received a new lead from the <strong>${source}</strong>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <table cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <tr style="background: #fcfcfc;"><td style="width: 140px; font-weight: bold;">Name</td><td>${escapeHtml(clientName)}</td></tr>
          <tr><td style="font-weight: bold;">Email</td><td><a href="mailto:${clientEmail}">${escapeHtml(clientEmail)}</a></td></tr>
          <tr style="background: #fcfcfc;"><td style="font-weight: bold;">Company / Store</td><td>${escapeHtml(clientCompany)}</td></tr>
          <tr><td style="font-weight: bold;">Project Type</td><td>${escapeHtml(clientProjectType)}</td></tr>
          ${budget ? `<tr style="background: #fcfcfc;"><td style="font-weight: bold;">Budget</td><td>${escapeHtml(budget)}</td></tr>` : ''}
        </table>
        <h3 style="margin: 24px 0 8px; color: #333;">Message Details</h3>
        <pre style="white-space: pre-wrap; background: #f8f8f8; padding: 16px; border-radius: 8px; border: 1px solid #eee; font-family: inherit; margin: 0; line-height: 1.6;">${escapeHtml(clientMessage)}</pre>
      </div>
    `;

    const emailText = `New Lead [${source}]\n\nName: ${clientName}\nEmail: ${clientEmail}\nCompany/Store: ${clientCompany}\nProject Type: ${clientProjectType}\nBudget: ${budget || 'N/A'}\n\nMessage:\n${clientMessage}`;

    // Array to hold integration promises
    const promises: Promise<any>[] = [];

    // 1. Send Email (via Resend if configured, else fallback to Formspree)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      promises.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            subject: emailSubject,
            html: emailHtml,
            text: emailText,
          }),
        }).then(async (r) => {
          if (!r.ok) {
            const errText = await r.text();
            throw new Error(`Resend API returned ${r.status}: ${errText}`);
          }
        })
      );
    } else {
      // Fallback: Submit to Formspree
      const formspreeId = process.env.FORMSPREE_ID || "xwpovpla";
      promises.push(
        fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: clientName,
            email: clientEmail,
            company: clientCompany,
            projectType: clientProjectType,
            budget: budget || "N/A",
            message: clientMessage,
            source,
            _subject: emailSubject,
          }),
        }).then(async (r) => {
          if (!r.ok) {
            const errText = await r.text();
            throw new Error(`Formspree API returned ${r.status}: ${errText}`);
          }
        })
      );
    }

    // 2. Telegram Bot Integration
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramBotToken && telegramChatId) {
      const textMessage = `
🔔 <b>New Lead [${source}]</b>

👤 <b>Name:</b> ${clientName}
📧 <b>Email:</b> ${clientEmail}
🏢 <b>Company/Store:</b> ${clientCompany}
🏷️ <b>Type:</b> ${clientProjectType}
${budget ? `💰 <b>Budget:</b> ${budget}\n` : ""}
💬 <b>Details:</b>
${clientMessage}
      `.trim();

      promises.push(
        fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: textMessage,
            parse_mode: "HTML",
          }),
        }).then(async (r) => {
          if (!r.ok) {
            const errText = await r.text();
            throw new Error(`Telegram API returned ${r.status}: ${errText}`);
          }
        })
      );
    }

    // 3. Google Sheets Webhook Integration
    const googleSheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (googleSheetUrl) {
      promises.push(
        fetch(googleSheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            source,
            name: clientName,
            email: clientEmail,
            company: clientCompany,
            projectType: clientProjectType,
            budget: budget || "N/A",
            message: clientMessage,
          }),
        }).then(async (r) => {
          if (!r.ok) {
            const errText = await r.text();
            throw new Error(`Google Sheets Webhook returned ${r.status}: ${errText}`);
          }
        })
      );
    }

    // 4. WhatsApp (Green-API) Integration
    const whatsappInstanceId = process.env.GREEN_API_INSTANCE_ID;
    const whatsappApiToken = process.env.GREEN_API_API_TOKEN;
    const whatsappPhone = process.env.WHATSAPP_NOTIFICATION_PHONE;

    if (whatsappInstanceId && whatsappApiToken && whatsappPhone) {
      const formattedPhone = whatsappPhone.replace(/\D/g, "");
      const chatId = `${formattedPhone}@c.us`;

      const textMessage = `
🔔 *New Lead [${source}]*

👤 *Name:* ${clientName}
📧 *Email:* ${clientEmail}
🏢 *Company/Store:* ${clientCompany}
🏷️ *Type:* ${clientProjectType}
${budget ? `💰 *Budget:* ${budget}\n` : ""}
💬 *Details:*
${clientMessage}
      `.trim();

      promises.push(
        fetch(`https://api.green-api.com/waInstance${whatsappInstanceId}/sendMessage/${whatsappApiToken}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: chatId,
            message: textMessage,
          }),
        }).then(async (r) => {
          if (!r.ok) {
            const errText = await r.text();
            throw new Error(`Green-API returned ${r.status}: ${errText}`);
          }
        })
      );
    }

    // Wait for all integration promises to settle
    const results = await Promise.allSettled(promises);
    const failures = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];

    if (failures.length > 0 && failures.length === promises.length) {
      // If ALL integrations failed, return a 502 error
      return res.status(502).json({
        error: "All integrations failed to process submission",
        details: failures.map((f) => f.reason?.message || f.reason),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead processed successfully",
      failedIntegrations: failures.map((f) => f.reason?.message || f.reason),
    });
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
