import type { ReactNode } from "react";
import "@/components/blog/blog.css";

// Wraps every public blog page.
export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="bg-white pb-16">{children}</div>;
}
