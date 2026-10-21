// Roda depois dos dois builds do Vite e deixa o dist/ pronto pra buscadores e assistentes de IA:
// 1. coloca a página renderizada no servidor dentro do #raiz do dist/index.html (quem não roda
//    JavaScript lê o site inteiro);
// 2. acrescenta o FAQPage (JSON-LD) com as perguntas de src/conteudo.jsx;
// 3. escreve sitemap.xml e robots.txt e põe o endereço do site no llms.txt e na 404.
import { readFileSync, rmSync, writeFileSync } from "node:fs";

const site = (process.env.VITE_SITE_URL || "https://cabrly.github.io/kaizen-site").replace(/\/$/, "");
const caminho = new URL(`${site}/`).pathname;   // "/kaizen-site/" no GitHub Pages, "/" num domínio próprio
const dist = new URL("../dist/", import.meta.url);
const pastaServidor = new URL("../dist-server/", import.meta.url);
const em = (arquivo) => new URL(arquivo, dist);

const { render, perguntasEmTexto } = await import(new URL("entry-server.js", pastaServidor).href);

/** Troca exatamente uma ocorrência: se o index.html mudar e a marca sumir, o build falha em vez de publicar errado. */
function trocarUma(html, marca, valor) {
    const vezes = html.split(marca).length - 1;
    if (vezes !== 1) throw new Error(`prerender: esperava 1 "${marca}" e achei ${vezes}`);
    // função, não texto: um "$&" ou "$'" no conteúdo não vira padrão de substituição
    return html.replace(marca, () => valor);
}

// 1 e 2: página pronta + perguntas frequentes como dados estruturados
const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: perguntasEmTexto().map(({ pergunta, resposta }) => ({
        "@type": "Question",
        name: pergunta,
        acceptedAnswer: { "@type": "Answer", text: resposta }
    }))
};
// "<" escapado: um "</script>" dentro de uma resposta não fecha a tag antes da hora
const jsonFaq = JSON.stringify(faq).replace(/</g, "\\u003c");

let pagina = readFileSync(em("index.html"), "utf8");
pagina = trocarUma(pagina, '<div id="raiz"></div>', `<div id="raiz">${render()}</div>`);
pagina = trocarUma(pagina, "</head>", `<script type="application/ld+json">${jsonFaq}</script>\n</head>`);
writeFileSync(em("index.html"), pagina);

// 3: arquivos que precisam do endereço absoluto do site
const hoje = new Date().toISOString().slice(0, 10);
writeFileSync(em("sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${site}/</loc>
        <lastmod>${hoje}</lastmod>
        <changefreq>monthly</changefreq>
    </url>
</urlset>
`);
// o painel é privado (tem chave), então fica fora dos buscadores
writeFileSync(em("robots.txt"), `User-agent: *
Allow: /
Disallow: ${caminho}painel.html

Sitemap: ${site}/sitemap.xml
`);
for (const arquivo of ["llms.txt", "404.html"]) {
    const texto = readFileSync(em(arquivo), "utf8").replaceAll("%SITE_URL%", site).replaceAll("%SITE_PATH%", caminho);
    writeFileSync(em(arquivo), texto);
}

rmSync(pastaServidor, { recursive: true, force: true });
console.log(`prerender: ${(pagina.length / 1024).toFixed(1)} kB em dist/index.html, ${faq.mainEntity.length} perguntas no FAQPage, sitemap, robots e llms.txt para ${site}`);
