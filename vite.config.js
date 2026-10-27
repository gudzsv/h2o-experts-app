import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import FullReload from 'vite-plugin-full-reload';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';

const VENDOR_CHUNKS = [
  { name: 'react', pattern: /node_modules\/(react|react-dom|scheduler)\// },
  {
    name: 'redux',
    pattern:
      /node_modules\/(@reduxjs|redux|react-redux|redux-persist|immer|reselect)\//,
  },
  { name: 'i18n', pattern: /node_modules\/(i18next|react-i18next)\// },
  { name: 'lottie', pattern: /node_modules\/(lottie-react|lottie-web)\// },
  {
    name: 'charts',
    pattern:
      /node_modules\/(recharts|recharts-scale|victory-vendor|d3-[a-z-]+|internmap|decimal\.js-light|react-smooth|fast-equals)\//,
  },
];

// Installable app with the shell cached for a fast start. The API lives on
// another origin, so its responses are never cached by the service worker.
const pwa = VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'AquaTrack',
    short_name: 'AquaTrack',
    description: 'Track your daily water intake and keep the habit.',
    start_url: '/tracker',
    scope: '/',
    display: 'standalone',
    background_color: '#f0eff4',
    theme_color: '#f0eff4',
    icons: [
      { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    // The shell is cached up front. Images come in several sizes for
    // different screens, so each is cached only once the browser shows it.
    globPatterns: ['**/*.{js,css,html,svg,ttf}', 'icons/*.png'],
    navigateFallback: '/index.html',
    // Opens the app from a drink reminder notification.
    importScripts: ['sw-notifications.js'],
    runtimeCaching: [
      {
        urlPattern: ({ request, sameOrigin }) =>
          sameOrigin && request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: { maxEntries: 60 },
        },
      },
    ],
  },
});

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Shared CJS interop helpers must not end up in a lazy chunk.
            if (id.includes('commonjsHelpers')) {
              return 'react';
            }

            if (!id.includes('node_modules')) {
              return;
            }

            const chunk = VENDOR_CHUNKS.find(({ pattern }) =>
              pattern.test(id)
            );
            return chunk ? chunk.name : 'vendor';
          },
          entryFileNames: '[name].[hash].js',
          chunkFileNames: '[name].[hash].js',
        },
      },
      outDir: 'dist',
    },
    css: {
      modules: {
        scopeBehaviour: 'local',
      },
    },
    plugins: [
      react(),
      pwa,
      FullReload(['./src/**/*.{js,jsx,tsx,css,json,svg,webp}']),
      ViteImageOptimizer({
        exclude: /^sprite.svg$/,
        png: {
          quality: 60,
        },
        jpeg: {
          quality: 60,
        },
        jpg: {
          quality: 60,
        },
        webp: {
          quality: 60,
        },
      }),
    ],
    base: '/',
    resolve: {
      alias: {
        src: '/src',
        components: '/src/components',
        pages: '/src/pages',
        assets: '/src/assets',
      },
    },
  };
});
