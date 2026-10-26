import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "/ios-minimalist-launcher";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? repoName : "",
  assetPrefix: isGithubPages ? repoName : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
