// import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';
import { sendPostRequest } from '../../utils/helper';
const pool = createPool({
  connectionString: process.env.POSTGRES_URL
});

export async function GET(req,res) {
  const searchParams = req.nextUrl.searchParams
  const email = searchParams.get('email')
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
    const paymentStatus =await result.rows[0].paymentstatus; 

    return NextResponse.json({ message: 'User exist',paymentStatus },{status:200});

  }
  return NextResponse.json({ message: 'User not exist' });
  } catch (error) {
    console.error("🚀 ~ GET ~ error:", error)
    
  }
  return NextResponse.json({ message: 'User not exist' });
}
export async function POST(req, res) {
  const { full_name, email, telegram,order_id } = await req.json();
  const nameParts = full_name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts[1];
  try {
    if (!pool) {
      throw new Error("Failed to create connection pool");
    }
    const currentDate = new Date();
    const paymentstatus= false;
    const insertUserQuery = {
      text: `INSERT INTO users (full_name, email, telegram,paymentstatus, order_id, dateandtime)
             VALUES ($1, $2, $3, $4, $5,$6)
             RETURNING *;`,
      values: [full_name, email, telegram,paymentstatus, order_id, currentDate]
    };

    const result = await pool.query(insertUserQuery);
    console.error(" ~ POST ~ result:", result);

    if (result.rows.length > 0) {
      sendPostRequest('https://hook.us1.make.com/k965pa9fucx98txicvw3o9b1dbb272s5', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        telegram:telegram,
        order_id: order_id, 
      });
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
export async function PUT(req, res) {
  const { email, order_id } = await req.json();

  try {
    if (!pool) {
      throw new Error("Failed to create connection pool");
    }

    const updateQuery = {
      text: `UPDATE users SET order_id = $1 WHERE email = $2 RETURNING *;`,
      values: [order_id, email]
    };

    const result = await pool.query(updateQuery);

    if (result.rowCount > 0) {  // Check if any rows were affected
      return NextResponse.json({ message: 'Order id has been updated successfully!', updated:true });
    } else {
      return NextResponse.json({ message: 'Error updating user order id', status: 404 });
    }

  } catch (error) {
    console.error('Error updating user order id:', error);
    return NextResponse.json({ message: 'Internal server error', status: 500 });
  }
}

