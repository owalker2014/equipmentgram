"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import FirebaseProvider from "@/lib/authContext";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import colors from "tailwindcss/colors";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDa5QyoPFwUz6X6U2znLg88tBWDenn3KTs&libraries=places`}
        ></script>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <FirebaseProvider>
            <MantineProvider
              theme={{
                primaryColor: "tailBlue",
                colors: {
                  tailBlue: [
                    colors.blue[100],
                    colors.blue[200],
                    colors.blue[300],
                    colors.blue[400],
                    colors.blue[500],
                    colors.blue[600],
                    colors.blue[700],
                    colors.blue[800],
                    colors.blue[900],
                    colors.blue[950],
                  ],
                },
              }}
            >
              <Navbar />
              <div>{children}</div>
              <Footer />
            </MantineProvider>
          </FirebaseProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
