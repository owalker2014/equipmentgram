import { createSwaggerSpec } from "next-swagger-doc";
import { NextResponse } from "next/server";

export const GET = async () => {
  // if (process.env.NODE_ENV === "production") {
  //   return NextResponse.json({ error: "Not found" }, { status: 404 });
  // }

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
