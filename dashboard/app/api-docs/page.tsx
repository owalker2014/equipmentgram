"use client";

import dynamic from "next/dynamic";

// swagger-ui-react's dependency chain (swagger-client) references the `File`
// global, which doesn't exist on the server in Node < 20. Loading it with
// ssr: false keeps it out of the server prerender entirely.
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div style={{ padding: "1rem" }}>
      <SwaggerUI url="/api/docs" docExpansion="none" />
    </div>
  );
}
