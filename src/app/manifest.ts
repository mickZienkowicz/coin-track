import { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: 'CoinTrack',
    short_name: 'CoinTrack',
    description: 'CoinTrack',
    start_url: '/dashboard',
    // capture_links: 'existing-client-navigate',
    shortcuts: [],
    related_applications: [],
    prefer_related_applications: false,
    id: '/',
    scope: '/',
    display_override: ['standalone'],
    display: 'standalone',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    theme_color: '#0A0A0A',
    background_color: '#0A0A0A'
  };
}
