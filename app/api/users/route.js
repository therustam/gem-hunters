// import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';
const pool = createPool({
  connectionString: "postgres://default:3yv0cjtmhRZk@ep-jolly-lake-a4xkkfdk-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
});
export async function GET(req,res) {
  console.log("I am at get users")
  const searchParams = req.nextUrl.searchParams
  const email = searchParams.get('email')
  const telegram = searchParams.get('telegram')
  try {
  if (!email || !telegram) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const getUserQuery = {
    text: `SELECT * FROM users WHERE email = $1;`,
    values: [email]
  };
  const result = await pool.query(getUserQuery);
  if (result.rows.length > 0) {
    return NextResponse.json({ message: 'User exist' },{status:200});

  }
  return NextResponse.json({ message: 'User not exist' });
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error)
    
  }

}
export async function POST(req, res) {
  const { full_name, email, telegram,coinremitter_merchant_id,paymentStatus } = await req.json();
  try {
    if (!pool) {
      throw new Error("Failed to create connection pool");
    }
    const insertUserQuery = {
      text: `INSERT INTO users (full_name, email, telegram,coinremitter_merchant_id,paymentStatus)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *;`,
      values: [full_name, email, telegram, coinremitter_merchant_id, paymentStatus]
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



