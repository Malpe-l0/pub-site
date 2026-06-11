import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Moduli nativi usati lato server: non vanno impacchettati dal bundler.
  serverExternalPackages: ["better-sqlite3", "sharp"],
};

export default nextConfig;
