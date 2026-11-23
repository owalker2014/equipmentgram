// Adapted from Tailwind Nextjs Starter Blog (MIT License, see TEMPLATE-LICENSE.txt).
import type { ReactNode } from "react";

// Keeps blog content in a readable column in the middle of the page.
export default function SectionContainer({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <section className={`mx-auto px-4 sm:px-6 ${wide ? "max-w-6xl" : "max-w-3xl xl:max-w-5xl"} xl:px-0`}>
      {children}
    </section>
  );
}
