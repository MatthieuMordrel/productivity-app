// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    optimizeFonts: true,
    reactStrictMode: false,
    logging: {
      fetches: {
        fullUrl: true
      }
    },
    experimental: {
      typedRoutes: true
    },
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: 'bottom-right'
    }
  }
  
  export default nextConfig
