// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// [À CONFIRMER] nom de domaine définitif
export default defineConfig({
  site: 'https://lasecondeblouse.fr',
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: false } }),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/guide/merci'),
    }),
  ],
  vite: { plugins: [tailwind()] },
  // spec/06 mentionnait `image.formats` : cette clé n'existe pas dans la
  // config Astro 5. Le format se choisit sur chaque <Image format="avif" />,
  // ou via `astro:assets` qui sert déjà du WebP par défaut.
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
