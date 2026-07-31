const SWAGGER_DOCS_UID = "swagger-docs-service";
// This identity exists only so the Swagger UI at /api-docs can present a
// signed-in "try it out" experience without a real login. It must never be
// able to touch any of dashboard's real business routes — requireAuth()
// rejects an eqg-service token on any route that doesn't explicitly opt in
// to one of its scopes, and no route other than the docs spec should ever
// list "swagger-docs" here.
const SWAGGER_DOCS_SCOPES = ["swagger-docs"];

// Firebase custom tokens are valid for 1 hour; refresh a bit early to avoid
// handing out a token that expires mid-session.
const CACHE_TTL_MS = 55 * 60 * 1000;

let cachedToken: { token: string; expiresAt: number } | null = null;

// Mints (or reuses) a Firebase custom token for the swagger-docs service
// identity. The client exchanges it via signInWithCustomToken. Safe to
// expose in any environment: it is scoped so the resulting ID token cannot
// pass requireAuth() on anything but the swagger-docs-scoped route(s).
export async function getSwaggerDocsCustomToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const admin = (await import("./init-admin")).default;
  const token = await admin.auth().createCustomToken(SWAGGER_DOCS_UID, {
    role: "eqg-service",
    scopes: SWAGGER_DOCS_SCOPES,
  });

  cachedToken = { token, expiresAt: Date.now() + CACHE_TTL_MS };
  return token;
}
