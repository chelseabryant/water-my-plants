/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
}

module.exports = {
  async rewrites() {
    return [
      {
        source: "/a/:path*",
        destination: "http://localhost:8080/:path*",
      },
    ]
  },
}

module.exports = nextConfig
