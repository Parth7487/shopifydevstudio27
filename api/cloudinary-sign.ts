import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "ddu46zaxl";
const API_KEY = process.env.CLOUDINARY_API_KEY || "686764961315939";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "dDIY-szQG-i4STaHFCX42Ja2ozk";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    // Generate a signed upload signature for the client to use
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "shopifydevstudio/portfolio";
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha256")
      .update(paramsToSign + API_SECRET)
      .digest("hex");

    return res.status(200).json({
      signature,
      timestamp,
      api_key: API_KEY,
      cloud_name: CLOUD_NAME,
      folder,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate signature" });
  }
}
