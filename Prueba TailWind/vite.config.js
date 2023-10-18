import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],

  // Define el directorio raíz
  root: "src",
  build: {
    // Directorio de salida personalizado
    outDir: "../dist",
  },
});
