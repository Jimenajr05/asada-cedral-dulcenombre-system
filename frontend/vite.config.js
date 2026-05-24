/**
 * @file vite.config.js
 * @description Archivo de configuración para Vite, inyectando los complementos de soporte de React y compilación de Tailwind CSS.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})