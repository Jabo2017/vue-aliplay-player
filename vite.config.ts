/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// 库构建：产出 ES + UMD + d.ts，vue 作为外部依赖（peer）
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  plugins: [
    vue(),
    dts({ tsconfigPath: './tsconfig.json', include: ['src'], outDir: 'dist' }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VueAliPlayer',
      fileName: 'vue-aliplay-player',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
        assetFileNames(info) {
          if (info.names?.some((n) => n.endsWith('.css'))) return 'vue-aliplay-player.css'
          return '[name][extname]'
        },
      },
    },
  },
})
