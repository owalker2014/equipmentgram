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
  // async rewrites() {
  //   return [
  //     {
  //       source: '/how-it-works',
  //       destination: '/contact-us',
  //     },
  //   ];
  // },
});

module.exports = nextConfig
