import type { NextConfig } from "next";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

const basePath = isGitHubActions ? "/challenge-3" : "";

const nextConfig: NextConfig = {
  output: "export",

  basePath,

  assetPrefix: isGitHubActions ? `${basePath}/` : "",

  trailingSlash: true,

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "rfegraoskgndulpspcqd.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
