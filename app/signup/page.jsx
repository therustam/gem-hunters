"use client";
import classes from "./InputText.module.css";
import { useToggle } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconX, IconCheck, IconCross } from "@tabler/icons-react";
import { Loader, Notification, rem } from "@mantine/core";
import useSWR from "swr";
import {
  TextInput,
  Button,
  Box,
  BackgroundImage,
  Text,
  Flex,
  Image,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";



function SignupForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 1120px)");
  const isMobileHeight = useMediaQuery('(max-height: 800px)')
  const isBigResolution = useMediaQuery('(min-height: 1001px) ')
  const form = useForm({
    initialValues: {
      full_name: "",
      email: "",
      telegram: "",
    },
    validate: {
      full_name: (value) => (value.trim() ? null : "Full name is required"),
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format",
      telegram: (value) => (value.trim() ? null : "Telegram is required"),
    },
  });
  
  
  const handleSubmit = async (values) => {

    if (form.validate().hasErrors) {
      return;
    }
    
    const getUserNotificationId = notifications.show({
      loading: true,
      title: 'Creating',
      message: 'Creating and checing if user already exist',
      autoClose: false,
      withCloseButton: false,
    });
    setLoading(true);
    const gerUserResponse =await fetch(`/api/users?email=${values.email}&telegram=${values.telegram}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    })
   
    const userExist = await gerUserResponse.json();
    // console.log("🚀 ~ handleSubmit ~ userExist:", userExist)
    if (userExist.message == 'User exist') {
      notifications.update({
       
          id:getUserNotificationId,
           color: 'red',
           title: 'User Exist',
           message: `User from this ${values.email} exists`,
           icon: <IconCross style={{ width: rem(18), height: rem(18) }} />,
           loading: false,
           autoClose: 2000,
         });
      setLoading(false);
    } else{
      const response = await fetch("/api/createCoinRemitterInvoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
      });
  
      const data = await response.json();
      console.log(data); 
      if (data.data.merchant_id) {
        setLoading(false);
        let paymentStatus= false;
        router.push(`${data.data.url}`)
        const responseusers = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ full_name:values.full_name,email:values.email,telegram:values.telegram,coinremitter_merchant_id:data.data.merchant_id,paymentStatus }),
        });
        if (responseusers) {
          notifications.update({
       
            id:getUserNotificationId,
             color: 'green',
             title: 'User Exist',
             message: `User has been created successfully`,
             icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
             loading: false,
             autoClose: 2000,
           });
        setLoading(false);
        }
        
      } 
    }
   
  
   
  };
  return (
    <>
      {/* {value ? (
        <Step2 />
      ) :  */}
      
        <BackgroundImage
        src="/images/Pattern.png"
        h={isMobile? 1370:"100vh"}
        w={"100%"}
        style={{
          overflow: 'hidden' 
        }}
        >
          {/* <Flex justify={"center"} align={"center"} > */}
          <Box h={"100vh"}
          // w={{xl:'91em'}}
          >            
          
            <Flex
              justify="center"
              align="center"
              direction={`${isMobile ? "column" : "row"}`}
              wrap="wrap"
            >
              <Flex
                w={`${isMobile ? "100%" : "50%"}`}
                ml={0}
                mt={isMobile ? 30 : -60}
                justify={isMobile? "center":"start"}
                align={isMobile?"center":"end"}
                direction={"column"}
                style={{
                  zIndex: "20",
                }}
                h={"100vh"}
              >
                <Box>
                <Box h={"20%"} 
                 mr={isMobile? 0:-20}
                >
                <Link href={"/"}>
              <Box 
              mt={isMobile?10:80}
              >

                <Image h={29} w={173} ml={isMobile?0:0} mr={isMobile?190:isMobileHeight ? 285 :300} src={"/images/logo.png"} />
              </Box>
                </Link>
                <Box
                 mr={{ sm: "0", lg: 80 }}
                 >
                  <Text
                    w={isMobile ? 350 :isMobileHeight? 391:491}
                    c={"#D5EDFF"}
                    fw={900}
                    mr={isMobile?0:isMobileHeight? -20 :-200}
                    fz={isMobile ? 30 :isMobileHeight? 40: 43}
                    mt={isMobile?60:66}
                    mb={isMobile?30:0}
                  >
                    SIMPLIFYING THE CRYPTO MARKETS
                  </Text>
                 </Box>
                 </Box>
                 <Box h={"50%"}
                  mr={isMobile? 0:isMobileHeight ? -60:-70}
                  >
                <Image
                  h={isMobile ? 400 :"100%"}
                  w={isMobile ? 400 :"100%"}
                  src={"/images/SignupLeft.png"}
                />
        </Box>
        </Box>
              </Flex>
              <Flex
                w={`${isMobile ? "100%" : "50%"}`}
                pt={isMobile ? 50 : isBigResolution ? 300:0}
                h={isMobile? "500px":"100vh"}
                direction={"column"}
                gap={"10px"}
                align={"center"}
                justify={isBigResolution?"start":"center"}
                className={classes.flex}
              >
                <Text  c={"#D5EDFF"} fz={36} fw={900}>
                Join Gem Hunters Now
                </Text>
                <Text c={"#D5EDFF"} fz={16}>Trusted by industry leaders since 2017</Text>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <TextInput
                  ff={"heading"}
                    classNames={{ input: classes.textInput }}
                    variant="unstyled"
                    placeholder="Full Name"
                    {...form.getInputProps("full_name")}
                  />
                  <TextInput
                    variant="unstyled"
                    classNames={{ input: classes.textInput }}
                    placeholder="Email Address"
                    {...form.getInputProps("email")}
                  />
                  <TextInput
                    variant="unstyled"
                    classNames={{ input: classes.textInput }}
                    placeholder="Telegram"
                    {...form.getInputProps("telegram")}
                  />
                  <Button
                    className={classes.myButton}
                    type="submit"
                    mt="xl"
                    w={isMobile? 350:470}
                    h={52}
                    fw={""}
                    ta={"center"}
                    variant="transparent"
                    c={"#b9f4fd"}
                    
                  >
                    {loading ? (
                      <Loader color="#fff" type="dots" />
                    ) : (
                      <>
                       Go To Checkout<Image h={28} w={28} src={"/images/hammer.webp"} />
                      </>
                    )}
      
                  </Button>
                  <Text c={"#D5EDFF"} fz={14} mt={27}>
                    Step 1 of 2
                  </Text>
                </form>
              </Flex>
            </Flex>
          </Box>
          {/* </Flex> */}
        </BackgroundImage>
        {/* // </Notifications> */}
      
    {/* // } */}
    </>
  );
}

export default SignupForm;
