import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverComponentsExternalPackages: ["better-sqlite3"], staleTimes: { dynamic: 60, static: 300 } },
  webpack: (config) => {
    config.resolve.alias["@"] = path.join(here, "src");
    return config;
  },
};
export default nextConfig;
