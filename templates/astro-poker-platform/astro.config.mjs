import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://poker-platform.com',
  outDir: './dist',
  build: {
    assets: 'assets'
  }
}); 