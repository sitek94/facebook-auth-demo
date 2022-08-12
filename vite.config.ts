import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    https: {
      key: fs.readFileSync(path.join(__dirname, '.certs/localhost-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '.certs/localhost.pem')),
    },
  },
})
