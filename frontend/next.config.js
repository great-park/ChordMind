/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // API Gateway로 프록시
      },
    ]
  },
}

module.exports = nextConfig 