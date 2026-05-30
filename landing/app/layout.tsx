"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import FirebaseProvider from "@/lib/authContext";
import { ColorSchemeScript, MantineProvider, Title } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Roboto } from "next/font/google";
import colors from "tailwindcss/colors";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";

import "./globals.css";
import { Notifications } from "@mantine/notifications";
import { Metadata } from "next";

// const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});
const queryClient = new QueryClient();

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

// Define the function globally
// window.initMap = function() {
//   const map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//   });
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDa5QyoPFwUz6X6U2znLg88tBWDenn3KTs&libraries=places&callbackx=initMap&loading=async`}
        />
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
      <body className={roboto.variable}>
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
              <Notifications position="top-right" />
              <Navbar />
              <div className="min-h-[57vh]">{children}</div>
              <Footer />
            </MantineProvider>
          </FirebaseProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
