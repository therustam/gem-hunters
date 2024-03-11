"use client";
import classes from "./InputText.module.css";
import { useToggle } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconX, IconCheck, IconCross } from "@tabler/icons-react";
import { Loader, Notification, rem } from "@mantine/core";
import Step2 from "./Step2";
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
import { Notifications, notifications } from "@mantine/notifications";
function SignupForm() {
  const [value, setValue] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 1120px)");
  const isMobileHeight = useMediaQuery('(max-height: 788px)')
    console.log("🚀 ~ SignupForm ~ isMobile:", isMobileHeight);
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
    console.log("🚀 ~ handleSubmit ~ userExist:", userExist)
    

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
      // console.log("🚀 ~ handleSubmit ~ data:", data.data.merchant_id)
      console.log(data); // handle response
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
        // console.log("🚀 ~ handleSubmit ~ responseusers:", responseusers);
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
        // mt={"-680"}
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
          <Link href={"/"}>
              <Box pt={isMobile?10:60}>
                <Image h={29} w={173} ml={isMobile?10:60} src={"/images/logo.png"} />
              </Box>
            </Link>
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
                // bg={"cyan"}
                justify={isMobile? "center":"end"}
                align={isMobile?"center":"end"}
                direction={"column"}
                style={{
                  zIndex: "20",
                }}
              >
                <Box
                 mr={{ sm: "0", lg: 80 }}
                 >
                  <Text
                  // bg={"blue"}
                    w={isMobile ? 350 : 691}
                    c={"#D5EDFF"}
                    fw={900}
                    mr={isMobile?0:-60}
                    fz={isMobile ? 30 : 64}
                    mt={isMobile?60:126}
                    mb={isMobile?30:0}
                    // ml={200}
                  >
                    SIMPLIFYING THE CRYPTO MARKETS
                  </Text>
                </Box>
          
                <Image
                mr={isMobile? 0:-80}
                  h={isMobile ? 400 : "auto"}
                  w={isMobile ? 400 : isMobileHeight? "50%":"60%"}
                  src={"/images/SignupLeft.png"}
                />
        
              </Flex>

              <Flex
                w={`${isMobile ? "100%" : "50%"}`}
                mt={isMobile ? 50 : isMobileHeight ? -120:-90}
                h={isMobile? "500px":"100vh"}
                direction={"column"}
                gap={"10px"}
                align={"center"}
                justify={"center"}
                className={classes.flex}
              >
                <Text c={"#D5EDFF"} fz={36} fw={900}>
                  SIGN UP
                </Text>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <TextInput
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
                    fw={"lighter"}
                  >
                    {loading ? (
                      <Loader color="#fff" type="dots" />
                    ) : (
                      " Next Step"
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
