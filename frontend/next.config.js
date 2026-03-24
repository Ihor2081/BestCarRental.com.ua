/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/db-status',
        destination: 'http://localhost:8000/db-status',
      },
    ];
  },
};

module.exports = nextConfig;
