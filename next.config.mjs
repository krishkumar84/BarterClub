/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.pexels.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'pub-5b7aa644be4a4389bec851ef2147ddce.r2.dev',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'pub-64c1419735be4ed8b942decb6af76e31.r2.dev',
          port: '',
          pathname: '/**',
        },
      ],
    },
};

export default nextConfig;
