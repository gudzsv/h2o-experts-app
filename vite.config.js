import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import FullReload from 'vite-plugin-full-reload';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

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

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    build: {
      sourcemap: true,
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
