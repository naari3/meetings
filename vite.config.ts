import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { gcalPlugin } from './src/vite-plugin-gcal'

export default defineConfig({
  plugins: [
    gcalPlugin(),
    react()
  ],
})