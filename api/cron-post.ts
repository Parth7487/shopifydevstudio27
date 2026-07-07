import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@netlify/neon";
import { INSTAGRAM_SYSTEM_PROMPT } from "./instagram-prompt.js";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const MAKE_WEBHOOK_URL = process.env.MAKE_INSTAGRAM_WEBHOOK_URL!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-5328680116";
const sql = neon(process.env.DATABASE_URL || "");

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 10000) {
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
  // Allow Vercel Cron or manual POST/GET (with simple check if desired, but Vercel handles cron auth in header if needed)
  try {
    console.log("Cron worker triggered: Checking for queued Instagram posts...");

    // 1. Fetch the oldest pending post
    const pendingPosts = await sql`
      SELECT * FROM post_queue 
      WHERE status = 'pending' 
      ORDER BY created_at ASC 
      LIMIT 1
    `;

    if (pendingPosts.length === 0) {
      console.log("No pending posts found in the queue.");
      return res.status(200).json({ ok: true, message: "Queue is empty." });
    }

    const activePost = pendingPosts[0];
    const { id, image_url, manual_caption, is_story } = activePost;
    let postCaption = manual_caption || "";

    console.log(`Processing post ID: ${id}, Story: ${is_story}, Image: ${image_url}`);

    // 2. Generate caption if none is specified
    if (!postCaption) {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured in environment variables.");
      }

      // Download image from Cloudinary to send as base64 to Gemini
      console.log("Downloading image from Cloudinary for Gemini analysis...");
      const imgRes = await fetchWithTimeout(image_url, {}, 15000);
      if (!imgRes.ok) {
        throw new Error(`Failed to download image from Cloudinary. Status: ${imgRes.statusText}`);
      }
      const arrayBuffer = await imgRes.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");

      console.log("Generating caption using Gemini...");
      let geminiRes;
      let attempt = 0;
      const maxAttempts = 3;
      const delays = [2000, 3500];

      while (attempt < maxAttempts) {
        console.log(`Calling Gemini API (Attempt ${attempt + 1}/${maxAttempts} using gemini-2.5-flash)...`);
        try {
          geminiRes = await fetchWithTimeout(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      { text: INSTAGRAM_SYSTEM_PROMPT },
                      {
                        inlineData: {
                          mimeType: "image/jpeg",
                          data: base64Data,
                        },
                      },
                    ],
                  },
                ],
              }),
            },
            15000
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText) {
              postCaption = generatedText.trim();
              console.log("Successfully generated caption via gemini-2.5-flash:", postCaption);
              break;
            } else {
              console.error("Gemini response structure invalid:", JSON.stringify(geminiData));
            }
          } else {
            console.error(`Gemini API call returned status ${geminiRes.status}:`, await geminiRes.text());
          }
        } catch (geminiErr: any) {
          console.error("Error during Gemini caption generation:", geminiErr.message || geminiErr);
        }
        attempt++;
        if (attempt < maxAttempts) {
          const delay = delays[attempt - 1] || 2000;
          console.log(`Waiting ${delay / 1000} seconds before retrying...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      if (!postCaption) {
        // Mark post as failed
        await sql`
          UPDATE post_queue 
          SET status = 'failed' 
          WHERE id = ${id}
        `;
        // Alert Telegram chat
        await fetchWithTimeout(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: `❌ *Scheduled Posting Failed*\n\nUnable to generate AI caption for queued post. The Gemini API was unavailable after 3 attempts. Post ID: \`${id}\`. Please check your system logs.`,
              parse_mode: "Markdown",
            }),
          },
          5000
        );
        throw new Error("Caption generation failed completely after retries.");
      }
    }

    // 3. Trigger Make.com Webhook
    if (!MAKE_WEBHOOK_URL) {
      throw new Error("MAKE_INSTAGRAM_WEBHOOK_URL is not configured.");
    }

    console.log("Sending payload to Make.com...");
    const makeRes = await fetchWithTimeout(
      MAKE_WEBHOOK_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url,
          caption: postCaption,
          is_story: is_story,
          source: "cron-scheduler",
          post_id: id,
        }),
      },
      15000
    );

    if (!makeRes.ok) {
      const makeErrText = await makeRes.text();
      throw new Error(`Make.com webhook failed with status ${makeRes.status}: ${makeErrText}`);
    }

    console.log("Successfully posted to Instagram via Make.com scenario.");

    // 4. Update Database Queue Status to Posted
    await sql`
      UPDATE post_queue 
      SET status = 'posted', posted_at = CURRENT_TIMESTAMP 
      WHERE id = ${id}
    `;

    // 5. Send Telegram confirmation
    await fetchWithTimeout(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `✅ *Auto-Post Published successfully!*\n\n📸 Visual: ${image_url}\n💬 Caption:\n_${postCaption}_`,
          parse_mode: "Markdown",
        }),
      },
      5000
    );

    return res.status(200).json({ ok: true, message: "Successfully published post.", id });
  } catch (err: any) {
    console.error("Cron post failed with error:", err.message || err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
