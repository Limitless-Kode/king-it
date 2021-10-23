module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['s3.amazonaws.com'],
  },
  async rewrites() {
        return [
          {
            source: '/:path*',
            destination: 'http://92.205.23.92:8080/:path*',
          },
        ]
      },
}
