import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// A fixed non-UTC zone makes mixing up UTC and local dates fail loudly.
process.env.TZ = 'Asia/Tokyo';

export default defineConfig({
  plugins: [react()],
  // Same aliases as vite.config.js.
  resolve: {
    alias: {
      src: '/src',
      components: '/src/components',
      pages: '/src/pages',
      assets: '/src/assets',
    },
  },
  test: {
    environment: 'node',
    environmentMatchGlobs: [['src/**/*.test.jsx', 'jsdom']],
    include: ['src/**/*.test.{js,jsx}'],
    setupFiles: ['src/test/setup.js'],
  },
});
