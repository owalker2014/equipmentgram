import type { Metadata } from "next";
import type { ReactNode } from "react";
import StudioShell from "@/components/studio/Shell";
import "@/components/blog/blog.css";

// Everything under /studio: the Blog studio, where posts are written and managed.
// Search engines are told to stay out.
export const metadata: Metadata = {
  title: "Blog studio | EquipmentGram",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
