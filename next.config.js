/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://pension-calculator-2729dd945347.herokuapp.com',
  },
}

module.exports = nextConfig
