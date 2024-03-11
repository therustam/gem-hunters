// pages/api/createCoinRemitterInvoice.js

import { NextResponse } from "next/server";


export async function POST(req, res ) {



    //  const API_URL = 'https://coinremitter.com/api/v3/BTC/create-invoice';
        // const API_KEY = "$2y$10$DIVAbCj6mLpY2TviOPVD2eovRxguIXc3V1fVndSo5gN46afKMDxni";
      

       const response = await fetch(process.env.COIN_URL, {
           method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              api_key:"$2y$10$Q8P7AB/s9tNNxbRhis/BPeA85PzlJyTVTSVcCAZjjPzRq8iEucvmW",
              password: "devDigital",
               amount: "1",
            //    success_url:`${process.env.DOMAIN_URL}/paymentsuccess`
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

