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
    // resolve: {
    //   alias: {
    //     '@renderer': resolve('src/renderer/src'),
    //     '@common-shared': resolve('src/common-shared'),
    //     '@front-shared': resolve('src/renderer/src/front-shared'),
    //     '@ui-kit': resolve('src/renderer/src/front-shared/ui-kit'),
    //     '@assets': resolve('src/renderer/src/assets'),
    //     '@/hooks': resolve('src/renderer/src/hooks'),
    //     '@/assets': resolve('src/renderer/src/assets'),
    //     '@/store': resolve('src/renderer/src/store'),
    //     '@/components': resolve('src/renderer/src/components'),
    //     '@/mocks': resolve('src/renderer/src/mocks')
    //   }
    // },
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
