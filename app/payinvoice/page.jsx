"use client"
import { Flex, Loader, rem } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const PayInvoice = () => {
    const searchParams = useSearchParams();
    const email =searchParams.get("email");
    const telegram =searchParams.get("telegram");
    const router = useRouter() 
    const checkUserPaymentStatus = async () =>{
        const userNotificationId = notifications.show({
            loading: true,
            title: 'Checking for the payment Status',
            message: 'Checking if user info already exist',
            autoClose: false,
            withCloseButton: false,
          });
      //step 1 check for payment status in database pf specific user
        const gerUserResponse =await fetch(`/api/users?email=${email}&telegram=${telegram}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
      
          })
         
          const userExist = await gerUserResponse.json();
          if (userExist.paymentStatus == true) {
            notifications.update({
                id:userNotificationId,
                 color: 'green',
                 title: 'Payment paid',
                 message: `Payment has been paid successfully!`,
                 icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                 loading: false,
                 autoClose: 2000,
               });
               router.push("/signup")
          }else{
            notifications.update({
                id:userNotificationId,
                loading: true,
                title: 'Not paid',
                message: 'Creating invoice to pay!',
                autoClose: false,
                withCloseButton: false,
               });
               // step 2 if the user isn't payed yet  create an invoice and redirect him to it
               const invoiceResponse = await fetch(`/api/createCoinRemitterInvoice`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              });
        
              const data = await invoiceResponse.json();
              if(data.data.merchant_id){
                // step 3 update the order_id in databse
                const response= await fetch("/api/users", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, order_id: data.data.merchant_id }),
                });
                const userData = await  response.json();
                if (userData.updated == true) {
                    notifications.update({
                        id:userNotificationId,
                         color: 'green',
                         title: 'Order id',
                         message: `Order id has been updated successfully!`,
                         icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                         loading: false,
                         autoClose: 2000,
                       });
                }
                router.push(data.data.url);
              }
          }
    }
    useEffect(() =>{
     checkUserPaymentStatus()
    },[])
  return (
    <div>
        <Flex bg={"#000D1E"} align={"center"} justify={"center"} w={"100%"} h={"100vh"} >
        <Loader color="#fff" />
        {}
        </Flex>
    </div>
  )
}

export default PayInvoice;