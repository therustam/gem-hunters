"use client";

import { createTheme } from "@mantine/core";
import { customFont } from './app/fonts/CustomFont';
export const theme = createTheme({
  /* Put your mantine theme override here */
  fontFamily: `'${customFont.style.fontFamily}', sans-serif`,
});
