# Next.js 14 Google Fonts backport

`next+14.2.35.patch` adapts the **Webpack** portion of the reviewed upstream
[vercel/next.js#100158](https://github.com/vercel/next.js/pull/100158)
(commit `98a73ead5bf711183e07398983c5c943f86328e7`) to Next.js 14.2.35's
shipped JavaScript. This application uses `next build` with Webpack, not Turbopack.

Google Fonts can return valid font URLs without a filename extension, such as
`/l/font?kit=...&skey=...`. The old loader dereferences a failed extension regex
match and crashes. The backport carries the extension from CSS extraction to
asset emission, using the URL pathname first, then the CSS `format()` hint, then
WOFF2 (the format requested by Next's Chrome user agent). Subset preloading and
URL deduplication are unchanged. No font configuration or Node version changes
are needed.

## Installation and verification

Run commands from `dashboard/`:

```sh
npm ci
npm run test:font-backport
npm run build
```

`patch-package` is an exact production dependency so `postinstall` also works
when dev dependencies are omitted. `postinstall` fails on patch application
errors; do not disable lifecycle scripts. Next.js is pinned to 14.2.35 to keep
the patch version-specific. Commit the patch and lockfile together.

The offline regression script uses Next's built-in mocked-response hook only
inside the test process. It checks extensionless and ordinary URLs, query strings,
CSS format hints, subset preloading, deduplication, and production Roboto asset
emission/CSS rewriting for both server and client compilations. It does not prove
Google connectivity or browser rendering and is not enabled in application builds.

## Removing the patch

When upgrading to a Next.js release containing the upstream fix, remove this
patch, the `postinstall` hook, the `patch-package` dependency (if unused elsewhere),
and this version-specific regression script/script entry. Regenerate the lockfile
with npm and test the upgrade separately. This backport is not a substitute for
a supported-version/security upgrade.
