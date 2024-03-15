import {  NextResponse } from "next/server";
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
    
export async function POST(req, res){
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const body = await req.json();
  const paymentId = body.order_id;
  const status = body.payment_status;
  if (status == `finished`) {
    const updateQuery = {
      text: `UPDATE users SET paymentStatus = true WHERE order_id = $1;`,
      values: [paymentId]
    };
    const resultwebhoook=await pool.query(updateQuery);
  return NextResponse.json({ message: "User Payment Status has been set to true" },{status:200});

  }
  return NextResponse.json({ message: "Payment recieved successfully" },{status:200});
}
