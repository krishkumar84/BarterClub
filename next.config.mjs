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
          hostname: 'pub-64c1419735be4ed8b942decb6af76e31.r2.dev',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '4480569168e2c111c971804e36fe94c7.r2.cloudflarestorage.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
};

export default nextConfig;
