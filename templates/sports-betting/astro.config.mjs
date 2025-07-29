import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://example.com', // Будет переопределяться динамически
  base: '/',
  
  // Оптимизации сборки
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  
  // Настройки для статической генерации
  output: 'static',
  
  // Оптимизации для SEO
  trailingSlash: 'never',
  
  // Настройки для безопасности
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    }
  },
  
  // Настройки для разработки
  dev: {
    port: 4321,
    host: true,
  },
  
  // Оптимизации для CSS
  vite: {
    css: {
      devSourcemap: true,
    },
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['astro']
          }
        }
      }
    }
  }
}); 