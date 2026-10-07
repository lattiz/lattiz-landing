import type { NextConfig } from "next";

// /templates is prerendered from the API; fail at startup/build instead of
// shipping a broken page. See src/lib/templates/config.ts.
if (!process.env.LATTIZ_API_URL?.trim()) {
  throw new Error(
    "LATTIZ_API_URL is required (e.g. LATTIZ_API_URL=https://api.lattiz.app). " +
    "Set it in .env.local for development and in the Vercel project for Production and Preview.",
  );
}

const nextConfig: NextConfig = {
  images: {
    // Template thumbnails (R2). Keep in sync with THUMBNAIL_HOSTNAME /
    // THUMBNAIL_PATH_PREFIX in src/lib/templates/schema.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.lattiz.app",
        port: "",
        pathname: "/templates/**",
      },
    ],
  },
};

export default nextConfig;
