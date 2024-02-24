/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'gazelle.ihe.net',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'www.kereval.com',
            port: '',
            pathname: '/**',
          },
          
        ],
    },
}

module.exports = nextConfig
