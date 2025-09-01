import { neon } from "@netlify/neon";
import type { Context, Config } from "@netlify/functions";

const sql = neon();

export default async (req: Request, context: Context) => {
  try {
    // Create portfolio_projects table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_projects (
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

    // Create index for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio_projects(status);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_projects(category);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio_projects(created_at DESC);
    `;

    // Check if we have any data
    const [{ count }] = await sql`
      SELECT COUNT(*) as count FROM portfolio_projects;
    `;

    const result = {
      success: true,
      message: 'Database initialized successfully',
      tableCreated: true,
      projectCount: parseInt(count),
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const config: Config = {
  path: "/api/db-init"
};
