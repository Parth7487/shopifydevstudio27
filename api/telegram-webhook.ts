import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

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

    // Determine if it is a story post (contains #story, #igstory, or starts with /story)
    const captionLower = caption.toLowerCase().trim();
    const isStory =
      captionLower.includes("#story") ||
      captionLower.includes("#igstory") ||
      captionLower.startsWith("/story");

    // Clean up caption by removing story tags/commands for the final post
    let postCaption = caption;
    if (isStory) {
      postCaption = caption
        .replace(/^\/story\s*/i, "")
        .replace(/#story/i, "")
        .replace(/#igstory/i, "")
        .trim();
    }

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

    // Step 2: Fetch the image buffer from Telegram CDN
    const telegramFileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
    const fileRes = await fetch(telegramFileUrl);
    if (!fileRes.ok) {
      console.error("Failed to download file from Telegram:", fileRes.statusText);
      return res.status(200).json({ ok: true });
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const fileDataUri = `data:image/jpeg;base64,${base64Data}`;

    // Step 3: Upload to Cloudinary to get a public URL
    const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "ddu46zaxl";
    const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "686764961315939";
    const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "dDIY-szQG-i4STaHFCX42Ja2ozk";

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "shopifydevstudio/telegram-uploads";
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha256")
      .update(paramsToSign + CLOUDINARY_API_SECRET)
      .digest("hex");

    console.log("Uploading Telegram image to Cloudinary...");
    const cloudinaryUploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: fileDataUri,
          signature,
          timestamp,
          api_key: CLOUDINARY_API_KEY,
          folder,
        }),
      }
    );

    if (!cloudinaryUploadRes.ok) {
      const errText = await cloudinaryUploadRes.text();
      console.error("Cloudinary upload failed:", errText);
      // Send alert message back to Telegram chat
      const chatId = message.chat?.id;
      if (chatId) {
        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: `❌ Failed to process image upload. Please try again.`,
            }),
          }
        );
      }
      return res.status(200).json({ ok: true });
    }

    const cloudinaryData = await cloudinaryUploadRes.json();
    let imageUrl = cloudinaryData.secure_url;
    console.log("Cloudinary upload successful, secure url:", imageUrl);

    // Instagram feed posts require an aspect ratio between 4:5 (0.8) and 1.91:1 (1.91).
    // If the image is outside this range and is NOT a story, we automatically pad it
    // to a 1:1 square on a black background via Cloudinary transformations.
    const width = cloudinaryData.width;
    const height = cloudinaryData.height;
    if (width && height && !isStory) {
      const aspectRatio = width / height;
      if (aspectRatio < 0.8 || aspectRatio > 1.91) {
        imageUrl = imageUrl.replace("/upload/", "/upload/c_pad,ar_1:1,b_black/");
        console.log(`Image aspect ratio (${aspectRatio.toFixed(2)}) is outside Instagram's feed limits (0.8 - 1.91). Applied Cloudinary square padding:`, imageUrl);
      }
    }

    // Step 4: Send to Make.com webhook → posts to Instagram
    if (MAKE_WEBHOOK_URL) {
      const makeRes = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: postCaption,
          is_story: isStory,
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
                ? `✅ *Posted to Instagram!*\n\n📸 Photo published successfully as a *${isStory ? "Story" : "Feed Post"}*${postCaption ? `\n💬 Caption: _${postCaption}_` : ""}`
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
