import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gaming-news.com',
  outDir: './dist',
  build: {
    assets: 'assets'
  }
}); 