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
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/v1/api/:path*',
        destination: 'https://eventopia.shop/v1/api/:path*',
      },
    ];
  },
  productionBrowserSourceMaps: true,
  images: {
    domains: ['sanooj123.s3.eu-north-1.amazonaws.com'],
    remotePatterns: [
            {
              protocol: 'https',
              hostname: 'your-image-host.com',
              pathname: 'public',
            },
          ],
  },
};

export default nextConfig;


// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: '/v1/api/:path*',
//         destination: 'https://eventopia.shop/v1/api/:path*',
//       },
//     ];
//   },
// };
