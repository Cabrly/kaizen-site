# Arquitetura do site

Este documento explica como as peças do site se ligam. Os diagramas usam Mermaid, que o
GitHub desenha sozinho.

## Visão geral

O site é uma página única (SPA sem rotas) montada pelo React. Ela não tem servidor
próprio: tudo roda no navegador e conversa com dois serviços externos.

```mermaid
flowchart LR
    V([Visitante]) --> P["cabrly.github.io/kaizen-site<br/>(GitHub Pages, arquivos estáticos)"]
    P --> R["React 19<br/>página montada no navegador"]
    R -- "última versão e instaladores" --> GH[(API do GitHub<br/>releases/latest)]
    R -- "visita e cliques (anônimos)" --> W[(Worker kaizen-sync<br/>/v1/visita)]
    R -- "demonstração no herói (iframe)" --> APP[cabrly.github.io/kaizen/?demo]
    PN["painel.html"] -- "contagens (com chave)" --> W2[(Worker kaizen-sync<br/>/v1/painel)]
    PN -- "downloads por versão" --> GH
```

Se a API do GitHub não responder (offline ou limite de pedidos), os links de download
continuam indo para a página de versões. Se o Worker não responder, a contagem é perdida
em silêncio: contar nunca atrapalha o site.

## Árvore de componentes

```mermaid
flowchart TD
    main["main.jsx<br/>createRoot + iniciarContador()"] --> App
    App["App.jsx<br/>useAnimacoes · useUltimaVersao · estado da lupa"]
    App --> Topo["Topo<br/>menu, barra sólida ao rolar"]
    App --> Heroi["Heroi<br/>BotaoBaixar + Demo (iframe)"]
    App --> Faixa
    App --> Recursos["Recursos<br/>6 × Tela (print → vídeo)"]
    App --> ComoFunciona
    App --> Cenas["Cenas<br/>abas com troca animada"]
    App --> Celular
    App --> Privacidade
    App --> SuaIa["SuaIa<br/>tutorial com Mock"]
    App --> Requisitos
    App --> Baixar["Baixar<br/>cartões por sistema"]
    App --> Faq["Faq<br/>9 × Pergunta (abre deslizando)"]
    App --> Apoie["Apoie<br/>QR Code Pix + Copiar"]
    App --> Final
    App --> Rodape
    App --> Lupa["Lupa<br/>dialog com imagem ou vídeo"]
    Recursos -. "ampliar(item)" .-> App
    App -. "item" .-> Lupa
```

As seções só de conteúdo (`Faixa`, `ComoFunciona`, `Celular`, `Privacidade`, `SuaIa`,
`Requisitos`, `Final`, `Rodape`) ficam juntas em `componentes/Secoes.jsx`. Cada peça com
estado ou interação tem o próprio arquivo.

## Estado e dados

Quase tudo é estado local. Só dois dados atravessam componentes:

| Dado | Dono | Quem usa | Como chega |
|---|---|---|---|
| Última versão do app (`versao`) | `App`, via `useUltimaVersao()` | `Heroi` (botão principal) e `Baixar` | prop |
| Item ampliado (`ampliado`) | `App` | `Recursos` escreve, `Lupa` lê | `ampliar` (setter) e `item` (prop) |

O sistema do visitante (`so`) é calculado uma vez, quando o módulo `download.js` carrega:
o user agent não muda durante a visita.

### Escolha do link de download

```mermaid
flowchart TD
    A{so} -- celular --> B["Abrir o Kaizen<br/>→ app no navegador"]
    A -- "windows / mac / linux" --> C{a API do GitHub<br/>respondeu?}
    C -- sim, com o arquivo --> D["Baixar para X<br/>→ instalador direto"]
    C -- não --> E["Baixar para X<br/>→ #baixar"]
    A -- desconhecido --> F["Baixar o Kaizen<br/>→ #baixar"]
```

Os cartões da seção Baixar seguem a mesma lógica com `arquivo(versao, fim)`. Sem
resposta, apontam para `releases/latest`.

## Demonstração no herói

O app de verdade roda num `<iframe>` dentro da janela desenhada. Ele é desenhado com
1280 px de largura e encolhido com `transform: scale()` para caber, então fica igual ao
print que está por baixo.

```mermaid
sequenceDiagram
    participant RO as ResizeObserver
    participant D as Demo
    participant F as iframe
    RO->>D: largura da tela mudou
    alt largura ≥ 640 px
        D->>D: ligada = true (fica ligada)
        D->>F: monta o iframe com ?demo
        F-->>D: onLoad
        D->>D: depois de 400 ms, pronta = true (o iframe aparece por cima do print)
    else largura < 640 px
        D->>D: fica o print + botão "Experimentar a demonstração"
    end
    Note over D,F: "Recomeçar" troca a key do iframe: o React o recria e a demo volta ao começo
```

## Animação e rolagem

O Lenis faz a rolagem suave, mas quem dá o ritmo é o relógio do GSAP. Assim o
ScrollTrigger lê a posição de rolagem no mesmo quadro em que ela muda, e nada treme.

```mermaid
flowchart LR
    T["gsap.ticker<br/>(requestAnimationFrame)"] -- "raf(tempo)" --> L[Lenis]
    L -- "evento scroll" --> ST[ScrollTrigger.update]
    ST --> AN["animações com scrub<br/>e gatilhos de surgir"]
    TG["evento toggle de qualquer details"] --> RF[ScrollTrigger.refresh]
```

- Tudo isso está em `src/movimento.js`. Os componentes importam `gsap`, `useGSAP`,
  `lenis` e `calmo` de lá, nunca direto das bibliotecas.
- `calmo` é `true` quando o sistema pede menos movimento. Nesse caso o Lenis nem é criado
  (`lenis` fica `null`), e cada animação começa com `if (calmo) return`.
- As animações de rolagem ficam todas em `useAnimacoes`, no `App.jsx`. As que respondem a
  clique ficam no componente dono (`Cenas`, `Faq`, `Lupa`), dentro de `contextSafe`, para
  o `useGSAP` desfazê-las se o componente sair da tela.
- Abrir ou fechar um `<details>` muda a altura da página. Um ouvinte de `toggle` (em
  captura) chama `ScrollTrigger.refresh()` para recalcular onde cada gatilho fica.

O catálogo de cada animação está em [ANIMACOES.md](ANIMACOES.md).

## Build e publicação

```mermaid
flowchart LR
    S["push na master"] --> GA["GitHub Actions<br/>pages.yml"]
    GA --> CI["npm ci"] --> B["vite build"]
    B --> D["dist/<br/>index.html · painel.html<br/>assets/*.js|css · img/"]
    D --> UP[upload-pages-artifact] --> DP[deploy-pages] --> GP[(GitHub Pages)]
```

O build sai em arquivos separados, cada um com hash no nome (cache longo no navegador):

| Arquivo | O que tem | gzip (aprox.) |
|---|---|---|
| `react-*.js` | React e React DOM | 69 kB |
| `animacao-*.js` | GSAP, ScrollTrigger, @gsap/react e Lenis | 51 kB |
| `index-*.js` | o código do site | 17 kB |
| `qrcode-*.js` | gerador de QR Code, carregado sob demanda | 8 kB |
| `painel-*.js` | o painel, só em `painel.html` | 4 kB |
| `index-*.css` | todo o visual | 7 kB |

Caminhos relativos (`base: "./"`) permitem servir o mesmo `dist/` em qualquer subpasta.
Os arquivos de `public/` são copiados sem mudança. Por isso o código usa `img/...`
(relativo à página) e o CSS usa `/img/...`, que o Vite reescreve.

## Contagem anônima

`contador.js` conta uma visita por sessão (marcada em `sessionStorage`), a origem dela
(só o nome do site, como WhatsApp ou Google) e os cliques em baixar, abrir no navegador e
mexer na demonstração. Não usa cookie nem identificador. Em `localhost` não conta nada.

O envio usa `navigator.sendBeacon` (não segura a navegação). Sem ele, usa `fetch` com
`keepalive`. Os cliques são lidos por um único ouvinte no `document`, que reconhece os
botões pelos atributos `data-so` e `data-baixar-principal`. Por isso os componentes
mantêm esses atributos.
