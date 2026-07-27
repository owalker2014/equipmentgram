/** @type {import('next').NextConfig} */

const withPWAInit = require("@ducanh2912/next-pwa").default;
const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  // aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  disableDevLogs: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      "resend",
      "@react-email/render",
      "@react-email/components",
      "@react-email/html",
      "@react-email/button",
    ],
    // swagger-jsdoc scans "app/api" from disk at runtime, which defeats
    // static file tracing and pulls the entire project dir (incl. the
    // ~650MB .next/cache) into the /api/docs function — past Vercel's
    // 250MB unzipped function limit.
    outputFileTracingExcludes: {
      "/api/docs": ["./.next/cache/**", "./app/api/**/*',"],
    },
  },
  transpilePackages: ["swagger-ui-react", "swagger-jsdoc"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       // Apply these headers to all routes under /api
  //       source: "/api/:path*",
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "*", // Replace * with your domain
  //         },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET,POST,PUT,DELETE,OPTIONS",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value:
  //             "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  //         },
  //       ],
  //     },
  //   ];
  // },
});

module.exports = nextConfig;
