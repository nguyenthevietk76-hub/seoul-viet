import { defineConfig } from 'vite';

// base './' để trang chạy được cả ở GitHub Pages (thư mục con) lẫn tên miền riêng.
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
  },
});
