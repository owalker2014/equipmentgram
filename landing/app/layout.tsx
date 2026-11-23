import { SITE_NAME, SITE_URL } from "@/lib/blog/config";
import { ColorSchemeScript } from "@mantine/core";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import React from "react";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";

import "./globals.css";
import Providers from "./providers";

// const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

// The title and description every page gets unless it sets its own.
// These are what Google shows in search results.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: "EquipmentGram is a platform for conducting pre-purchase equipment-defect verification.",
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
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <ColorSchemeScript />
      </head>
      <body className={roboto.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
