// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  optimizeFonts: true,
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  //can't use with turbopack
  // experimental: {
  //   typedRoutes: true,
  // },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
};

export default nextConfig;
