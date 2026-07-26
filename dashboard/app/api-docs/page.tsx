"use client";

import SwaggerUI from "swagger-ui-react";

export default function ApiDocsPage() {
  return (
    <div style={{ paddingTop: "1rem" }}>
      <SwaggerUI url="/api/docs" docExpansion="none" />
    </div>
  );
}
