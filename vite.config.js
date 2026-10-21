import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Endereço público do site. Os metadados de preview de link (og:image, canonical) precisam de
// URL absoluta, e o sitemap e o llms.txt também. Troque pela variável VITE_SITE_URL se o
// domínio mudar (sem barra no fim).
process.env.VITE_SITE_URL ||= "https://cabrly.github.io/kaizen-site";

export default defineConfig(({ isSsrBuild }) => ({
    // base relativa: o mesmo build funciona em /kaizen-site/, num domínio próprio e no localhost
    base: "./",
    plugins: [react()],
    // o build de pré-render (src/entry-server.jsx) leva as dependências junto, pro Node rodar direto
    ssr: { noExternal: true },
    // o build de pré-render tem uma entrada só (passada na linha de comando) e nenhum chunk manual
    build: isSsrBuild ? {} : {
        rollupOptions: {
            input: { index: "index.html", painel: "painel.html" },
            output: {
                // bibliotecas em arquivos próprios: mudar o texto do site não invalida o cache delas
                manualChunks(id) {
                    if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return "react";
                    if (/node_modules\/(gsap|@gsap|lenis)\//.test(id)) return "animacao";
                }
            }
        }
    }
}));
