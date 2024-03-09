import { NextResponse } from "next/server";

export async function POST(req, res ) {



     const API_URL = 'https://coinremitter.com/api/v3/BTC/create-invoice';
        const API_KEY = "$2y$10$Q8P7AB/s9tNNxbRhis/BPeA85PzlJyTVTSVcCAZjjPzRq8iEucvmW";
      

       const response = await fetch(API_URL, {
           method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              api_key:API_KEY,
              password: "gemhunters2024",
               amount: "2",
              // currency: "EUR",
               
         }),
        });
      //  console.log("sdjfas",response)
       const data = await response.json()
      //  console.log("🚀 ~ POST ~ data:", data)
       if (response.ok) {
                    return NextResponse.json(data);
                }
      return  NextResponse.json({message:"Order created successfully",data})   
  }