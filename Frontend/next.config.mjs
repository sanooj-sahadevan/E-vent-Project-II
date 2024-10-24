/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: ['sanooj123.s3.eu-north-1.amazonaws.com'], // Add your domain here
  },
};

export default nextConfig;
