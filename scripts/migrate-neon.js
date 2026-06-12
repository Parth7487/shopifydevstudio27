import { neon } from '@netlify/neon';
import fs from 'fs';
import path from 'path';

// Parse .env file locally
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  }
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Error: DATABASE_URL is not set in environment or .env file');
  process.exit(1);
}

process.env.DATABASE_URL = databaseUrl;
process.env.NETLIFY_DATABASE_URL = databaseUrl;

const sampleProjects = [
  {
    title: "Kotn - Sustainable Fashion",
    brand: "Kotn",
    description: "A premium Egyptian cotton fashion brand that champions sustainable manufacturing. The site features immersive storytelling about their supply chain, impact tracking dashboards, and interactive product customization tools that helped increase customer engagement by showcasing their commitment to ethical fashion.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fedcb8435931f44eb9b505c05d6b5320b?format=webp&width=1280",
    video_url: "https://player.vimeo.com/video/847503258?autoplay=1&loop=1&muted=1",
    category: "Fashion",
    tags: ["Sustainable Fashion", "Story-driven"],
    tech: ["Shopify Plus", "Custom Apps", "Mobile First"],
    metrics: { conversion: "420%", load_time: "0.6s" },
    live_url: "https://kotn.com/",
    featured: true,
    has_video: true,
  },
  {
    title: "Rothy's - Sustainable Shoes",
    brand: "Rothy's",
    description: "Revolutionary footwear brand creating shoes from recycled plastic bottles. The website showcases their innovative 3D knitting technology with interactive product visualization, precise size matching algorithms, and virtual try-on features that reduced returns and boosted customer confidence.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fd4ca22878f6648a8914d31d02e810994?format=webp&width=1280",
    video_url: "https://player.vimeo.com/video/743163629?autoplay=1&loop=1&muted=1",
    category: "Fashion",
    tags: ["3D Technology", "Sustainability"],
    tech: ["Shopify Plus", "AR Integration", "Custom Quiz"],
    metrics: { conversion: "385%", load_time: "0.7s" },
    live_url: "https://rothys.com/",
    featured: false,
    has_video: true,
  },
  {
    title: "Fenty Beauty - Inclusive Beauty",
    brand: "Fenty Beauty",
    description: "Rihanna's groundbreaking beauty empire that redefined inclusivity in cosmetics. The platform features advanced shade matching AI, virtual try-on experiences, and user-generated content galleries that celebrate diversity, resulting in record-breaking product launches and community engagement.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F65b6338bafb244c19dbffc3a5eb0f08d?format=webp&width=1280",
    video_url: "https://player.vimeo.com/video/731423904?autoplay=1&loop=1&muted=1",
    category: "Beauty",
    tags: ["Shade Matching", "AR Try-On"],
    tech: ["Shopify Plus", "AR Technology", "Live Chat"],
    metrics: { conversion: "450%", load_time: "0.5s" },
    live_url: "https://fentybeauty.com/",
    featured: true,
    has_video: true,
  },
  {
    title: "Herbivore Botanicals - Clean Beauty",
    brand: "Herbivore",
    description: "Clean beauty pioneer emphasizing ingredient transparency and natural formulations. The site features detailed ingredient sourcing stories, interactive skin analysis quizzes, educational content about clean beauty, and personalized product recommendations based on skin type and concerns.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F8b6ff11188004f2f987b8c3bbeb05763?format=webp&width=800",
    video_url: "",
    category: "Beauty",
    tags: ["Clean Beauty", "Ingredient Focus"],
    tech: ["Shopify", "Quiz Integration", "Clean Code"],
    metrics: { conversion: "340%", load_time: "0.8s" },
    live_url: "https://herbivorebotanicals.com/",
    featured: false,
    has_video: false,
  },
  {
    title: "Burrow - Modular Furniture",
    brand: "Burrow",
    description: "Modern furniture brand specializing in modular, easy-to-assemble pieces. The website offers sophisticated 3D room visualization tools, drag-and-drop furniture configuration, AR placement features, and detailed assembly guides that simplified the furniture buying experience.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Ff76df5449ec447f1802e2eb11a4f74cc?format=webp&width=800",
    video_url: "https://player.vimeo.com/video/736275204?autoplay=1&loop=1&muted=1",
    category: "Home & Garden",
    tags: ["3D Visualization", "Modular Design"],
    tech: ["Shopify Plus", "3D Technology", "Custom Builder"],
    metrics: { conversion: "375%", load_time: "0.9s" },
    live_url: "https://burrow.com/",
    featured: false,
    has_video: true,
  },
  {
    title: "Tuft & Needle - Sleep Innovation",
    brand: "Tuft & Needle",
    description: "Sleep innovation company focused on premium mattresses and sleep optimization. Features an intelligent mattress selector quiz, sleep tracking integration, educational content about sleep science, and a comprehensive trial program that builds customer trust and reduces purchase anxiety.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F949702c24f604351b6197d59ac91fd17?format=webp&width=800",
    video_url: "",
    category: "Home & Garden",
    tags: ["Sleep Tech", "Quiz Builder"],
    tech: ["Shopify", "Sleep Quiz", "Trial System"],
    metrics: { conversion: "320%", load_time: "0.7s" },
    live_url: "https://tuftandneedle.com/",
    featured: false,
    has_video: false,
  },
  {
    title: "Daily Harvest - Superfood Delivery",
    brand: "Daily Harvest",
    description: "Superfood delivery service with nutritional tracking and meal planning tools.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fbaba4c9c65ac4e99a9cd8353423de404?format=webp&width=800",
    video_url: "",
    category: "Food & Beverage",
    tags: ["Superfood", "Meal Planning"],
    tech: ["Shopify Plus", "Nutrition API", "Meal Planner"],
    metrics: { conversion: "365%", load_time: "0.6s" },
    live_url: "https://daily-harvest.com/",
    featured: false,
    has_video: false,
  },
  {
    title: "Mejuri - Fine Jewelry",
    brand: "Mejuri",
    description: "Fine jewelry brand with virtual try-on technology and personalization features.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fd909e91b354a4c56981710883340e7e2?format=webp&width=800",
    video_url: "https://player.vimeo.com/video/456789123?autoplay=1&loop=1&muted=1",
    category: "Jewelry",
    tags: ["Virtual Try-On", "Fine Jewelry"],
    tech: ["Shopify Plus", "AR Technology", "Luxury Experience"],
    metrics: { conversion: "425%", load_time: "0.5s" },
    live_url: "https://mejuri.com/",
    featured: true,
    has_video: true,
  },
  {
    title: "Outdoor Voices - Athletic Wear",
    brand: "Outdoor Voices",
    description: "Community-driven athletic wear brand with social fitness integration and local event features.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F46ff449fe2264a32bcc421ec79f0fb81?format=webp&width=1280",
    video_url: "https://player.vimeo.com/video/678912345?autoplay=1&loop=1&muted=1",
    category: "Fashion",
    tags: ["Community Focus", "Athletic Wear"],
    tech: ["Shopify Plus", "Community Features", "Event API"],
    metrics: { conversion: "365%", load_time: "0.6s" },
    live_url: "https://outdoorvoices.com/",
    featured: false,
    has_video: true,
  },
  {
    title: "Death Wish Coffee - Bold Brews",
    brand: "Death Wish Coffee",
    description: "World's strongest coffee with subscription model and brewing guides integration.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fd3ccfd7f90bb40bba243ccf3e66ecd5d?format=webp&width=1280",
    video_url: "",
    category: "Food & Beverage",
    tags: ["Subscription Model", "Strong Coffee"],
    tech: ["Shopify Plus", "Subscription Engine", "Brewing Guides"],
    metrics: { conversion: "375%", load_time: "0.7s" },
    live_url: "https://deathwishcoffee.com/",
    featured: false,
    has_video: false,
  },
  {
    title: "Pura Vida - Artisan Jewelry",
    brand: "Pura Vida",
    description: "Handcrafted jewelry with charity partnerships and artisan story integration.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F536d0ae12a9a4a46b044b3bd7a6a5923?format=webp&width=1280",
    video_url: "https://player.vimeo.com/video/789012456?autoplay=1&loop=1&muted=1",
    category: "Jewelry",
    tags: ["Artisan Crafted", "Charity Partnership"],
    tech: ["Shopify Plus", "Charity Integration", "Artisan Stories"],
    metrics: { conversion: "410%", load_time: "0.6s" },
    live_url: "https://puravidabracelets.com/",
    featured: false,
    has_video: true,
  },
  {
    title: "Bombas - Comfort Socks",
    brand: "Bombas",
    description: "Comfort-focused socks with social impact tracking and donation matching program.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F74949d852c074bc4b57ff0fff3c297ee?format=webp&width=800",
    video_url: "",
    category: "Fashion",
    tags: ["Social Impact", "Comfort Technology"],
    tech: ["Shopify Plus", "Impact Tracking", "Donation System"],
    metrics: { conversion: "425%", load_time: "0.5s" },
    live_url: "https://bombas.com/",
    featured: false,
    has_video: false,
  },
  {
    title: "Triangl - Designer Swimwear",
    brand: "Triangl",
    description: "Luxury swimwear brand with virtual fitting technology and seasonal collections.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fb519514eaa674de1b183894be58328cd?format=webp&width=800",
    video_url: "",
    category: "Fashion",
    tags: ["Luxury Swimwear", "Virtual Fitting"],
    tech: ["Shopify Plus", "AR Fitting", "Seasonal Collections"],
    metrics: { conversion: "465%", load_time: "0.5s" },
    live_url: "https://triangl.com/",
    featured: true,
    has_video: false,
  },
  {
    title: "Fashion Nova - Fast Fashion",
    brand: "Fashion Nova",
    description: "Trendy fashion with influencer integration and real-time inventory management.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F18fae872d56b46c4a993bdf2fb7ff6ce?format=webp&width=800",
    video_url: "https://player.vimeo.com/video/901234678?autoplay=1&loop=1&muted=1",
    category: "Fashion",
    tags: ["Influencer Marketing", "Fast Fashion"],
    tech: ["Shopify Plus", "Influencer Platform", "Real-time Inventory"],
    metrics: { conversion: "385%", load_time: "0.7s" },
    live_url: "https://fashionnova.com/",
    featured: false,
    has_video: true,
  },
  {
    title: "Casper - Sleep Innovation",
    brand: "Casper",
    description: "Revolutionary sleep products with sleep tracking and personalized recommendations.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F6c1a58fd7160441ea71dd38a3916e374?format=webp&width=800",
    video_url: "",
    category: "Home & Garden",
    tags: ["Sleep Technology", "Personalization"],
    tech: ["Shopify Plus", "Sleep Quiz", "Smart Recommendations"],
    metrics: { conversion: "430%", load_time: "0.6s" },
    live_url: "https://casper.com/",
    featured: false,
    has_video: false,
  },
  {
    title: "Warby Parker - Eyewear Revolution",
    brand: "Warby Parker",
    description: "Affordable designer eyewear with virtual try-on and home try-on program.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fb1dbcacf16f54c05997a0ae856630d68?format=webp&width=800",
    video_url: "https://player.vimeo.com/video/012345789?autoplay=1&loop=1&muted=1",
    category: "Fashion",
    tags: ["Virtual Try-On", "Home Try-On"],
    tech: ["Shopify Plus", "AR Technology", "Try-On Program"],
    metrics: { conversion: "455%", load_time: "0.5s" },
    live_url: "https://warbyparker.com/",
    featured: true,
    has_video: true,
  },
  {
    title: "Glossier - Beauty Community",
    brand: "Glossier",
    description: "Community-driven beauty brand with user-generated content and skincare diagnostics.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F925b231ab1bf4c45aa302d09fe61667a?format=webp&width=800",
    video_url: "",
    category: "Beauty",
    tags: ["Community Driven", "User Generated"],
    tech: ["Shopify Plus", "Community Platform", "Skin Diagnostics"],
    metrics: { conversion: "475%", load_time: "0.4s" },
    live_url: "https://glossier.com/",
    featured: false,
    has_video: false,
  },
  {
    title: "Chubbies - Fun Menswear",
    brand: "Chubbies",
    description: "Fun men's shorts and apparel with gamified shopping and social sharing features.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F3f9d694493774c63bdcd12888444ad7e?format=webp&width=800",
    video_url: "",
    category: "Fashion",
    tags: ["Fun Apparel", "Gamification"],
    tech: ["Shopify Plus", "Gamification", "Social Sharing"],
    metrics: { conversion: "365%", load_time: "0.6s" },
    live_url: "https://chubbiesshorts.com/",
    featured: false,
    has_video: false,
  },
  {
    title: "Ritual - Smart Vitamins",
    brand: "Ritual",
    description: "Science-backed vitamins with ingredient transparency and health tracking integration.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fcff9690ccdaf4822b5df5f145edd9901?format=webp&width=800",
    video_url: "https://player.vimeo.com/video/234567901?autoplay=1&loop=1&muted=1",
    category: "Health & Wellness",
    tags: ["Science-Backed", "Transparency"],
    tech: ["Shopify Plus", "Health Tracking", "Ingredient Database"],
    metrics: { conversion: "420%", load_time: "0.5s" },
    live_url: "https://ritual.com/",
    featured: false,
    has_video: true,
  },
  {
    title: "Patagonia - Outdoor Gear",
    brand: "Patagonia",
    description: "Sustainable outdoor gear with environmental impact tracking and repair guides.",
    image: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fef8620b9e4954c9c8d2a95d1bc542c53?format=webp&width=800",
    video_url: "",
    category: "Sports & Outdoors",
    tags: ["Sustainability", "Outdoor Performance"],
    tech: ["Shopify Plus", "Impact Tracking", "Repair Guides"],
    metrics: { conversion: "415%", load_time: "0.6s" },
    live_url: "https://patagonia.com/",
    featured: true,
    has_video: false,
  }
];

async function main() {
  const sql = neon();

  console.log('1. Initializing Neon schema...');
  
  // Drop table if exists to start clean as requested
  await sql`DROP TABLE IF EXISTS portfolio_projects CASCADE`;

  await sql`
    CREATE TABLE portfolio_projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      brand VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      video_url TEXT,
      category VARCHAR(100) NOT NULL,
      tags TEXT[] DEFAULT '{}',
      tech TEXT[] DEFAULT '{}',
      metrics JSONB DEFAULT '{"conversion": "0%", "load_time": "0s"}',
      live_url TEXT NOT NULL,
      featured BOOLEAN DEFAULT false,
      has_video BOOLEAN DEFAULT false,
      status VARCHAR(20) DEFAULT 'published',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`CREATE INDEX idx_portfolio_status ON portfolio_projects(status);`;
  await sql`CREATE INDEX idx_portfolio_category ON portfolio_projects(category);`;
  await sql`CREATE INDEX idx_portfolio_created_at ON portfolio_projects(created_at DESC);`;

  console.log('Schema initialized successfully!');

  console.log(`2. Seeding ${sampleProjects.length} sample projects...`);

  for (const project of sampleProjects) {
    await sql`
      INSERT INTO portfolio_projects (
        title, brand, description, image, video_url, category,
        tags, tech, metrics, live_url, featured, has_video
      ) VALUES (
        ${project.title}, ${project.brand}, ${project.description}, 
        ${project.image}, ${project.video_url}, ${project.category},
        ${project.tags}, ${project.tech}, ${JSON.stringify(project.metrics)}, 
        ${project.live_url}, ${project.featured}, ${project.has_video}
      )
    `;
  }

  console.log('Database seeded successfully with all projects!');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
