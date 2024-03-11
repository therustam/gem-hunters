import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "../theme";
import '@mantine/notifications/styles.css';
// import '../public/fonts/ClashDisplay-Variable.css';
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: "Mantine Next.js template",
  description: "I am using Mantine with Next.js!",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={
          {
            fontFamily: 'fatfrank, sans-serif',
            breakpoints: {
              xs: '30em',
              sm: '48em',
              md: '64em',
              lg: '84em',
              xl: '91em',
              
            },
          }
        }>
          <Notifications position="top-right" zIndex={1000} />
          {children}</MantineProvider>
      </body>
    </html>
  );
}
