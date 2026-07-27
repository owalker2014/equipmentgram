"use client";

import "../globals.css";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import {
  MantineProvider,
  AppShell,
  Group,
  Burger,
  createTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { SideNav } from "@/components/Nav/SideNav";
import { AuthContextProvider } from "@/lib/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const theme = createTheme({
  scale: 1,
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {},
      }),
  );

  return (
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
          </AppShell>
        </MantineProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
