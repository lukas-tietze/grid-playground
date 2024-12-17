import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

/*
 * Konfiguration Vite.
 * Vite liefert während der Entwicklung alle vom Klienten benötigten Dateien einzeln aus
 * und kann für den produktiven Modus auch ein klassisches Bundle erstellen.
 */
export default defineConfig({
  /**
   * Konfiguration für dev-Server
   */
  server: {
    port: 4173,
    strictPort: true,
  },
  base: './',
  publicDir: './public',
  /**
   * Konfiguration für Produktions-Build -> Erzeugung von Bundles.
   */
  build: {
    manifest: true,
    rollupOptions: {
      input: ['./index.html'],
    },
    outDir: './assets',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./ts', import.meta.url)),
    },
  },
});
