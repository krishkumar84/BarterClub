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
          hostname: '4480569168e2c111c971804e36fe94c7.r2.cloudflarestorage.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
};

export default nextConfig;
