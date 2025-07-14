import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: '0.0.0.0', // 讓外部 IP 可連
  //   port: 5174,
  //   /** 允許哪些 Host 存取 dev server */
  //   allowedHosts: [
  //     'localhost',
  //     '127.0.0.1',
  //     // 寫死這次 ngrok 網址
  //     '4f9d-114-37-211-187.ngrok-free.app',
  //   ],

  //   /** 熱更新 (HMR) 走 https，需要告訴 Vite 正確的 host */
  //   hmr: {
  //     host: '4f9d-114-37-211-187.ngrok-free.app',
  //     protocol: 'wss',
  //     port: 443, // ngrok https 預設 443
  //   },
  // },
});
