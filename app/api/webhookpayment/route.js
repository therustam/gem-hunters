import { NextResponse } from "next/server";
import { Pool } from 'pg';


const pool = new Pool({
  connectionString: "postgres://default:3yv0cjtmhRZk@ep-jolly-lake-a4xkkfdk-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
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
console.log("🚀 ~ POST ~ webhookResponse:", webhookResponse)

  if (webhookResponse.confirmations == 1 && webhookResponse.type == "send") {
    // Construct the SQL query to update the payment status
    const updateQuery = {
      text: `UPDATE users SET paymentStatus = true WHERE coinremitter_merchant_id = $1;`,
      values: [webhookResponse.merchant_id]
    };
    console.log("🚀 ~ POST ~ updateQuery:", updateQuery)

    // Execute the query
    const resultwebhoook=await pool.query(updateQuery);
    console.log("🚀 ~ POST ~ resultwebhoook:", resultwebhoook)
}

      return new Response("Success!", { status: 200 });
    } catch (error) {
      return new Response(`Webhook error: ${error.message}`, {
        status: 400,
      });
    }
  }