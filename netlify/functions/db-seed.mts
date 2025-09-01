import { neon } from "@netlify/neon";
import type { Context, Config } from "@netlify/functions";

const sql = neon();

const sampleProjects = [
  {
    title: "Kotn - Sustainable Fashion",
    brand: "Kotn",
    description: "A premium Egyptian cotton fashion brand that champions sustainable manufacturing. The site features immersive storytelling about their supply chain, impact tracking dashboards, and interactive product customization tools that helped increase customer engagement by showcasing their commitment to ethical fashion.",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
    video_url: "https://player.vimeo.com/video/847503258?autoplay=1&loop=1&muted=1",
    category: "Fashion",
    tags: ["Sustainable Fashion", "Story-driven"],
    tech: ["Shopify Plus", "Custom Apps", "Mobile First"],
    metrics: { conversion: "420%", load_time: "0.6s" },
    live_url: "https://kotn.com/",
    featured: true,
    has_video: true
  },
  {
    title: "Rothy's - Sustainable Shoes", 
    brand: "Rothy's",
    description: "Revolutionary footwear brand creating shoes from recycled plastic bottles. The website showcases their innovative 3D knitting technology with interactive product visualization, precise size matching algorithms, and virtual try-on features that reduced returns and boosted customer confidence.",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
    video_url: "https://player.vimeo.com/video/743163629?autoplay=1&loop=1&muted=1",
    category: "Fashion",
    tags: ["3D Technology", "Sustainability"],
    tech: ["Shopify Plus", "AR Integration", "Custom Quiz"],
    metrics: { conversion: "385%", load_time: "0.7s" },
    live_url: "https://rothys.com/",
    featured: false,
    has_video: true
  },
  {
    title: "Fenty Beauty - Inclusive Beauty",
    brand: "Fenty Beauty", 
    description: "Rihanna's groundbreaking beauty empire that redefined inclusivity in cosmetics. The platform features advanced shade matching AI, virtual try-on experiences, and user-generated content galleries that celebrate diversity, resulting in record-breaking product launches and community engagement.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
    video_url: "https://player.vimeo.com/video/731423904?autoplay=1&loop=1&muted=1",
    category: "Beauty",
    tags: ["Shade Matching", "AR Try-On"],
    tech: ["Shopify Plus", "AR Technology", "Live Chat"],
    metrics: { conversion: "450%", load_time: "0.5s" },
    live_url: "https://fentybeauty.com/",
    featured: true,
    has_video: true
  }
];

export default async (req: Request, context: Context) => {
  try {
    // Check if projects already exist
    const [{ count }] = await sql`
      SELECT COUNT(*) as count FROM portfolio_projects;
    `;

    if (parseInt(count) > 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Database already seeded',
        projectCount: parseInt(count),
        seeded: false
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert sample projects
    const insertedProjects = [];
    
    for (const project of sampleProjects) {
      const [insertedProject] = await sql`
        INSERT INTO portfolio_projects (
          title, brand, description, image, video_url, category,
          tags, tech, metrics, live_url, featured, has_video
        ) VALUES (
          ${project.title}, ${project.brand}, ${project.description}, 
          ${project.image}, ${project.video_url}, ${project.category},
          ${project.tags}, ${project.tech}, ${JSON.stringify(project.metrics)}, 
          ${project.live_url}, ${project.featured}, ${project.has_video}
        ) RETURNING *
      `;
      insertedProjects.push(insertedProject);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Database seeded successfully',
      projectCount: insertedProjects.length,
      seeded: true,
      projects: insertedProjects
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Database seeding error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config: Config = {
  path: "/api/db-seed"
};
