// @ts-check
// Need Next 15 to convert to ts

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
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
  // eslint: {
  //   ignoreDuringBuilds: true, //disable eslint for build
  // },
};

export default nextConfig;
