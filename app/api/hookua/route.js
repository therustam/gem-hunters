import { NextResponse } from "next/server";

export async function POST(req, res) {
    const { first_name, last_name,email, telegram,order_id } = await req.json();
    try {
    const response = await fetch("https://hook.us1.make.com/k965pa9fucx98txicvw3o9b1dbb272s5", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            telegram,
            order_id
        }),
      });
      const data = await response.json();
      return NextResponse.json({ message: 'Email has been sent successfully!' },{status:200});


    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ message: 'Internal server error' }, {
        status: 500,
      });
    }
  }