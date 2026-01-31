"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import {
  MantineProvider,
  ColorSchemeScript,
  AppShell,
  Group,
  Burger,
  createTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SideNav } from "@/components/Nav/SideNav";

import { AuthContextProvider } from "../lib/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "EquipmentGram",
  description:
    "EquipmentGram is a platform for conducting pre-purchase equipment-defect verification.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EquipmentGram",
  },
};

// export const viewport: Viewport = {
//   themeColor: "#000000",
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
// };

const queryClient = new QueryClient();

const theme = createTheme({
  scale: 1,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1"
        />
        <meta name="description" content="description of your project" />
        <meta name="theme-color" content="#000000" />
        <title>EquimentGram</title>
        <link rel="manifest" href="manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <ColorSchemeScript />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <MantineProvider theme={theme}>
              <Notifications position="top-right" />
              <AppShell
                h="100%"
                header={{ height: 60 }}
                navbar={{
                  width: 300,
                  breakpoint: "sm",
                  collapsed: { mobile: !opened },
                }}
                padding="md"
              >
                <AppShell.Header>
                  <Group h="100%" px="md">
                    <Burger
                      opened={opened}
                      onClick={toggle}
                      hiddenFrom="sm"
                      size="sm"
                    />
                    <div className="text-blue-700 text-xl font-extrabold">
                      EquipmentGram
                    </div>
                  </Group>
                </AppShell.Header>
                <AppShell.Navbar p="md">
                  <SideNav />
                </AppShell.Navbar>
                <AppShell.Main h="100%">{children}</AppShell.Main>

                {/* <AppShell.Footer p="md">Footer</AppShell.Footer> */}
              </AppShell>
            </MantineProvider>
          </AuthContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
