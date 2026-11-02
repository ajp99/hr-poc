import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static build: `next build` emits an `out/` folder that Vercel (or any static host) can serve.
  output: "export",
  // `/chapter/1/` → `/chapter/1/index.html`, so deep links work on any static host.
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
