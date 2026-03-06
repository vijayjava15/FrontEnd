import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { URL as API_BASE_URL } from './src/Constant.js'

const backendOrigin = new URL(API_BASE_URL).origin;
const applyBackendOrigin = (proxy) => {
  proxy.on("proxyReq", (proxyReq) => {
    proxyReq.setHeader("origin", backendOrigin);
  });
  proxy.on("proxyReqWs", (proxyReq) => {
    proxyReq.setHeader("origin", backendOrigin);
  });
};

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
        target: API_BASE_URL,
        changeOrigin: true,
        ws: true,
        rewriteWsOrigin: true,
        configure: applyBackendOrigin,
      },
      "/chat": {
        target: API_BASE_URL,
        changeOrigin: true,
        configure: applyBackendOrigin,
      },
      "/user": {
        target: API_BASE_URL,
        changeOrigin: true,
        configure: applyBackendOrigin,
      },
    },
  }
})
