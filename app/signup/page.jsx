"use client";
import classes from "./InputText.module.css";
import { useToggle } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconX, IconCheck, IconCross } from "@tabler/icons-react";
import { Loader, Notification, Title, rem } from "@mantine/core";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { sendPostRequest } from "../utils/helper";

function SignupForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 1120px)");
  const isBigHeightThanLaptop = useMediaQuery("(max-height: 800px)");
  const isBigResolution = useMediaQuery("(min-height: 1401px) ");
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

    const userNotificationId = notifications.show({
      loading: true,
      title: "Creating Invoice",
      message: "Checking if user info already exist",
      autoClose: false,
      withCloseButton: false,
    });

    setLoading(true);

    //checking if userExist
    const gerUserResponse = await fetch(
      `/api/users?email=${values.email}&telegram=${values.telegram}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const userExist = await gerUserResponse.json();
    if (userExist.message == "User exist") {
      notifications.update({
        id: userNotificationId,
        color: "red",
        title: "Email is already in use",
        message: `User from this ${values.email} exists`,
        icon: <IconCross style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 2000,
      });

      setLoading(false);
    } else {
      // Step 1: Create an invoice with NowPayments
      notifications.update({
        id: userNotificationId,
        color: "green",
        title: "Creating Invoice",
        message: `Creating Invoice`,
        loading: true,
      });

      const invoiceResponse = await fetch(`/api/createCoinRemitterInvoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await invoiceResponse.json();
      if (data.data.merchant_id) {
        setLoading(false);
        // Step 2: Save orderId in user's record (adjust according to your API/backend setup)
        notifications.update({
          id: userNotificationId,
          color: "green",
          title: "Sigining up",
          message: `Saving user & redirecting to invoice`,
          loading: true,
          autoClose: 2000,
        });
      
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, order_id: data.data.merchant_id }),
        });
        const userData = await response.json();
        if (userData.message) {
          // Step 3: Redirect user to payment page
          router.push(`${data.data.url}`)
        }
      }
    }
  };
 
  return (
    <>
    {/* for desktop */}
      <BackgroundImage
        src="/images/Pattern.png"
        h={isMobile ? 1570 : "100vh"}
        w={"100vw"}
      display={isMobile? "none":"block"}
      >
        <Box
          h={isMobile ? "100%" : "100vh"}
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
              justify={isMobile ? "center" : "start"}
              align={isMobile ? "center" : "end"}
              direction={"column"}
              style={{
                zIndex: "20",
              }}
              h={isMobile ? "auto" : "100vh"}
            >
              <Box h={isMobile ? "auto" : "100vh"}>
                <Box
                  h={isBigHeightThanLaptop ? "29%" : "23%"}
                  mr={isMobile ? 0 : -20}
                  ml={20}
                >
                  <Link href={"/"}>
                    <Box mt={isMobile ? 10 : 80}>
                      <Image
                        alt="image"
                        h={29}
                        w={173}
                        ml={isMobile ? -9 : 0}
                        mr={isMobile ? 170 : isBigHeightThanLaptop ? 285 : 300}
                        src={"/images/logo.png"}
                      />
                    </Box>
                  </Link>
                  <Box mr={{ sm: "0", lg: 80 }}>
                    <Text
                    ff={'heading'}
                      w={
                        isMobile
                          ? 350
                          : isBigHeightThanLaptop
                          ? 391
                          : isBigResolution
                          ? 691
                          : 491
                      }
                      c={"#D5EDFF"}
                      // fw={900}
                      mr={isMobile ? 0 : isBigHeightThanLaptop ? -20 : -200}
                      fz={
                        isMobile
                          ? 30
                          : isBigHeightThanLaptop
                          ? 40
                          : isBigResolution
                          ? 64
                          : 40
                      }
                      mt={isMobile ? 60 : 80}
                      mb={isMobile ? 30 : 0}
                    >
                      SIMPLIFYING THE CRYPTO MARKETS
                    </Text>
                  </Box>
                </Box>
                <Box
                  h={"60%"}
                  mr={
                    isMobile
                      ? 0
                      : isBigHeightThanLaptop
                      ? -60
                      : isBigResolution
                      ? -120
                      : -80
                  }
                >
                  <Image
                    h={isMobile ? 380 : "100%"}
                    w={isMobile ? 380 : "100%"}
                    src={"/images/SignupLeft.png"}
                  />
                </Box>
              </Box>
            </Flex>
            <Flex
              w={`${isMobile ? "100%" : "50%"}`}
              pt={isMobile ? 50 : isBigResolution ? 300 : 167}
              h={isMobile ? "500px" : "100vh"}
              direction={"column"}
              gap={"10px"}
              align={"center"}
              // justify={isBigResolution ? "start" : "center"}
              className={classes.flex}
            >
              <Text ff={'heading'} c={"#D5EDFF"} fz={36} >
            JOIN GEM HUNTERS NOW
            </Text>
              <Text c={"#D5EDFF"} fz={16}>
              Trusted by industry leaders since 2017
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
                  w={isMobile ? 350 : 470}
                  h={52}
                  fw={""}
                  ta={"center"}
                  variant="transparent"
                  fz={18}
                  disabled={loading ? true : false}
                >
                  {loading ? (
                    <Loader color="#000" type="dots" />
                  ) : (
                    <>
                      Go To Checkout
                      {/* <Image alt="image" h={28} w={28} src={"/images/hammer.webp"} /> */}
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
      </BackgroundImage>
      {/* for mobile */}
      <Flex
        h={isMobile ? "100%" : "100vh"}
        bg={"#08172A"}
        display={isMobile ? "flex" : "none"}
        direction={"column"}
      >
        <Flex
          justify="center"
          align="center"
          direction={`${isMobile ? "column" : "row"}`}
          wrap="wrap"
        >
          <Flex
            w={`${isMobile ? "100%" : "50%"}`}
            // pt={isMobile ? 50 : isBigResolution ? 300 : 0}
            // h={ "50%"}
            direction={"column"}
            // gap={"10px"}
            align={"center"}
            justify={"start"}
            className={classes.mobile_flex}
          >
            <Link href={"/"}>
              <Box pb={100}>
                <Image
                  alt="image"
                  h={"100%"}
                  w={"100%"}
                  src={"/images/logo.png"}
                />
              </Box>
            </Link>
            <Text ff={'heading'} c={"#D5EDFF"} fz={30} 
            // fw={900}
            >
            JOIN GEM HUNTERS NOW
            </Text>
            <Text c={"#D5EDFF"} fz={16}>
              Trusted by industry leaders since 2017
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
                w={isMobile ? 350 : 470}
                h={52}
                fw={""}
                ta={"center"}
                variant="transparent"
                fz={18}
                disabled={loading ? true : false}
              >
                {loading ? (
                  <Loader color="#000" type="dots" />
                ) : (
                  <>
                    Go To Checkout
                    {/* <Image alt="image" h={28} w={28} src={"/images/hammer.webp"} /> */}
                  </>
                )}
              </Button>
              <Text c={"#D5EDFF"} fz={14} mt={27}>
                Step 1 of 2
              </Text>
            </form>
          </Flex>
          <BackgroundImage src="/images/Pattern.png" h={"auto"} w={"100%"}>
            <Flex pl={20} mt={40} pb={20} direction={"column"} h={"auto"} align={"center"} justify={"center"}>
              <Box mr={{ sm: "0", lg: 80 }}>
                <Text ff={'heading'} c={"#D5EDFF"} fz={32} 
                // fw={900}
                 w={350}>
                  SIMPLIFYING THE CRYPTO MARKETS
                </Text>
              </Box>

              <Box h={"100%"} mt={-20}>
                <Image h={400} w={380} src={"/images/SignupLeft.png"} />
              </Box>
            </Flex>
          </BackgroundImage>
        </Flex>
      </Flex>
    </>
  );
}

export default SignupForm;
