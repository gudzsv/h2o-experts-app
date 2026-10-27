import { defineConfig } from 'vitest/config';

// A fixed non-UTC zone makes mixing up UTC and local dates fail loudly.
process.env.TZ = 'Asia/Tokyo';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
