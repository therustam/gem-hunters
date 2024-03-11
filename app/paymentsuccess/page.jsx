
"use client";
import React from 'react'

import {
  TextInput,
  Button,
  Box,
  BackgroundImage,
  Text,
  Flex,
  Image,
} from "@mantine/core";
import Link from 'next/link';
const Step2 = () => {
  return (
    <BackgroundImage
    // mt={"-1080"}
    src="/images/Pattern.png"
    
    h={1100}
    w={"100%"}

  >
    <Box pb={"60px"} h={"auto"}>
       <Link href={"/"}> 
      <Box pt={60}>
      <Image h={29} w={173}  ml={{sm:20,lg:60}} src={"/images/logo.png"} />
      </Box>
      </Link>
      <Flex justify="center"  align="center" direction={"column"} wrap="wrap">
      <Text ta={'center'}  mt={66} ml={{sm:20,lg:60}} w={{sm:"auto",lg:680}} fw={900} fz={64} c={"#D5EDFF"}>
        YOU ARE ALL SET! CHECK YOUR EMAIL
     </Text>
     <Text fz={24} mb={80} c={"#FFF"}>Please check your email for a private invite along wth the next steps.</Text>
     <Image src={"/images/SignupCharacter2.png"} w={{sm:200,lg:500}} h={{sm:200,lg:500}}  />
      </Flex>
     
      
    </Box>
     </BackgroundImage>
  )
}

export default Step2