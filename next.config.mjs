/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dwa-backend-4xwq.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;