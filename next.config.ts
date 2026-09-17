import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server only trusts `localhost` by default; opening the app via the
  // loopback IP would otherwise block HMR and hydration in development.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
