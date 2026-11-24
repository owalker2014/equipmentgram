// Adapted from Tailwind Nextjs Starter Blog (MIT License, see TEMPLATE-LICENSE.txt).
import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  // Gives the address of page 1, 2, 3 ...
  hrefFor: (page: number) => string;
};

const button = "rounded-full border border-blue-700 px-5 py-2 text-sm font-medium";
const active = `${button} text-blue-700 hover:bg-blue-700 hover:text-white`;
const disabled = `${button} cursor-default border-gray-200 text-gray-300`;

// "Previous   2 of 7   Next" under a list.
export default function Pagination({ currentPage, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Pages" className="flex items-center justify-between pb-8 pt-8">
      {hasPrev ? (
        <Link href={hrefFor(currentPage - 1)} rel="prev" className={active}>
          &larr; Previous
        </Link>
      ) : (
        <span className={disabled}>&larr; Previous</span>
      )}
      <span className="text-sm text-gray-600">
        {currentPage} of {totalPages}
      </span>
      {hasNext ? (
        <Link href={hrefFor(currentPage + 1)} rel="next" className={active}>
          Next &rarr;
        </Link>
      ) : (
        <span className={disabled}>Next &rarr;</span>
      )}
    </nav>
  );
}
