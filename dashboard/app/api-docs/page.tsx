"use client";

import firebaseApp from "@/lib/firebaseConfig/init";
import { swaggerDocsAuth } from "@/lib/firebaseConfig/swagger-docs-auth";
import { getAuth, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";

// The swagger-docs identity signs in on its own Firebase App instance
// (swaggerDocsAuth), never on the primary app's Auth used by real dashboard
// logins — the two sessions live in structurally separate objects and can
// never overwrite each other. That identity is scoped to "swagger-docs"
// only (see getSwaggerDocsCustomToken.ts), so requireAuth() rejects it on
// every real business route regardless; this only unlocks the docs
// experience itself, never actual dashboard data.
export default function ApiDocsPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const primaryAuth = getAuth(firebaseApp);

    // onAuthStateChanged (rather than reading .currentUser synchronously)
    // waits for Firebase to finish restoring any session persisted from a
    // previous mount.
    const unsubscribePrimary = onAuthStateChanged(primaryAuth, (user) => {
      if (user) {
        // A real dashboard user is already signed in on the primary Auth —
        // nothing to do here.
        setReady(true);
        return;
      }

      const unsubscribeSwaggerDocs = onAuthStateChanged(
        swaggerDocsAuth,
        async (swaggerUser) => {
          unsubscribeSwaggerDocs();

          if (!swaggerUser) {
            const res = await fetch("/api/docs/token");
            const { token } = await res.json();

            if (token) {
              await signInWithCustomToken(swaggerDocsAuth, token);
            }
          }

          setReady(true);
        },
      );
    });

    return unsubscribePrimary;
  }, []);

  if (!ready) return null;

  return (
    <div style={{ paddingTop: "1rem" }}>
      <SwaggerUI
        url="/api/docs"
        docExpansion="none"
        requestInterceptor={async (req) => {
          const idToken =
            (await getAuth(firebaseApp).currentUser?.getIdToken()) ??
            (await swaggerDocsAuth.currentUser?.getIdToken());

          if (idToken) {
            req.headers.Authorization = `Bearer ${idToken}`;
          }

          return req;
        }}
      />
    </div>
  );
}
