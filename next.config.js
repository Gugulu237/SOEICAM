// @ts-check

/** @type {import("next").NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      "/",
      "/products",
      "/products/:slug",
      "/about",
      "/dairy",
      "/contact",
    ].map((source) => ({
      source,
      destination: source === "/" ? "/fr" : `/fr${source}`,
      permanent: true,
    }));
  },
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
