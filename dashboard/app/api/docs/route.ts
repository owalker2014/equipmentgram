import { createSwaggerSpec } from "next-swagger-doc";
import { NextResponse } from "next/server";
import path from "path";

// createSwaggerSpec() glob-scans app/api and .next/server on the filesystem,
// which must only happen per-request, not while Next tries to statically
// prerender this route during `next build`.
// export const dynamic = "force-dynamic";

export const GET = async () => {
  const spec = createSwaggerSpec({
    apiFolder:
      process.env.NODE_ENV === "production"
        ? path.join(process.cwd(), "app/api")
        : "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "EquipmentGram API",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  return NextResponse.json(spec);
};
