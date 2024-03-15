"use client"
import { Flex, Loader } from '@mantine/core'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const searchParams = useSearchParams();
    const full_name =searchParams.get("name");
    const email =searchParams.get("email");
    const telegram =searchParams.get("telegram");
    const nameParts = full_name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts[1];
    const checkUserPaymentStatus = async () =>{
        const gerUserResponse =await fetch(`/api/users?email=${email}&telegram=${telegram}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
      
          })
         
          const userExist = await gerUserResponse.json();
          console.log("🚀 ~ checkUserPaymentStatus ~ userExist:", userExist)
    }
  return (
    <div>
        <Flex bg={"#000D1E"} align={"center"} justify={"center"} w={"100%"} h={"100vh"} >
        <Loader color="#fff" />
        </Flex>
    </div>
  )
}

export default page