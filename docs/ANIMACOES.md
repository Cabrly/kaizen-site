# Animações

Cada movimento do site, onde está no código e como ajustar. Tudo usa GSAP 3. A rolagem
suave usa Lenis 1.

## Regras que valem para todas

1. **Só `transform` e `opacity`.** São as duas propriedades que o navegador anima sem
   recalcular o layout, o que mantém 60 quadros por segundo e o INP baixo. A única exceção
   é a altura da resposta do FAQ, que dura menos de meio segundo e só roda quando a pessoa
   clica.
2. **Menos movimento é respeitado.** Com `prefers-reduced-motion: reduce`, o `calmo` de
   `src/movimento.js` fica `true`: nenhuma animação é criada, o Lenis não existe e a
   rolagem é a nativa. O CSS também zera `transition` e `animation` nesse caso.
3. **Nada fica sem foco.** O surgir ao rolar parte de `opacity: 0`, não de
   `visibility: hidden`. Quem navega pelo teclado alcança tudo, mesmo o que ainda não
   apareceu.
4. **Limpeza automática.** Toda animação nasce dentro de `useGSAP` ou de um `contextSafe`.
   Se o componente sai da tela, o GSAP desfaz as animações e os ScrollTriggers dele.
5. **O CSS volta a mandar no fim.** Depois de surgir, `clearProps: "transform,opacity"`
   apaga o estilo inline. Assim os `:hover` do CSS que levantam cartões e telas continuam
   funcionando.

## Rolagem suave (Lenis)

`src/movimento.js`

| Ajuste | Valor | Efeito |
|---|---|---|
| `autoRaf: false` + `gsap.ticker` | — | o Lenis anda no mesmo relógio do GSAP, sem tremer |
| `anchors.offset` | `-84` | links `#secao` param 84 px antes, abaixo do topo fixo |
| `gsap.ticker.lagSmoothing(0)` | — | o GSAP não "pula" quadros depois de um travamento, então a rolagem não dá tranco |

Enquanto a lupa está aberta, `lenis.stop()` trava a página de trás. `lenis.start()`
destrava ao fechar.

## Abertura do herói

`src/App.jsx`, `useAnimacoes`. Uma timeline que roda uma vez, ao carregar.

| Quando (s) | Alvo | Movimento | Duração |
|---|---|---|---|
| 0 | as duas linhas do `h1` | sobem de dentro de uma máscara (`yPercent: 110 → 0`), com 0,12 s entre elas | 1,1 s |
| 0,15 | sobretítulo, subtítulo, botões, nota | sobem 24 px e aparecem, com 0,08 s entre eles | 0,9 s |
| 0,35 | janela do app (`.heroi-tela`) | sobe 90 px e aparece | 1,4 s |

Curva: `power4.out`, que começa rápido e assenta devagar. A máscara de cada linha é o
`<span class="linha">`, com `overflow: hidden` no CSS. O `padding-bottom` de 0,1 em evita
cortar o "p" e o "g".

## Ligadas à rolagem (scrub)

Estas acompanham a barra de rolagem: rolar para trás desfaz o movimento.

| Alvo | Movimento | Começa → termina |
|---|---|---|
| `.heroi-fundo` | desce 22 % da própria altura (paralaxe) | topo do herói no topo da tela → base do herói no topo da tela |
| `.janela` | sai de inclinada (`rotateX: 16°`, escala 0,94) e fica reta | topo da janela a 85 % da tela → a 20 % |
| `.recurso-tela img` | zoom de 1,08 para 1, dentro da moldura | entra por baixo → centro da tela |
| `.aparelho` (3 celulares) | sobem em velocidades diferentes, o do meio mais rápido | `.celulares` entra → sai |
| `.final-selo` (改善 gigante) | gira de −8° a 6° e cresce de 0,9 a 1,05 | `.final` entra → sai |

`scrub: true` segue a rolagem sem atraso. A janela usa `scrub: 0.6`, que alcança a
rolagem em 0,6 s e deixa o movimento mais macio.

O `.final-selo` é centralizado no CSS com `translate(-50%, -50%)`. Como o GSAP passa a
controlar o `transform`, a centralização é refeita com `xPercent`/`yPercent: -50`.

## Surgir ao rolar

A lista `SURGEM`, no topo de `src/App.jsx`, diz quem surge. `ScrollTrigger.batch` junta
os elementos que entram na tela no mesmo instante e os anima em sequência.

- Começa em `opacity: 0` e 40 px abaixo.
- Dispara quando o topo do elemento passa de 90 % da altura da tela (`start: "top 90%"`).
- Sobe em 0,9 s (`power3.out`), com 0,08 s entre os elementos do mesmo grupo.
- Roda uma vez só (`once: true`).

Para um elemento novo surgir, acrescente o seletor dele em `SURGEM`. Não ponha ali algo
que fica dentro de um `<details>` fechado: sem altura, o gatilho dispara na hora errada.
Por isso a tabela de modelos não está na lista, só o `<details>` que a envolve.

## Em resposta a clique

| Onde | O que acontece |
|---|---|
| **Cenas** (`Cenas.jsx`) | A imagem atual some em 0,3 s com um zoom leve. Ao mesmo tempo, a nova é decodificada. Quando as duas coisas terminam, a nova entra com zoom de 1,06 para 1 em 0,9 s, e as legendas sobem com 0,08 s entre elas. A imagem nunca aparece pela metade. |
| **FAQ** (`Faq.jsx`) | A resposta desliza ao abrir (0,45 s) e ao fechar (0,3 s). O `<details>` continua nativo: a busca do navegador, o teclado e o leitor de tela funcionam como antes. Com menos movimento, o navegador abre e fecha sem animação. |
| **Lupa** (`Lupa.jsx`) | Abre crescendo de 0,96 para 1 e aparecendo (0,45 s). Fecha encolhendo para 0,97 e sumindo (0,25 s), e só depois chama `close()`. O Esc fecha na hora, que é o comportamento nativo do `<dialog>`. |

## Que continuam no CSS

Transições curtas de interface ficaram em CSS, que é mais leve para isso:

- `:hover` dos botões, cartões, telas dos recursos e cartões de download;
- telas dos recursos que crescem e viram vídeo (`.recurso-tela.tocando`);
- barra do topo que fica sólida ao rolar (`.topo.rolou`);
- menu do celular abrindo (`.menu.aberto`);
- ponto verde pulsando no selo da demonstração (`@keyframes pulsar`);
- seta do FAQ girando.

## Como ajustar

- **Mais rápido ou mais lento:** mude `duration`. Para mudar a abertura inteira, mude o
  `defaults.duration` da timeline.
- **Paralaxe mais forte:** aumente o `yPercent` do `.heroi-fundo` ou dos `.aparelho`.
- **Desligar uma animação:** apague o bloco dela em `useAnimacoes`. Nenhuma outra depende
  dela.
- **Testar sem animação:** ative "reduzir movimento" no sistema (Windows: Configurações →
  Acessibilidade → Efeitos visuais → Efeitos de animação) ou emule no DevTools
  (Rendering → `prefers-reduced-motion`).
