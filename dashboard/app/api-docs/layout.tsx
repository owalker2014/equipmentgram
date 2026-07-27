import "swagger-ui-react/swagger-ui.css";
import { notFound } from "next/navigation";

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <>{children}</>;
}
