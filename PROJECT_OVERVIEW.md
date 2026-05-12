# Shopify Dev Studio — Project Overview

> **Repo:** `https://github.com/Parth7487/shopifydevstudio27.git`  
> **Branch:** `main`  
> **Local Path:** `/Users/parth/Downloads/Projects/Random/Shopifydevstudio`  
> **Last Updated:** 2026-05-12

---

## 🗂️ What This Project Is

A **premium Shopify agency portfolio website** — fully custom-built with React 18, TypeScript, Vite, TailwindCSS, Framer Motion, and React Three Fiber (3D). It is a **multi-page SPA** that markets a Shopify theme development studio. It showcases services, past work (portfolio), team process, partners, blog, documentation, and a contact/support flow.

The site is deployed to **Vercel** and optionally **Netlify**, with GitHub as the version-controlled source of truth.

---

## 🔗 Git Remote — Push/Pull Workflow

The repo is already connected to GitHub origin:

```bash
# Check remote
git remote -v
# → origin  https://github.com/Parth7487/shopifydevstudio27.git (fetch/push)

# Pull latest changes
git pull origin main

# After making changes locally, push back
git add .
git commit -m "your commit message"
git push origin main
```

> ⚠️ Always pull before making changes to avoid merge conflicts.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite 6 (SWC plugin) |
| Routing | React Router DOM v6 (SPA mode) |
| Styling | TailwindCSS 3 + custom CSS variables |
| Animations | Framer Motion 12 |
| 3D Graphics | React Three Fiber + Three.js + Drei |
| State/Data | TanStack React Query v5 |
| Database | Supabase (portfolio projects) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React + Tabler Icons |
| UI Primitives | Radix UI (full set) |
| i18n | Custom LanguageContext + translations.ts |
| Deployment | Vercel (primary) + Netlify (alternate) |
| Dev Server Port | `8080` |

---

## 📁 Full Project Structure

```
Shopifydevstudio/
├── src/
│   ├── App.jsx                     # Root router — all routes defined here
│   ├── main.tsx                    # App entry point
│   ├── index.css                   # Global styles, CSS variables, Tailwind directives
│   ├── App.css                     # App-level animation styles
│   │
│   ├── pages/                      # One file per route
│   │   ├── Index.tsx               # Home page (/)
│   │   ├── Services.tsx            # /services
│   │   ├── Process.tsx             # /process
│   │   ├── About.tsx               # /about
│   │   ├── Work.tsx                # /work (portfolio gallery — largest file ~40KB)
│   │   ├── Partners.tsx            # /partners (~28KB)
│   │   ├── Blog.tsx                # /blog
│   │   ├── Documentation.tsx       # /documentation
│   │   ├── Support.tsx             # /support
│   │   ├── FAQ.tsx                 # /faq
│   │   ├── Admin.tsx               # /admin (internal project management)
│   │   ├── FaviconExport.tsx       # /favicon-export (utility page)
│   │   └── NotFound.tsx            # 404 page
│   │
│   ├── components/
│   │   ├── sections/               # All page section components
│   │   │   ├── ElegantNavigation.tsx       # ← ACTIVE nav (used in all pages)
│   │   │   ├── CinematicNavigation.tsx     # Legacy nav (not in use on Index)
│   │   │   ├── ElegantHero.tsx             # ← ACTIVE home hero section
│   │   │   ├── CinematicHero.tsx           # Legacy 3D hero with React Three Fiber
│   │   │   ├── Footer.tsx                  # Site footer (all pages)
│   │   │   ├── StatsSection.tsx            # Stats row on home
│   │   │   ├── WorkMarquee.tsx             # Scrolling portfolio marquee (forward)
│   │   │   ├── WorkMarqueeAlt.tsx          # Scrolling portfolio marquee (reverse)
│   │   │   ├── Process.tsx                 # Process steps section
│   │   │   ├── CollaborationSection.tsx    # "How we work" section
│   │   │   ├── FAQ.tsx                     # FAQ accordion
│   │   │   ├── ProblemSolution.tsx         # Problem/Solution section
│   │   │   ├── EnhancedContact.tsx         # Contact form (full-featured)
│   │   │   ├── AnimatedTestimonials.tsx    # Testimonials carousel
│   │   │   ├── ImageComparisonSection.tsx  # Before/After image slider
│   │   │   ├── InteractiveCaseStudies.tsx  # Case studies with tabs
│   │   │   ├── ElegantCaseStudies.tsx      # Alt case studies design
│   │   │   ├── CaseStudies.tsx             # Basic case studies
│   │   │   ├── ElegantServices.tsx         # Services cards (elegant)
│   │   │   ├── EnhancedServices.tsx        # Services with animations
│   │   │   ├── Services.tsx                # Basic services section
│   │   │   ├── About.tsx                   # About mini section
│   │   │   ├── Testimonials.tsx            # Static testimonials
│   │   │   ├── ScrollStoryPanel.tsx        # Scroll-driven storytelling
│   │   │   ├── CinematicFinalCTA.tsx       # End-of-page CTA (cinematic)
│   │   │   ├── FinalCTA.tsx                # End-of-page CTA (simple)
│   │   │   ├── CalendlyModal.tsx           # Calendly booking modal
│   │   │   ├── Navigation.tsx              # Basic nav (legacy)
│   │   │   ├── Hero.tsx                    # Basic hero (legacy)
│   │   │   ├── HeroWithFallback.tsx        # Hero with image fallback
│   │   │   ├── DesignPlayground.tsx        # Internal design tester
│   │   │   ├── Contact.tsx                 # Basic contact section
│   │   │   └── StatsSection.tsx            # Stats section
│   │   │
│   │   ├── ui/                     # 56 Radix-based UI components (shadcn pattern)
│   │   │   ├── button.tsx, input.tsx, dialog.tsx, card.tsx ...
│   │   │   ├── splash-cursor.tsx           # Fluid cursor effect (36KB)
│   │   │   ├── image-comparison.tsx        # Before/after slider
│   │   │   ├── mobile-card-slider.tsx      # Touch carousel
│   │   │   ├── animated-testimonials.tsx   # Testimonials animation
│   │   │   └── scroll-based-velocity.tsx   # Scroll velocity component
│   │   │
│   │   ├── CinematicIntroOverlay.tsx       # Intro animation overlay
│   │   ├── GoogleDriveSync.tsx             # Google Drive sync utility
│   │   ├── LanguageSwitcher.tsx            # i18n language toggle
│   │   ├── OptimizedImage.tsx              # Lazy-loading image wrapper
│   │   ├── Preloader.tsx                   # Page preloader animation (~8.7KB)
│   │   ├── RippleBackground.tsx            # Canvas ripple effect
│   │   ├── ScrollProgress.tsx              # Top scroll progress bar
│   │   └── SplashCursor.tsx                # Interactive cursor effect
│   │
│   ├── contexts/
│   │   └── LanguageContext.tsx             # Global language state (i18n)
│   │
│   ├── hooks/
│   │   ├── useProjects.ts                  # Supabase portfolio data hook
│   │   ├── use-scroll-reveal.tsx           # Scroll reveal animation hook
│   │   ├── use-mobile.tsx                  # Mobile breakpoint detection
│   │   └── use-toast.ts                    # Toast notification hook
│   │
│   └── lib/
│       ├── utils.ts                        # cn() utility (clsx + tailwind-merge)
│       ├── supabase.ts                     # Supabase client + types
│       ├── translations.ts                 # i18n strings (~16KB, multi-language)
│       ├── seo-meta.ts                     # SEO meta tags helper
│       ├── performance.ts                  # Perf monitoring utilities
│       ├── responsive-utils.ts             # Responsive helpers
│       ├── instant-loading.ts              # Loading optimization helpers
│       ├── netlify-db.ts                   # Netlify DB integration
│       ├── google-drive-sync.ts            # Google Drive API sync
│       ├── perf-audit.ts                   # Performance audit utility
│       └── breadcrumb-schema.ts            # JSON-LD breadcrumb schema
│
├── public/                         # Static assets
├── scripts/                        # Build scripts
│   ├── generate-sitemap.mjs        # Sitemap generator
│   ├── gzip-sitemap.mjs            # Sitemap gzip
│   └── ping-sitemap.mjs            # Sitemap ping to search engines
│
├── netlify/                        # Netlify edge functions
├── index.html                      # HTML entry point
├── package.json                    # Dependencies + npm scripts
├── vite.config.ts                  # Vite build config
├── tailwind.config.ts              # Tailwind design tokens
├── tsconfig.json                   # TypeScript config
├── components.json                 # shadcn/ui config
├── netlify.toml                    # Netlify deployment config
├── vercel.json                     # Vercel routing config
├── deploy.sh                       # Manual deploy script
├── DEPLOYMENT_CHECKLIST.md         # Deployment steps
├── VERCEL_DEPLOYMENT.md            # Vercel-specific notes
└── AGENTS.md                       # AI agent rules for this project
```

---

## 🗺️ Routes / Pages

| URL | Page File | Description |
|---|---|---|
| `/` | `Index.tsx` | Home page with hero, stats, marquee, process, FAQ, CTA |
| `/services` | `Services.tsx` | Services offered (theme dev, custom builds, etc.) |
| `/process` | `Process.tsx` | Step-by-step client workflow |
| `/about` | `About.tsx` | Team & studio story |
| `/work` | `Work.tsx` | Portfolio gallery (largest page ~40KB) |
| `/partners` | `Partners.tsx` | Shopify partner showcase |
| `/blog` | `Blog.tsx` | Blog/articles |
| `/documentation` | `Documentation.tsx` | Developer docs |
| `/support` | `Support.tsx` | Support center |
| `/faq` | `FAQ.tsx` | Frequently asked questions |
| `/admin` | `Admin.tsx` | Internal admin panel |
| `/404` | `NotFound.tsx` | 404 error page |
| `/work2`, `/Work2` | → `/work` | Legacy redirects |
| `/NotFound` | → `/404` | Legacy redirect |

---

## 🏠 Home Page (`/`) — Section Order

The home page (`Index.tsx`) renders these sections in order:

1. **Preloader** — animated loading screen (dismissed once)
2. **ElegantNavigation** — fixed top nav
3. **ElegantHero** — main hero section (above the fold)
4. **StatsSection** — key numbers/metrics
5. **WorkMarquee** — scrolling client portfolio strip (forward)
6. **WorkMarqueeAlt** — scrolling strip (reverse direction)
7. **Process** — how we work section
8. **CollaborationSection** — collaboration/team CTA
9. **FAQ** — accordion FAQ
10. **ProblemSolution** — problem vs solution pitch
11. **Footer** — site-wide footer

> All sections below the hero are **lazy loaded** via `React.lazy + Suspense`.

---

## 🎨 Design System

### Color Palette (tailwind.config.ts)

| Token | Hex | Usage |
|---|---|---|
| `black` | `#0A0A0A` | Page background |
| `charcoal` | `#1A1A1D` | Cards, footer |
| `graphite` | `#2C2C2E` | Dividers, borders |
| `beige` | `#E6B17E` | Primary accent — CTAs, active states |
| `clay` | `#D1A97A` | Secondary accent |
| `gold` (CSS var) | `#FFD580` | Used in CinematicHero/Nav (legacy) |
| `accent` (CSS var) | `#FF5E5B` | Secondary highlight (red-ish) |

### CSS Variables (index.css)

- `--primary`: Beige (`hsl(30 44% 70%)`)
- `--accent`: Red/coral (`hsl(2 100% 68%)` in dark mode)
- `--background`: Near-black (`#0A0A0A`)
- `--ring`: Gold (`hsl(42 100% 75%)` in dark mode)

### Typography

- Font: **Inter** (Google Fonts, weights 400/600/700)
- Body: `font-weight: 400`, `letter-spacing: -0.01em`
- Headings: `font-weight: 700`, `letter-spacing: -0.02em`

### Key Utility Classes

```css
.elegant-button    /* beige CTA button */
.elegant-card      /* dark card with subtle border */
.gpu-accelerated   /* hardware acceleration */
.no-scrollbar      /* hide scrollbar cross-browser */
.marquee-track     /* GPU-optimized marquee animation */
```

---

## 🔧 Navigation (`ElegantNavigation.tsx`)

The **active navigation** used on all pages. Key features:

- **Nav items:** Home, Services, Process, Work, Partners, About
- **Route preloading** on hover — chunks load before click for instant navigation
- **Active state detection** via `useLocation()`
- **Mobile menu** — full-screen overlay with all links
- **Language Switcher** — inline on mobile, dropdown on desktop
- **WhatsApp + Telegram** quick connect icons in nav
- **CTA button:** "Start the Conversation" → Calendly modal or `/contact`
- **Scroll behavior:** Transparent → `bg-black/95 backdrop-blur` when scrolled

---

## 💾 Data Layer (Supabase)

Portfolio project data is fetched from **Supabase**:

- **Table:** `portfolio_projects`
- **Fields:** `id`, `title`, `brand`, `description`, `image`, `video_url`, `category`, `tags[]`, `tech[]`, `metrics{conversion, load_time}`, `live_url`, `featured`, `has_video`, `status`, `created_at`, `updated_at`
- **Filter:** Only `status = 'published'` projects are shown
- **Real-time:** Supabase Realtime subscription auto-refreshes when data changes
- **Caching:** 30-second in-memory cache for instant repeat loads
- **Hook:** `useProjects()` in `src/hooks/useProjects.ts`

> Supabase credentials are provided via environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Without them, the app gracefully shows an empty portfolio.

---

## 🌍 Internationalisation (i18n)

- **Context:** `src/contexts/LanguageContext.tsx`
- **Translations:** `src/lib/translations.ts` (~16KB, multiple languages)
- **Switcher component:** `src/components/LanguageSwitcher.tsx`
- **Variants:** `dropdown` (desktop nav) and `inline` (mobile menu)
- Language preference detected from browser settings

---

## ⚡ Performance Optimizations

| Technique | Implementation |
|---|---|
| Route-level code splitting | All pages lazy-loaded except Index |
| Component lazy loading | Below-fold sections lazy-loaded in Index |
| Route preloading | Hover on nav triggers chunk prefetch |
| Query caching | React Query: 1h stale, 2h gc, no refetch on focus |
| In-memory project cache | 30s cache in `useProjects` hook |
| Image optimization | `OptimizedImage.tsx` with lazy loading |
| GPU-accelerated marquee | CSS `will-change: transform` + `translateZ(0)` |
| Mobile animation reduction | CSS overrides disable heavy transitions < 768px |
| Terser 3-pass minification | `passes: 3` in vite.config.ts |
| Manual chunk splitting | vendor / router / ui / query / motion chunks |
| Console dropped in prod | `drop_console: true` in terser |
| CSS containment | `contain: layout style paint` on sections |

---

## 📦 NPM Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at `http://localhost:8080` |
| `npm run build` | Production build (generates + gzips sitemap) |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Run Vitest unit tests |
| `npm run format.fix` | Prettier format all files |
| `npm run sitemap` | Generate + gzip sitemap only |
| `npm run deploy` | Build + deploy to GitHub Pages |

---

## 🚀 Deployment

### Vercel (Primary)
- Connected to GitHub — auto-deploys on push to `main`
- Config: `vercel.json`
- All routes rewrite to `index.html` for SPA routing

### Netlify (Alternate)
- Config: `netlify.toml`
- Edge functions in `/netlify/` directory
- Manual deploy: `npm run build` → deploy `dist/`

### Environment Variables Needed

```env
VITE_SUPABASE_URL=           # Supabase project URL
VITE_SUPABASE_ANON_KEY=      # Supabase anon/public key
VITE_CALENDLY_URL=           # Calendly booking URL (optional)
```

---

## 📞 Contact Info (in codebase)

| Channel | Value |
|---|---|
| Email 1 | `consult@shopifydevstudio.tech` |
| Email 2 | `shopifydevstudioo@gmail.com` |
| WhatsApp | `+91 74870 80421` |
| Telegram | `@prime2357` |
| Discord | `discord.gg/GcfkVXsn` |

---

## 🗂️ Key Files Quick Reference

| File | Purpose |
|---|---|
| `src/App.jsx` | All routes defined here |
| `src/pages/Index.tsx` | Home page composition |
| `src/components/sections/ElegantNavigation.tsx` | Active navigation component |
| `src/components/sections/ElegantHero.tsx` | Active hero component |
| `src/components/sections/Footer.tsx` | Footer with all links |
| `tailwind.config.ts` | All design tokens (colors, animations) |
| `src/index.css` | Global styles + CSS variables |
| `src/lib/supabase.ts` | Database client |
| `src/lib/translations.ts` | All i18n strings |
| `src/hooks/useProjects.ts` | Portfolio data fetching |
| `vite.config.ts` | Build config + dev server |

---

## 🔄 How to Make Changes & Push

```bash
# 1. Make sure you're up to date
git pull origin main

# 2. Make your changes (edit files, add features)

# 3. Check what changed
git status

# 4. Stage all changes
git add .

# 5. Commit with a descriptive message
git commit -m "feat: your change description"

# 6. Push to GitHub (triggers Vercel auto-deploy)
git push origin main
```

> The repo is on branch `main`. Vercel auto-deploys from this branch.  
> Use conventional commit prefixes: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`

---

## 🔮 Components Worth Knowing

### `CinematicHero.tsx` (Legacy but impressive)
- Full 3D React Three Fiber scene with a floating Shopify storefront
- Interactive canvas ripple background reacting to mouse position
- Parallax scroll effect via Framer Motion `useScroll`
- Floating metric badges (+127% Revenue, 0.9s Load Time, 99 Lighthouse)

### `WorkMarquee.tsx` / `WorkMarqueeAlt.tsx`
- GPU-accelerated CSS marquee with client logos/project thumbnails
- Pauses on hover
- Two rows, opposite scroll directions

### `Preloader.tsx`
- Animated splash screen shown once on first page load
- Calls `onComplete` callback to unmount itself

### `LanguageSwitcher.tsx`
- Reads from `LanguageContext`
- Two variants: `dropdown` (desktop) and `inline` (mobile menu)

### `useProjects.ts`
- Fetches from Supabase `portfolio_projects` table
- Real-time subscription auto-refreshes on data change
- Falls back gracefully if Supabase env vars missing

---

*Document generated: 2026-05-12 | Auto-updated via AI pair programming*
