#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { gzipSync } from "node:zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

function gzipFile(dir) {
  const xmlPath = join(dir, "sitemap.xml");
  if (!existsSync(xmlPath)) return false;
  const buf = readFileSync(xmlPath);
  const gz = gzipSync(buf, { level: 9 });
  writeFileSync(join(dir, "sitemap.xml.gz"), gz);
  return true;
}

const publicDone = gzipFile(join(root, "public"));
const distDone = gzipFile(join(root, "dist"));
console.log(`Sitemap gzip: public=${publicDone} dist=${distDone}`);
