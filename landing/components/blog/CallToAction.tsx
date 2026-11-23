import Link from "next/link";
import {
  CTA_BUTTON_LABEL,
  CTA_BUTTON_URL,
  CTA_HEADING,
  CTA_SECOND_LABEL,
  CTA_SECOND_URL,
  CTA_TEXT,
} from "@/lib/blog/config";

// The blue band at the bottom of every post. The words are set in lib/blog/config.ts.
export default function CallToAction() {
  return (
    <aside className="my-12 rounded-3xl bg-blue-700 px-6 py-10 text-center text-white sm:px-12">
      <h2 className="text-2xl font-bold sm:text-3xl">{CTA_HEADING}</h2>
      <p className="mx-auto mt-3 max-w-xl text-blue-100">{CTA_TEXT}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={CTA_BUTTON_URL}
          className="rounded-full bg-white px-6 py-3 text-base font-semibold text-blue-700 shadow hover:bg-blue-50"
        >
          {CTA_BUTTON_LABEL}
        </Link>
        <Link
          href={CTA_SECOND_URL}
          className="rounded-full border border-white/70 px-6 py-3 text-base font-semibold text-white hover:bg-blue-800"
        >
          {CTA_SECOND_LABEL}
        </Link>
      </div>
    </aside>
  );
}
