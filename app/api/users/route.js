// import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';
const pool = createPool({
  connectionString: process.env.POSTGRES_URL
});

export async function GET(req,res) {
  // console.log("I am at get users")
  const searchParams = req.nextUrl.searchParams
  const email = searchParams.get('email')
  // console.log("🚀 ~ GET ~ email:", email)
  const telegram = searchParams.get('telegram')
  try {
  if (!email || !telegram) {
    return NextResponse.json({ message: 'Email or telegram is required' },{status:400});
  }
  const getUserQuery = {
    text: `SELECT * FROM users WHERE email = $1;`,
    values: [email]
  };
  const result = await pool.query(getUserQuery);
  if (result.rows.length > 0) {
    const Paymentstatus =await result.rows[0].paymentstatus; 

    return NextResponse.json({ message: 'User exist' },{status:200},{Paymentstatus:Paymentstatus});

  }
  return NextResponse.json({ message: 'User not exist' });
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error)
    
  }
  return NextResponse.json({ message: 'User not exist' });
}
export async function POST(req, res) {
  const { full_name, email, telegram,order_id } = await req.json();
  try {
    if (!pool) {
      throw new Error("Failed to create connection pool");
    }
    const currentDate = new Date();
    const insertUserQuery = {
      text: `INSERT INTO users (full_name, email, telegram, order_id, dateandtime)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *;`,
      values: [full_name, email, telegram, order_id, currentDate]
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



