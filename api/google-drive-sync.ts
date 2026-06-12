import { neon } from "@netlify/neon";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const sql = neon(process.env.DATABASE_URL || "");

interface GoogleDriveImage {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink: string;
  thumbnailLink: string;
  mimeType: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
}

// Convert Google Drive file ID to direct image URL
const getDirectImageUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

// Fetch images from Google Drive folder
const fetchImagesFromFolder = async (
  apiKey: string,
  folderId: string
): Promise<GoogleDriveImage[]> => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?` +
      `q='${folderId}' in parents and (mimeType contains 'image/')&` +
      `fields=files(id,name,webViewLink,webContentLink,thumbnailLink,mimeType,size,createdTime,modifiedTime)&` +
      `key=${apiKey}&` +
      `orderBy=modifiedTime desc`
  );

  if (!response.ok) {
    throw new Error(
      `Google Drive API error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as any;
  return data.files || [];
};

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
    const { apiKey, folderId, action = "sync" } = req.body || {};

    if (!apiKey || !folderId) {
      return res.status(400).json({
        error: "Missing required parameters: apiKey and folderId",
      });
    }

    if (action === "fetch") {
      const images = await fetchImagesFromFolder(apiKey, folderId);
      return res.status(200).json({ images });
    }

    if (action === "sync") {
      const driveImages = await fetchImagesFromFolder(apiKey, folderId);

      // Fetch current portfolio projects from Neon
      const projects = await sql`
        SELECT * FROM portfolio_projects 
        WHERE status = 'published'
      `;

      const errors: string[] = [];
      let updated = 0;

      // Try to match images to projects based on name patterns
      for (const project of projects || []) {
        try {
          const matchingImage = driveImages.find((img) => {
            const imgName = img.name.toLowerCase();
            const brandName = project.brand.toLowerCase();
            const titleName = project.title
              .toLowerCase()
              .replace(/[^a-z0-9]/gi, "");

            return (
              imgName.includes(brandName) ||
              imgName.includes(titleName) ||
              brandName.includes(imgName.replace(/\.[^/.]+$/, ""))
            );
          });

          if (matchingImage) {
            const directImageUrl = getDirectImageUrl(matchingImage.id);

            await sql`
              UPDATE portfolio_projects 
              SET image = ${directImageUrl}, updated_at = NOW() 
              WHERE id = ${project.id}
            `;
            updated++;
          }
        } catch (error) {
          errors.push(
            `Error processing ${project.title}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }

      return res.status(200).json({
        success: errors.length === 0,
        updated,
        errors,
        totalImages: driveImages.length,
        totalProjects: projects?.length || 0,
      });
    }

    if (action === "update") {
      const { projectId, imageFileId } = req.body || {};

      if (!projectId || !imageFileId) {
        return res.status(400).json({
          error: "Missing projectId or imageFileId",
        });
      }

      const directImageUrl = getDirectImageUrl(imageFileId);

      await sql`
        UPDATE portfolio_projects 
        SET image = ${directImageUrl}, updated_at = NOW() 
        WHERE id = ${projectId}
      `;

      return res.status(200).json({
        success: true,
        message: "Project image updated successfully",
      });
    }

    return res.status(400).json({
      error: "Invalid action. Use: fetch, sync, or update",
    });
  } catch (error) {
    console.error("Google Drive sync error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
