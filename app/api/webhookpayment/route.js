import { NextResponse } from "next/server";
import { Pool } from 'pg';
import { sendPostRequest } from "../../utils/helper";


const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
 // Add SSL configuration if required for your database
});

export async function POST(request, response) {
    try {
      const text = await request.text();
      const formData = text.split(/\r?\n--[^\r\n]+(?=\r?\nContent-Disposition)/).slice(1);
      const jsonData = {};
      for (const pair of formData) {
        const [header, value] = pair.split(/\r?\n\r?\n/);
        const [_, name, ...rest] = header.match(/Content-Disposition: form-data; name="([^"]+)"/);
  
        
        if (name.startsWith("payment_history")) {
          const subParts = name.split("[");
          let currentObject = jsonData;
          for (let i = 0; i < subParts.length - 1; i++) {
            const subName = subParts[i].slice(0, -1);
            currentObject[subName] = currentObject[subName] || {};
            currentObject = currentObject[subName];
          }
          const subName = subParts[subParts.length - 1].slice(0, -1);
          currentObject[subName] = value;
        } else {
          jsonData[name] = value.trim(); // Remove leading/trailing whitespace
        }
      }
const response=  JSON.stringify(jsonData, null, 2);
const webhookResponse =JSON.parse(response);
// console.log("🚀 ~ POST ~ webhookResponse:", webhookResponse)

  if (webhookResponse.confirmations == 1 && webhookResponse.type == "send") {
    // Construct the SQL query to update the payment status
    const updateQuery = {
      text: `UPDATE users SET paymentStatus = true WHERE order_id = $1;`,
      values: [webhookResponse.merchant_id]
    };
    console.log("🚀 ~ POST ~ updateQuery:", updateQuery)

    // Execute the query
    const resultwebhoook=await pool.query(updateQuery);
    // console.log("🚀 ~ POST ~ resultwebhoook:", resultwebhoook);
    const selectQuery = {
      text: `SELECT * FROM users WHERE order_id = $1;`,
      values: [webhookResponse.merchant_id],
    };
    

    const result = await pool.query(selectQuery);
    // console.log("🚀 ~ POST ~ result:", result)
    if (result) {
      const userData = await result.rows[0];
      // console.log("🚀 ~ POST ~ userData:", userData)
      const nameParts = userData.full_name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts[1];
// console.log("i am at send post");
      // sending POST Request to abandon cart
    await  sendPostRequest(
    "https://hook.us1.make.com/k965pa9fucx98txicvw3o9b1dbb272s5",
    {
      first_name: firstName,
      last_name: lastName,
      email: userData.email,
      telegram: userData.telegram,
      order_id: userData.order_id,
      wallet_id: webhookResponse.wallet_id,
      address: webhookResponse.address,
      coin_short_name: webhookResponse.coin_short_name,
      date: webhookResponse.date,
      txid: webhookResponse.txid,
      cta_btn: `https://gem-hunters-puce.vercel.app/payinvoice?name=${userData.full_name}&email=${userData.email}&telegram=${userData.telegram}`,
    }
  );
  

    }
}

      return new Response("Success!", { status: 200 });
    } catch (error) {
      return new Response(`Webhook error: ${error.message}`, {
        status: 400,
      });
    }
  }