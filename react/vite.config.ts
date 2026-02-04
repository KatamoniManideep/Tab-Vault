import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config tuned for Chrome extension builds:
// - `base: './'` makes generated asset URLs relative (./assets/...),
//   which is required when loading `dist/index.html` as an extension popup.
// - `build.outDir` ensures output goes to `dist`.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
