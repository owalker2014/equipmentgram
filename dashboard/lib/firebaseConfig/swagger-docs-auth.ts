import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./init";

const SWAGGER_DOCS_APP_NAME = "swagger-docs";

const swaggerDocsApp =
  getApps()?.[0] ?? initializeApp(firebaseConfig, SWAGGER_DOCS_APP_NAME);

export const swaggerDocsAuth = getAuth(swaggerDocsApp);
