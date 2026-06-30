import type { NextConfig } from "next";

// Base path for GitHub Pages project sites (e.g. "/shiny5"). Set by the deploy
// workflow via NEXT_PUBLIC_BASE_PATH; empty for local dev.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export", // static HTML export to ./out for GitHub Pages
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true, // /preview -> /preview/index.html, served cleanly by Pages
  images: { unoptimized: true }, // no image optimizer on a static host
};

export default nextConfig;
