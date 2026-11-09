import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // GitHub Pages 项目站点部署在 https://<user>.github.io/<repo>/ 子路径下，资源须按相对基路径加载。
  // base: './' 同时兼容本地预览（/）和 Pages（/<repo>/），不必硬编码仓库名。
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
