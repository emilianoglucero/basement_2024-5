import { NextConfig } from "next"

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp']
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'import', 'slash-div', 'global-builtin'],
  },
  experimental: {}
}

module.exports = config
