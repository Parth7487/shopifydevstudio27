#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

function getBaseUrl() {
  const envUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || '';
  const fallback = 'https://shopifystudio.tech';
  try {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    const fromPkg = pkg?.homepage || '';
    return (envUrl || fromPkg || fallback).replace(/\/$/, '');
  } catch {
    return (envUrl || fallback).replace(/\/$/, '');
  }
}

const baseUrl = getBaseUrl();

// Define the public, crawlable routes. Keep in sync with src/App.jsx
const routes = [
  '/',
  '/services',
  '/process',
  '/about',
  '/work',
  '/blog',
  '/documentation',
  '/support',
  '/faq',
  '/partners',
  '/favicon-export',
];

const priorities = new Map([
  ['/', '1.0'],
  ['/work', '0.9'],
  ['/services', '0.8'],
  ['/process', '0.7'],
  ['/about', '0.7'],
  ['/blog', '0.6'],
  ['/documentation', '0.5'],
  ['/support', '0.5'],
  ['/faq', '0.5'],
  ['/partners', '0.4'],
  ['/favicon-export', '0.2'],
]);

const lastmod = new Date().toISOString();

function buildXml() {
  const urls = routes
    .map((path) => {
      const loc = `${baseUrl}${path}`;
      const priority = priorities.get(path) || '0.5';
      const changefreq = path === '/' || path === '/work' ? 'weekly' : path === '/services' || path === '/process' || path === '/about' || path === '/blog' ? 'weekly' : path === '/favicon-export' ? 'yearly' : 'monthly';
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function writeTargets(xml) {
  const publicDir = join(root, 'public');
  mkdirSync(publicDir, { recursive: true });
  const publicTarget = join(publicDir, 'sitemap.xml');
  writeFileSync(publicTarget, xml, 'utf8');

  const distDir = join(root, 'dist');
  if (existsSync(distDir)) {
    const distTarget = join(distDir, 'sitemap.xml');
    writeFileSync(distTarget, xml, 'utf8');
  }
}

const xml = buildXml();
writeTargets(xml);
console.log(`Sitemap generated for ${routes.length} routes at ${new Date().toISOString()}`);
