// Adapted from Tailwind Nextjs Starter Blog (MIT License, see TEMPLATE-LICENSE.txt).
import type { ReactNode } from "react";

// The big heading of a post.
export default function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-[3.5rem]">
      {children}
    </h1>
  );
}
