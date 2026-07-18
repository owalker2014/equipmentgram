import { createSwaggerSpec } from "next-swagger-doc";
import { NextResponse } from "next/server";

// The spec must be generated at build time: swagger-jsdoc reads the route
// source files from disk, and those .ts sources are not present in the
// deployed serverless function.
export const dynamic = "force-static";

export const GET = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
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
