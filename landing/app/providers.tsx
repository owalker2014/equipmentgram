"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import FirebaseProvider from "@/lib/authContext";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import colors from "tailwindcss/colors";

/**
 * Every browser-only provider lives here. Keeping them in a client component
 * lets app/layout.tsx stay a server component, which is what makes the
 * Next.js `metadata` exports (page titles, descriptions, social previews)
 * actually reach the HTML that Google crawls.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
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
  );
}
