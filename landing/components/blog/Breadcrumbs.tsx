import Link from "next/link";

export type Crumb = { name: string; path: string };

// "Home / Blog / Category" above a page. The last item is the page itself and is not a link.
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="pt-6 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-x-2">
              {last ? (
                <span aria-current="page" className="font-medium text-gray-700">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path} className="hover:text-blue-700 hover:underline">
                  {crumb.name}
                </Link>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
