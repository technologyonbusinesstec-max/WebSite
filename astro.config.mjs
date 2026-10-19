// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    // Google Analytics corre en un web worker (Partytown): no ocupa el hilo principal de la página.
    // forward: las llamadas a gtag()/dataLayer.push() hechas en la página se pasan al worker.
    partytown({ config: { forward: ['dataLayer.push', 'gtag'] } }),
  ],
  // CSS dentro del HTML: sin hojas aparte que bloqueen el primer renderizado (son pocas y chicas)
  build: { inlineStylesheets: 'always' },
});