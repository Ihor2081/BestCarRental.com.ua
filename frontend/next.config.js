/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
      {
        source: '/db-status',
        destination: 'http://127.0.0.1:8000/db-status',
      },
    ];
  },
};

module.exports = nextConfig;