import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pbn-blog.com',
  outDir: './dist',
  build: {
    assets: 'assets'
  }
}); 