import type { VercelRequest, VercelResponse } from "@vercel/node";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const MAKE_WEBHOOK_URL = process.env.MAKE_INSTAGRAM_WEBHOOK_URL!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST from Telegram
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const update = req.body;
    const message = update?.message || update?.channel_post;

    if (!message) {
      return res.status(200).json({ ok: true }); // Ignore non-message updates
    }

    // Only process messages with photos
    if (!message.photo || message.photo.length === 0) {
      // If it's a text command, ignore silently
      return res.status(200).json({ ok: true });
    }

    // Get the largest photo (last in array = highest res)
    const largestPhoto = message.photo[message.photo.length - 1];
    const fileId = largestPhoto.file_id;

    // Get the caption (text sent with the photo)
    const caption = message.caption || "";

    // Step 1: Get file path from Telegram
    const fileInfoRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const fileInfo = await fileInfoRes.json();

    if (!fileInfo.ok || !fileInfo.result?.file_path) {
      console.error("Failed to get file info:", fileInfo);
      return res.status(200).json({ ok: true });
    }

    const filePath = fileInfo.result.file_path;

    // Step 2: Build the public image URL from Telegram CDN
    const imageUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;

    // Step 3: Send to Make.com webhook → posts to Instagram
    if (MAKE_WEBHOOK_URL) {
      const makeRes = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          source: "telegram",
          chat_id: message.chat?.id,
          from: message.from?.username || message.from?.first_name || "unknown",
        }),
      });

      const makeBody = await makeRes.text();
      console.log(`Make.com response: ${makeRes.status} — ${makeBody}`);

      // Send confirmation back to Telegram chat
      const chatId = message.chat?.id;
      if (chatId) {
        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: makeRes.ok
                ? `✅ *Posted to Instagram!*\n\n📸 Photo published successfully${caption ? `\n💬 Caption: _${caption}_` : ""}`
                : `❌ Failed to post to Instagram. Please try again.`,
              parse_mode: "Markdown",
            }),
          }
        );
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("Telegram webhook error:", err);
    return res.status(200).json({ ok: true }); // Always return 200 to Telegram
  }
}
