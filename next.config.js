// @ts-check

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Keep Flight headers visible so Markdown negotiation never replaces app navigation.
  skipProxyUrlNormalize: true,
  async redirects() {
    return [
      "/products",
      "/find-our-products",
      "/products/:slug",
      "/about",
      "/dairy",
      "/contact",
      "/pricing",
      "/terms",
    ].map((source) => ({
      source,
      destination: `/fr${source}`,
      permanent: true,
    }));
  },
  async headers() {
    return [{
      source: "/:lang(fr|en)/:path*",
      headers: [{ key: "Vary", value: "Accept" }],
    }];
  },
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
