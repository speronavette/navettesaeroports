import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Essentiel pour les chemins relatifs corrects
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
  build: {
    // Options de build pour la production
    cssCodeSplit: true, // Assure une bonne gestion du CSS
    sourcemap: process.env.NODE_ENV !== 'production', // Sourcemaps en dev uniquement
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprime les console.log en production
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1000, // Augmente la limite d'avertissement pour la taille des chunks
    rollupOptions: {
      output: {
        // Assure une meilleure gestion des assets
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        manualChunks: {
          // Sépare les librairies principales en chunks distincts
          react: ['react', 'react-dom', 'react-router-dom'],
          vendors: ['date-fns', 'axios', 'react-datepicker']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true,
  },
})