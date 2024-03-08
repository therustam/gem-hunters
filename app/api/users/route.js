import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';

// Assuming you have environment variables set up for the connection string
const pool = createPool({
  connectionString: "postgres://default:3yv0cjtmhRZk@ep-jolly-lake-a4xkkfdk-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
  // (Optional) Other pool configuration options
});
export async function POST(req, res) {
  try {
    // Check connection pool creation
    if (!pool) {
      throw new Error("Failed to create connection pool");
    }

    const { full_name, email, telegram } = await req.json();
    console.log(" ~ POST ~ body:", full_name, email, telegram);

    const insertUserQuery = {
      text: `INSERT INTO users (full_name, email, telegram)
             VALUES ($1, $2, $3)
             RETURNING *;`,
      values: [full_name, email, telegram]
    };

    const result = await pool.query(insertUserQuery);
    console.log(" ~ POST ~ result:", result);

    if (result.rows.length > 0) {
      return NextResponse.json({ message: 'User created successfully!' });
    } else {
      return NextResponse.json({ message: 'Error creating user' }, {
        status: 500,
      });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, {
      status: 500,
    });
  }
}