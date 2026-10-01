import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' damit der Build auch auf GitHub Pages unter /tuktuk/ läuft
export default defineConfig({
  base: './',
  plugins: [react()],
});
