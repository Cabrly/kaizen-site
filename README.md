# Site do Kaizen

Página de divulgação do [Kaizen](https://github.com/Cabrly/kaizen), publicada em
[cabrly.github.io/kaizen-site](https://cabrly.github.io/kaizen-site/).

Feita em **React 19 + Vite 6**. As animações usam **GSAP** (com ScrollTrigger) e a rolagem
suave usa **Lenis**. A página é **pré-renderizada no build**: o HTML publicado já traz todo o
texto, e o React assume esse HTML no navegador (hidratação). Buscadores, assistentes de IA e
previews de link leem o site sem rodar JavaScript.

## Rodar no PC

Precisa do Node 20 ou mais novo.

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:5173 (sem pré-render)
npm run build     # build do site + pré-render + sitemap, robots e llms.txt em dist/
npm run preview   # serve o dist/ em http://localhost:4173, igual ao que vai pro ar
npm run lint      # oxlint
npm test          # vitest (12 testes)
```

O painel de uso fica em `/painel.html` (em desenvolvimento: http://localhost:5173/painel.html).

## Estrutura

```
index.html                 <head> com SEO, preview de link e JSON-LD; #raiz recebe a página no build
painel.html                painel de uso (página à parte, sem React, fora dos buscadores)
vite.config.js             build do site (duas páginas, bibliotecas em arquivos próprios) e do pré-render
scripts/
  prerender.mjs            põe o HTML no #raiz, acrescenta o FAQPage e escreve sitemap e robots
  og-card.html             fonte da imagem de preview de link (public/og.jpg)
public/                    copiado sem mudança: img/, og.jpg, llms.txt, 404.html
src/
  main.jsx                 navegador: liga a rolagem, hidrata o React e a contagem de visitas
  entry-server.jsx         build: renderiza a página em HTML e o FAQ em texto
  App.jsx                  ordem das seções e todas as animações de rolagem
  conteudo.jsx             TODO o texto repetível: recursos, cenas, perguntas, níveis…
  style.css                todo o visual (mesma paleta do app)
  painel.js                lógica do painel
  componentes/             uma seção ou peça interativa por arquivo
  lib/
    movimento.js           GSAP, ScrollTrigger, Lenis e a navegação por âncora
    navegador.js           useDoNavegador: valores do navegador sem quebrar a hidratação
    download.js            sistema do visitante e arquivos da última versão no GitHub
    contador.js            contagem anônima de visitas e cliques
    pix.js                 BR Code do Pix (com valor opcional e CRC16)
    vendor/qrcode.js       gerador de QR Code (carregado só quando a seção Apoie precisa)
  *.test.js(x)             testes ao lado do código que testam
docs/
  ARQUITETURA.md           como as peças se ligam, com diagramas
  ANIMACOES.md             cada animação: onde está, o que faz e como ajustar
  SEO.md                   Google, assistentes de IA e preview de link
  ACESSIBILIDADE.md        o que foi auditado, como testar e as regras do projeto
```

## Tarefas comuns

| Quero… | Onde mexer |
|---|---|
| Editar o texto de um recurso, cena, pergunta ou nível | `src/conteudo.jsx` |
| Adicionar uma cena | `CENAS` em `src/conteudo.jsx` + a imagem em `public/img/cenas/<id>.webp` |
| Trocar a chave Pix ou os valores prontos | `PIX` e `VALORES` em `src/componentes/Apoie.jsx` |
| Mudar os arquivos de download | `ARQUIVOS` em `src/lib/download.js` (fim do nome de cada instalador) |
| Ajustar ou desligar uma animação | `useAnimacoes` em `src/App.jsx` (veja `docs/ANIMACOES.md`) |
| Trocar um print | substitua o arquivo em `public/img/telas/` mantendo o nome |
| Mudar o domínio do site | variável `VITE_SITE_URL` (veja `docs/SEO.md`) |
| Refazer a imagem de preview de link | `scripts/og-card.html` (veja `docs/SEO.md`) |
| Atualizar o resumo pra IA | `public/llms.txt` |

O FAQ do site e o FAQ dos dados estruturados saem da mesma lista: editar uma pergunta em
`conteudo.jsx` atualiza os dois. Os testes (`npm test`) conferem que todo print, vídeo e cena
citado ali existe em `public/`.

## Publicação

Dois workflows do GitHub Actions:

- **Qualidade** (`qualidade.yml`): lint, testes e build em todo push e pull request.
- **Deploy no GitHub Pages** (`pages.yml`): a cada push na `master`, roda lint e testes, gera
  o build e publica. Nada que falhe nos testes vai pro ar.

Para o deploy funcionar, em **Settings → Pages → Source** do repositório a opção tem que estar
em **GitHub Actions** (antes era "Deploy from a branch", que servia os arquivos crus da raiz).

## Qualidade

- **Acessibilidade:** zero violações do axe-core (WCAG 2.2 AA) em 1440, 768 e 390 px; tudo
  funciona pelo teclado; quem pede menos movimento não recebe animação nem rolagem suave.
  Detalhes em `docs/ACESSIBILIDADE.md`.
- **SEO e IA:** HTML pré-renderizado, Open Graph com imagem 1200×630, JSON-LD
  (`SoftwareApplication` e `FAQPage`), `sitemap.xml`, `robots.txt` e `llms.txt`. Detalhes em
  `docs/SEO.md`.
- **Desempenho:** só `transform` e `opacity` nas animações; a imagem do herói é pré-carregada;
  o QR Code baixa sob demanda; React e animação em arquivos próprios, com cache que sobrevive
  às mudanças de texto.
