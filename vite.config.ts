import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    injectRegister: 'auto',
    includeAssets: ['inmo.png', 'inmo white.png', 'icon.svg'],
    workbox: {
      globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
      // Activate the static-asset worker without reloading a form or persisting a JWT.
      // Navigations always load the deployed HTML, so an old shell cannot bypass new guards.
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: null,
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      // Only build assets are precached. API, R2 and provider responses stay online.
      runtimeCaching: [],
      navigateFallbackDenylist: [/^\/api\//],
      cleanupOutdatedCaches: true,
    },
    manifest: {
      name: 'INMO · Excelencia Inmobiliaria', short_name: 'INMO',
      description: 'Encuentra tu espacio ideal', start_url: '/', display: 'standalone',
      background_color: '#ffffff', theme_color: '#FA003F',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
  })],
});
