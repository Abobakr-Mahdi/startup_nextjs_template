import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Create the next-intl plugin with path to i18n.ts configuration
const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
  // Enable server components by default
  reactStrictMode: true,

  // Enable Turbopack for faster development builds
  experimental: {
    // Enable any experimental features if needed
  },

  // Customize webpack configuration
  webpack(config) {
    return config;
  },
};

// Export the configuration with next-intl support
export default withNextIntl(nextConfig);
