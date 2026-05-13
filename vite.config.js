import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiPort = Number(env.API_PORT || env.PORT || 8787)
  const isProd = mode === 'production'

  return {
    // Relative asset paths are more robust on GitHub Pages/custom domains.
    base: isProd ? './' : '/',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': `http://localhost:${apiPort}`,
      },
    },
  }
})
