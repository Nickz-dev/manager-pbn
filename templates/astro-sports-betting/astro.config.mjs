import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sports-betting.com',
  outDir: './dist',
  build: {
    assets: 'assets'
  }
}); 