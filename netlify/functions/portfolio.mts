import { neon } from "@netlify/neon";
import type { Context, Config } from "@netlify/functions";

const sql = neon();

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const method = req.method;
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const projectId = pathSegments[pathSegments.length - 1];

  try {
    // GET all projects or single project
    if (method === 'GET') {
      if (projectId && projectId !== 'portfolio') {
        // Get single project
        const project = await sql`
          SELECT * FROM portfolio_projects 
          WHERE id = ${projectId} AND status = 'published'
        `;
        
        return new Response(JSON.stringify(project[0] || null), {
          status: project.length ? 200 : 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } else {
        // Get all published projects
        const projects = await sql`
          SELECT * FROM portfolio_projects 
          WHERE status = 'published'
          ORDER BY created_at DESC
        `;
        
        return new Response(JSON.stringify(projects), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // POST - Create new project
    if (method === 'POST') {
      const body = await req.json();
      const {
        title,
        brand,
        description,
        image,
        video_url,
        category,
        tags = [],
        tech = [],
        metrics = { conversion: "0%", load_time: "0s" },
        live_url,
        featured = false,
        has_video = false
      } = body;

      if (!title || !brand || !description || !image || !category || !live_url) {
        return new Response(JSON.stringify({
          error: 'Missing required fields: title, brand, description, image, category, live_url'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const [newProject] = await sql`
        INSERT INTO portfolio_projects (
          title, brand, description, image, video_url, category, 
          tags, tech, metrics, live_url, featured, has_video
        ) VALUES (
          ${title}, ${brand}, ${description}, ${image}, ${video_url}, ${category},
          ${tags}, ${tech}, ${JSON.stringify(metrics)}, ${live_url}, ${featured}, ${has_video}
        ) RETURNING *
      `;

      return new Response(JSON.stringify(newProject), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // PUT - Update project
    if (method === 'PUT' && projectId) {
      const body = await req.json();
      const {
        title,
        brand,
        description,
        image,
        video_url,
        category,
        tags,
        tech,
        metrics,
        live_url,
        featured,
        has_video,
        status
      } = body;

      const [updatedProject] = await sql`
        UPDATE portfolio_projects SET
          title = COALESCE(${title}, title),
          brand = COALESCE(${brand}, brand),
          description = COALESCE(${description}, description),
          image = COALESCE(${image}, image),
          video_url = COALESCE(${video_url}, video_url),
          category = COALESCE(${category}, category),
          tags = COALESCE(${tags}, tags),
          tech = COALESCE(${tech}, tech),
          metrics = COALESCE(${JSON.stringify(metrics)}, metrics),
          live_url = COALESCE(${live_url}, live_url),
          featured = COALESCE(${featured}, featured),
          has_video = COALESCE(${has_video}, has_video),
          status = COALESCE(${status}, status),
          updated_at = NOW()
        WHERE id = ${projectId}
        RETURNING *
      `;

      return new Response(JSON.stringify(updatedProject), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // DELETE - Delete project
    if (method === 'DELETE' && projectId) {
      await sql`
        DELETE FROM portfolio_projects WHERE id = ${projectId}
      `;

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response('Method not allowed', { status: 405 });

  } catch (error) {
    console.error('Portfolio API error:', error);
    
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const config: Config = {
  path: "/api/portfolio/*"
};
