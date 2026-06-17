import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

const MAKE_WEBHOOK_URL = process.env.MAKE_INSTAGRAM_WEBHOOK_URL!;
const GREEN_API_URL = (process.env.GREEN_API_URL || "https://7107.api.greenapi.com").replace(/\/$/, "");
const GREEN_API_INSTANCE_ID = process.env.GREEN_API_INSTANCE_ID;
const GREEN_API_API_TOKEN = process.env.GREEN_API_API_TOKEN;

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal as any,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("Received Green-API webhook request:", req.method, JSON.stringify(req.body));

  // Return 200 immediately to OPTIONS/GET/other checks
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }


  try {
    const webhookData = req.body;
    const typeWebhook = webhookData?.typeWebhook;
    
    // Check if it's an incoming or outgoing message notification
    if (
      typeWebhook !== "incomingMessageReceived" &&
      typeWebhook !== "outgoingMessageReceived" &&
      typeWebhook !== "outgoingAPIMessageReceived"
    ) {
      return res.status(200).json({ ok: true });
    }

    const senderData = webhookData?.senderData;
    const messageData = webhookData?.messageData;
    
    if (!messageData || !senderData) {
      return res.status(200).json({ ok: true });
    }

    const senderChatId = senderData.chatId;
    const senderId = senderData.sender;

    // Security Gate: Only allow messages sent by the owner (917487080421) or within authorized chats/groups
    const ownerId = "917487080421@c.us";
    const authorizedChats = [
      "120363370537372285@g.us", // Authorized group
      "919152014668@c.us"        // BookMyShow
    ];

    const isFromOwner = senderId === ownerId || senderChatId === ownerId;
    const isAuthorizedChat = authorizedChats.includes(senderChatId);

    if (!isFromOwner && !isAuthorizedChat) {
      console.log(`Ignoring webhook request from unauthorized sender: ${senderId} in chat: ${senderChatId}`);
      return res.status(200).json({ ok: true });
    }




    // Only process image messages
    if (messageData.typeMessage !== "imageMessage" || !messageData.fileMessageData) {
      return res.status(200).json({ ok: true });
    }

    const { downloadUrl, caption = "" } = messageData.fileMessageData;

    if (!downloadUrl) {
      console.error("No downloadUrl found in fileMessageData");
      return res.status(200).json({ ok: true });
    }

    // Parse the story flags just like the telegram webhook
    const captionLower = caption.toLowerCase().trim();
    const isStory =
      captionLower.includes("#story") ||
      captionLower.includes("#igstory") ||
      captionLower.startsWith("/story");

    let postCaption = caption;
    if (isStory) {
      postCaption = caption
        .replace(/^\/story\s*/i, "")
        .replace(/#story/i, "")
        .replace(/#igstory/i, "")
        .trim();
    }

    console.log(`Downloading image from Green-API: ${downloadUrl}`);
    let fileRes;
    try {
      fileRes = await fetchWithTimeout(downloadUrl, {}, 20000);
    } catch (err: any) {
      console.error("Failed to download image from Green-API:", err.message || err);
      // Notify sender of timeout if possible
      await sendWhatsAppMessage(
        senderChatId,
        "⚠️ *WhatsApp Integration Error*\n\nFailed to download the image from WhatsApp servers. Please try again."
      );
      return res.status(200).json({ ok: true });
    }

    if (!fileRes.ok) {
      console.error(`Green-API image download failed with status: ${fileRes.status}`);
      await sendWhatsAppMessage(
        senderChatId,
        "⚠️ *WhatsApp Integration Error*\n\nUnable to fetch image from WhatsApp CDN. Please try sending the image again."
      );
      return res.status(200).json({ ok: true });
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const fileDataUri = `data:image/jpeg;base64,${base64Data}`;

    // Upload to Cloudinary
    const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "ddu46zaxl";
    const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "686764961315939";
    const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "dDIY-szQG-i4STaHFCX42Ja2ozk";

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "shopifydevstudio/telegram-uploads"; // Re-use folder or we can change to shopifydevstudio/whatsapp-uploads
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha256")
      .update(paramsToSign + CLOUDINARY_API_SECRET)
      .digest("hex");

    console.log("Uploading WhatsApp image to Cloudinary...");
    let cloudinaryUploadRes;
    try {
      cloudinaryUploadRes = await fetchWithTimeout(
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
        },
        15000
      );
    } catch (err: any) {
      console.error("Cloudinary upload timed out:", err.message || err);
      return res.status(200).json({ ok: true });
    }

    if (!cloudinaryUploadRes.ok) {
      const errText = await cloudinaryUploadRes.text();
      console.error("Cloudinary upload failed for WhatsApp image:", errText);
      await sendWhatsAppMessage(senderChatId, "❌ Failed to process image upload. Please try again.");
      return res.status(200).json({ ok: true });
    }

    const cloudinaryData = await cloudinaryUploadRes.json();
    let imageUrl = cloudinaryData.secure_url;
    console.log("Cloudinary upload successful, secure url:", imageUrl);

    // Apply aspect ratio padding for feed posts if outside Instagram requirements (0.8 to 1.91)
    const width = cloudinaryData.width;
    const height = cloudinaryData.height;
    if (width && height && !isStory) {
      const aspectRatio = width / height;
      if (aspectRatio < 0.8 || aspectRatio > 1.91) {
        imageUrl = imageUrl.replace("/upload/", "/upload/c_pad,ar_1:1,b_black/");
        console.log(`Image padded to square: ${imageUrl}`);
      }
    }

    // Send to Make.com Webhook
    if (MAKE_WEBHOOK_URL) {
      console.log("Sending payload to Make.com webhook...");
      let makeRes;
      try {
        makeRes = await fetchWithTimeout(
          MAKE_WEBHOOK_URL,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: imageUrl,
              caption: postCaption,
              is_story: isStory,
              source: "whatsapp",
              chat_id: senderChatId,
              from: senderData.senderName || senderData.sender || "unknown",
            }),
          },
          12000
        );
      } catch (err: any) {
        console.error("Make.com webhook request timed out or failed:", err.message || err);
        return res.status(200).json({ ok: true });
      }

      const makeBody = await makeRes.text();
      console.log(`Make.com response: ${makeRes.status} — ${makeBody}`);

      if (makeRes.ok) {
        const textMessage = `✅ *Posted to Instagram!*\n\n📸 Photo published successfully as a *${
          isStory ? "Story" : "Feed Post"
        }*${postCaption ? `\n💬 Caption: _${postCaption}_` : ""}`;
        await sendWhatsAppMessage(senderChatId, textMessage);
      } else {
        await sendWhatsAppMessage(senderChatId, "❌ Failed to post to Instagram. Please try again.");
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("WhatsApp webhook exception:", err);
    return res.status(200).json({ ok: true }); // Always return 200 to Green-API to prevent retries
  }
}

async function sendWhatsAppMessage(chatId: string, message: string) {
  if (!GREEN_API_INSTANCE_ID || !GREEN_API_API_TOKEN) {
    console.warn("Green API credentials missing, skipping confirmation reply");
    return;
  }

  try {
    await fetchWithTimeout(
      `${GREEN_API_URL}/waInstance${GREEN_API_INSTANCE_ID}/sendMessage/${GREEN_API_API_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          message,
        }),
      },
      5000
    );
  } catch (err: any) {
    console.error("Failed to send reply to WhatsApp:", err.message || err);
  }
}
