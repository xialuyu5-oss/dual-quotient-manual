import type { NextConfig } from "next";

const isPortable = process.env.DQ_PORTABLE === "1";
const isGitHubPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  ...(isPortable
    ? { output: "export" as const, distDir: ".next-portable", trailingSlash: true }
    : isGitHubPages
      ? {
          output: "export" as const,
          basePath: "/dual-quotient-manual",
          trailingSlash: true,
        }
      : {}),
  // The dev server only trusts `localhost` by default; opening the app via the
  // loopback IP would otherwise block HMR and hydration in development.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
