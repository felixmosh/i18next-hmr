import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const devPlugins = [];
  if (mode === 'development') {
    const { i18nextHMRPlugin } = await import('i18next-hmr/vite');
    devPlugins.push(i18nextHMRPlugin({ localesDir: './public/locales' }));
  }
  return {
    plugins: [react()].concat(devPlugins),
  };
});
