"use client";

import SwaggerUI from "swagger-ui-react";

export default function ApiDocsPage() {
  return (
    <div style={{ padding: "1rem" }}>
      <SwaggerUI url="/api/docs" docExpansion="none" />
    </div>
  );
}
