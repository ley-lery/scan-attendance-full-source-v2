import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
      babel: {
        plugins: ['react-activation/babel']
      }
    }), 
    tailwindcss()
  ],
  resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src"),
    },
},
  server:{
    port: 6600,
  }
})
