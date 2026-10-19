// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  // CSS dentro del HTML: sin hojas aparte que bloqueen el primer renderizado (son pocas y chicas)
  build: { inlineStylesheets: 'always' },
});