"use client";

// Everything that wraps every page and has to run in the browser:
// data loading, sign-in state, the Mantine theme, pop-up messages,
// the top bar and the footer. This used to live inside app/layout.tsx.

import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import FirebaseProvider from "@/lib/authContext";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React from "react";
import colors from "tailwindcss/colors";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  // The Blog studio draws its own frame, so the site's top bar and footer stay out of it.
  const path = usePathname() || "";
  const inStudio = path === "/studio" || path.startsWith("/studio/");

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
          {/* In the studio the action buttons sit at the top right, so messages go to the bottom right there. */}
          <Notifications position={inStudio ? "bottom-right" : "top-right"} />
          {inStudio ? (
            children
          ) : (
            <>
              <Navbar />
              <div className="min-h-[57vh]">{children}</div>
              <Footer />
            </>
          )}
        </MantineProvider>
      </FirebaseProvider>
    </QueryClientProvider>
  );
}
