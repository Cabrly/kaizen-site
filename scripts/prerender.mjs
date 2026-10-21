// Roda depois dos dois builds do Vite: coloca a página renderizada no servidor dentro do
// #raiz do dist/index.html. Assim o HTML publicado já tem todo o texto, e quem não roda
// JavaScript (buscadores, assistentes de IA, previews de link) lê o site inteiro.
import { readFileSync, rmSync, writeFileSync } from "node:fs";

const pastaServidor = new URL("../dist-server/", import.meta.url);
const arquivoIndex = new URL("../dist/index.html", import.meta.url);

const { render } = await import(new URL("entry-server.js", pastaServidor).href);

const modelo = readFileSync(arquivoIndex, "utf8");
const vaga = '<div id="raiz"></div>';
if (!modelo.includes(vaga)) throw new Error("prerender: não achei <div id=\"raiz\"></div> no dist/index.html");

// função, não texto: um "$&" ou "$'" no conteúdo não vira padrão de substituição
const pagina = modelo.replace(vaga, () => `<div id="raiz">${render()}</div>`);
writeFileSync(arquivoIndex, pagina);

rmSync(pastaServidor, { recursive: true, force: true });
console.log(`prerender: ${(pagina.length / 1024).toFixed(1)} kB em dist/index.html`);
