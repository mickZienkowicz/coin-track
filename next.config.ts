import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'img.clerk.com'
      }
    ]
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
