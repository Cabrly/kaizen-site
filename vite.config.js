import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa: o mesmo build funciona em cabrly.github.io/kaizen-site/ e no localhost
export default defineConfig({
    base: "./",
    plugins: [react()],
    build: {
        rollupOptions: {
            input: { index: "index.html", painel: "painel.html" },
            // bibliotecas em arquivos próprios: mudar o texto do site não invalida o cache delas
            output: {
                manualChunks(id) {
                    if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
                    if (/node_modules[\\/](gsap|@gsap|lenis)[\\/]/.test(id)) return "animacao";
                }
            }
        }
    }
});
