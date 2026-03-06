import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  server: {
    allowedHosts: [
      '8b6327078c77.ngrok-free.app'
    ],
    proxy: {
      "/ws": {
        target: "http://localhost:8082",
        changeOrigin: true,
        ws: true,
        rewriteWsOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("origin", "http://localhost:8082");
          });
          proxy.on("proxyReqWs", (proxyReq) => {
            proxyReq.setHeader("origin", "http://localhost:8082");
          });
        },
      },
      "/chat": {
        target: "http://localhost:8082",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("origin", "http://localhost:8082");
          });
        },
      },
      "/user": {
        target: "http://localhost:8082",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("origin", "http://localhost:8082");
          });
        },
      },
    },
  }
})
