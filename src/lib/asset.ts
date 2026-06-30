/**
 * Prefix a root-relative public asset path (e.g. "/assets/models/x.obj") with the
 * configured base path. Next.js basePath/assetPrefix only rewrites its own assets
 * and next/link|next/image — runtime fetch()/TextureLoader/Howler URLs are NOT
 * rewritten, so we prefix them here. Empty in dev; "/shiny5" on GitHub Pages
 * (set via NEXT_PUBLIC_BASE_PATH at build time).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string): string => `${BASE_PATH}${path}`;
