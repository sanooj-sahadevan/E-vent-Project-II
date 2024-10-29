// /**
//  *  @type {import('next').NextConfig}
//  */
// const nextConfig = {
//   swcMinify: true,
//   productionBrowserSourceMaps: true,
//   images: {
//     domains: ['sanooj123.s3.eu-north-1.amazonaws.com'],
//     remotePatterns: [
//             {
//               protocol: 'https',
//               hostname: 'your-image-host.com', 
//               pathname: 'public',
//             },
//           ],
//   },
// };

// export default nextConfig;

/**
 *  @type {import('next').NextConfig}
 */
const nextConfig = {
  swcMinify: true,
  productionBrowserSourceMaps: true,
  outputFileTracing: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sanooj123.s3.eu-north-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;


