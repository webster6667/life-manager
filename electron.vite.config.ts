import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: 'src/renderer/assets/**',
    plugins: [
      react(),
      tsconfigPaths({ projects: ['./../../tsconfig.json'] }),
      svgrPlugin({
        svgrOptions: {
          icon: true // Использовать иконки в формате SVG
        }
      })
    ]
  }
})
