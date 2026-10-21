# Site do Kaizen

Página de divulgação do [Kaizen](https://github.com/Cabrly/kaizen), publicada em
[cabrly.github.io/kaizen-site](https://cabrly.github.io/kaizen-site/).

Feita em **React 19 + Vite 6**. As animações usam **GSAP** (com ScrollTrigger) e a rolagem
suave usa **Lenis**. O texto, o visual e o comportamento são os mesmos da versão anterior em
HTML puro. A migração mudou a estrutura e acrescentou movimento, sem mexer no conteúdo.

## Rodar no PC

Precisa do Node 20 ou mais novo.

```bash
npm install
npm run dev       # servidor de desenvolvimento em http://localhost:5173
npm run build     # gera o site final em dist/
npm run preview   # serve o dist/ em http://localhost:4173, igual ao que vai pro ar
```

O painel de uso fica em `/painel.html` (em desenvolvimento: http://localhost:5173/painel.html).

## Estrutura

```
index.html              casca da página: <head>, SEO, fontes e o ponto de montagem do React
painel.html             painel de uso (página à parte, sem React)
vite.config.js          build com duas páginas e bibliotecas em arquivos próprios
public/img/             prints, cenas, vídeos e ícones (copiados sem mudança pro dist/)
src/
  main.jsx              monta o React e liga a contagem de visitas
  App.jsx               ordem das seções e todas as animações de rolagem
  movimento.js          GSAP, ScrollTrigger e Lenis configurados num lugar só
  download.js           sistema do visitante e arquivos da última versão no GitHub
  contador.js           contagem anônima de visitas e cliques
  pix.js                BR Code do Pix (com CRC16)
  painel.js             lógica do painel
  style.css             todo o visual (mesma paleta do app)
  vendor/qrcode.js      gerador de QR Code (carregado só quando a seção Apoie precisa)
  componentes/          uma seção ou peça interativa por arquivo
docs/
  ARQUITETURA.md        como as peças se ligam, com diagramas
  ANIMACOES.md          cada animação: onde está, o que faz e como ajustar
```

## Tarefas comuns

| Quero… | Onde mexer |
|---|---|
| Trocar a chave Pix | constante `PIX` em `src/componentes/Apoie.jsx` |
| Editar o texto de um recurso | array `RECURSOS` em `src/componentes/Recursos.jsx` |
| Adicionar uma cena | array `CENAS` em `src/componentes/Cenas.jsx` + a imagem em `public/img/cenas/` |
| Editar uma pergunta do FAQ | array `PERGUNTAS` em `src/componentes/Faq.jsx` |
| Mudar os arquivos de download | `ARQUIVOS` em `src/download.js` (fim do nome de cada instalador) |
| Ajustar ou desligar uma animação | `useAnimacoes` em `src/App.jsx` (veja `docs/ANIMACOES.md`) |
| Trocar um print | substitua o arquivo em `public/img/telas/` mantendo o nome |

Os **downloads** apontam sozinhos para os arquivos da última versão no GitHub. Os **prints**
foram tirados de uma cópia do app com tarefas fictícias.

## Publicação

O GitHub Actions (`.github/workflows/pages.yml`) gera o build e publica no GitHub Pages a
cada push na `master`. Para isso funcionar, em **Settings → Pages → Source** do repositório,
a opção tem que estar em **GitHub Actions** (antes era "Deploy from a branch", que servia os
arquivos crus da raiz).

O build usa caminhos relativos (`base: "./"`), então o mesmo `dist/` funciona em
`/kaizen-site/`, num domínio próprio ou no `localhost`.

## Acessibilidade e desempenho

- Quem ativa **reduzir movimento** no sistema não recebe nenhuma animação nem a rolagem suave.
- O surgir ao rolar usa só `opacity`: nenhum elemento deixa de receber foco pelo teclado.
- A imagem de fundo do herói é pré-carregada (é a maior da primeira tela).
- O QR Code (~8 kB gzip) só baixa depois da página, em arquivo à parte.
- React e animação ficam em arquivos próprios: mudar o texto do site não invalida o cache deles.
