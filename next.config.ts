import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.DQ_PORTABLE === "1"
    ? { output: "export" as const, distDir: ".next-portable", trailingSlash: true }
    : {}),
  // The dev server only trusts `localhost` by default; opening the app via the
  // loopback IP would otherwise block HMR and hydration in development.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
