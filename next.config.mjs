/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add your Next.js configuration options here
    webpack: (config, { isServer }) => {
      // Modify webpack config here
      return config;
    },
    images: {
      remotePatterns: [{hostname:'lh3.googleusercontent.com'}],
    },
  };

export default nextConfig;
