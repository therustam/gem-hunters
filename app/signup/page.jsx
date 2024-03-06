"use client";
import classes from './InputText.module.css';
import { useToggle } from '@mantine/hooks';
import { useForm } from "@mantine/form";
import Step2 from "./Step2"
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
function SignupForm() {
  const form = useForm({
    initialValues: {
      full_name: "",
      email: "",
      telegram: "",
    },
  });

  const handleSubmit = (values) => {
    console.log("Submitted values:", values);
  };
  const [value, toggle] = useToggle([false,true]);
  return (
    <>
    {
        value ? <Step2 /> :
        <BackgroundImage
        // mt={"-680"}
        src="/images/Pattern.png"
        // h={1100}
        w={"100%"}
      >
        <Box  h={"auto"}>
            <Link  href={"/"}> 
            <Box pt={60}>
      <Image h={29} w={173}  ml={60} src={"/images/logo.png"} />
      </Box>
            </Link>
      <Flex justify="center" align="center" direction={{ lg: 'row', sm: 'column-reverse', }} wrap="wrap">
        <Box
          w={"50%"}
          ml={"0px"}
          mt={"60px"}
          style={{
            zIndex: "20",
          }}
        >
          <Box ml={{sm:"0",lg:"60"}}>
          
            <Text w={461} c={"#D5EDFF"} fw={900} fz={64} mt={126}>
              Simplifying the crypto markets
            </Text>
          </Box>
          <Image h={{sm:"500px",lg:"789px"}} w={{sm:"500px",lg:"789px"}} src={"/images/SignupLeft.png"} />
        </Box>
        
        <Flex
          w={{sm:"90%",lg:"50%"}}
          mt={{sm:"30px",lg:"-140px"}}
          h={{sm:"700px",lg:"1305px"}}
          direction={"column"}
          gap={"10px"}
          align={"center"}
          justify={"center"}
          className={classes.flex}
          
        >
          <Text c={"#D5EDFF"} fz={36} fw={900}>
            Signup
          </Text>
          <form
            style={{
              width: "470px",
            }}
            onSubmit={form.onSubmit(handleSubmit)}
          >
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
              
              style={{
                background:
                  "linear-gradient(93deg, #9BDDFD -34.54%, #449BF1 110.95%)",
                  fontSize:"24px",
                  
              }}
              type="submit"
              mt="xl"
              w={470}
              onClick={toggle}
            >
             Next Step
            </Button>
          </form>
        </Flex>
      </Flex>
      
    </Box>
    </BackgroundImage>
    }
    </>
  );
}

export default SignupForm;
