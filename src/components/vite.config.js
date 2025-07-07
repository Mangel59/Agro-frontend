// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//   },
// })
// vite.config.js
import { defineConfig  } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {

  return {
    plugins: [react()],
  };
});

