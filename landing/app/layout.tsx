import { ColorSchemeScript } from "@mantine/core";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import Providers from "./providers";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  // Lets every other page use relative URLs for canonical tags and social images.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Pre-Purchase Heavy Equipment Inspections`,
    // Any page that sets its own title gets "That Title | EquipmentGram".
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Pre-Purchase Heavy Equipment Inspections`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    site: "@EquipmentGram",
    title: `${SITE_NAME} | Pre-Purchase Heavy Equipment Inspections`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDa5QyoPFwUz6X6U2znLg88tBWDenn3KTs"
          }&libraries=places&callbackx=initMap&loading=async`}
        />
        <ColorSchemeScript />
      </head>
      <body className={roboto.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
