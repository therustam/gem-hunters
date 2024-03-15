import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  // const { amount, currency, order_id, order_description, ipn_callback_url, success_url, cancel_url, partially_paid_url, is_fixed_rate, is_fee_paid_by_user } = req.body;
  try {
    // Generate a unique order ID
    const order_id = uuidv4();
    // console.log("POST req orderId->",orderId)
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'x-api-key': process.env.NOW_PAYMENT_API_KEY,
        'x-api-key': "S14GM4E-BT549YD-P3FXCWH-2FSC0AX",
      },
      body: JSON.stringify({
        price_amount: 999,
        price_currency: "usd",
        order_id,  
        order_description:'Stocks',
        ipn_callback_url: "https://gem-hunters-2f4da8jhe-russ-the-man.vercel.app/api/nowpaymentswebhook",
        success_url: "https://nowpayments.io",
        cancel_url: "https://nowpayments.io",
        partially_paid_url: "https://nowpayments.io",
        is_fixed_rate: true,
        is_fee_paid_by_user: false
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
      console.log('asdhauf')
    } else {
      return NextResponse.json({ message: "Error creating invoice", data });
    }
  } catch (error) {
    console.error("Error in createPaymentInvoice:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message });
  }
}