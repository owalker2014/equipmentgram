/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  // aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // swcMinify: true,
  // disable: process.env.NODE_ENV === "development",
  disableDevLogs: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["resend"],
  },
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
