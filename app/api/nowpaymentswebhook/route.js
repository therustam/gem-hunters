import { NextResponse } from "next/server";
import { Pool } from 'pg';
import crypto from 'crypto';

// Your IPN Secret Key from NowPayments

const pool = new Pool({
  connectionString: "postgres://default:3yv0cjtmhRZk@ep-jolly-lake-a4xkkfdk-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
  // Add SSL configuration if required for your database
});

// export const config = {
  //   api: {
    //     bodyParser: false, // Disable body parsing for NowPayments webhook
    //   },
    // };
    
    
export default async function POST(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
        
    const IPN_SECRET = 'xtXcZD3BxSpF7HjnLjsfMrOvPJtJFKeY';

    const receivedHmac = req.headers.get('x-nowpayments-sig');
    const requestBody = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha512', IPN_SECRET);
    hmac.update(requestBody);
    const signature = hmac.digest('hex');

      if (signature === receivedHmac) {
      // Signature matches, process the notification
      // Convert body to JSON and process further according to your logic
      const data = JSON.parse(req.body);
      console.log("Valid IPN received", data);

        // Here, you can update the payment status in your database
        // For example, set paymentStatus to true for the user/order

        // return new NextResponse(JSON.stringify({ message: 'IPN Processed Successfully' }), {status: 200});
        return res.status(200).json({ message: 'IPN Processed Successfully' });
      } else {
        console.error('Invalid IPN signature');
        return res.status(400).json({ error: 'Invalid signature' });
      }
    } catch (error) {
      console.error('Error processing IPN:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
}