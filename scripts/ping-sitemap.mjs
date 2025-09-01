#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

function getBaseUrl() {
  const envUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || "";
  try {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const fromPkg = pkg?.homepage || "";
    return (envUrl || fromPkg || "https://shopifystudio.tech").replace(
      /\/$/,
      "",
    );
  } catch {
    return (envUrl || "https://shopifystudio.tech").replace(/\/$/, "");
  }
}

const baseUrl = getBaseUrl();
const sitemapUrl = `${baseUrl}/sitemap.xml`;

async function ping() {
  const targets = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];
  for (const url of targets) {
    try {
      const res = await fetch(url, { method: "GET" });
      console.log(`[PING] ${url} -> ${res.status}`);
    } catch (e) {
      console.error(`[PING ERROR] ${url} ->`, e?.message || e);
    }
  }
}

ping();
