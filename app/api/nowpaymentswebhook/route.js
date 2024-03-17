import {  NextResponse } from "next/server";
import { Pool } from 'pg';
import { sendPostRequest } from "../../utils/helper";
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
    await pool.query(updateQuery);
    const selectQuery = {
      text: `SELECT * FROM users WHERE order_id = $1;`,
      values: [paymentId]
    };
  
    const result = await pool.query(selectQuery);
    
    if (result.rows.length > 0) {
      const userData =await result.rows[0]; 
      console.log("userData->",userData)
      const nameParts = userData.full_name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts[1];
      
      // sending POST Request to abandon cart
     sendPostRequest('https://hook.us1.make.com/k965pa9fucx98txicvw3o9b1dbb272s5', {
        first_name: firstName,
        last_name: lastName,
        email: userData.email,
        telegram:userData.telegram,
        order_id: userData?.order_id, 
        cta_btn:`https://gem-hunters-puce.vercel.app?name=${userData.full_name}&email=${userData.email}&telegram=${userData.telegram}`
      });
    } 

  return NextResponse.json({ message: "User Payment Status has been set to true" },{status:200});

  }
  return NextResponse.json({ message: "Payment recieved successfully" },{status:200});
}

