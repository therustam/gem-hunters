// pages/api/createCoinRemitterInvoice.js

import { NextResponse } from "next/server";


export async function POST(req, res ) {



    //  const API_URL = 'https://coinremitter.com/api/v3/BTC/create-invoice';
        // const API_KEY = "$2y$10$DIVAbCj6mLpY2TviOPVD2eovRxguIXc3V1fVndSo5gN46afKMDxni";
      
        const isTCN=true;
        const requestUrl=`https://coinremitter.com/api/v3/${isTCN?'TCN':'ETH'}/create-invoice`;
        const apiKey=isTCN?'$2y$10$DIVAbCj6mLpY2TviOPVD2eovRxguIXc3V1fVndSo5gN46afKMDxni':'$2y$10$ATon6Tb/wl.vngU3MdtSDOzJaflI87LQ2O0gg5I7KHDvngIWEs6Ai';
        const apiPassword=isTCN?"devDigital":"GemRemitter";

        console.log(isTCN,requestUrl,apiKey,apiPassword)
       const response = await fetch(requestUrl, {
           method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              api_key:apiKey,
              password: apiPassword,
               amount: "1",
               success_url:`https://lightlabs.io`
               
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

