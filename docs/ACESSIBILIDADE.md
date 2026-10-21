# Acessibilidade

Meta: **WCAG 2.2 nível AA**. O Kaizen tem opções de acessibilidade no próprio app; o site dele
precisa estar à altura.

## Situação atual

Auditado com o [axe-core](https://github.com/dequelabs/axe-core) (a mesma engine do Lighthouse),
regras WCAG 2.0, 2.1 e 2.2 A e AA mais boas práticas, com a página inteira rolada (pra todo
conteúdo ter aparecido):

| Largura | Violações | Regras que passaram |
|---|---|---|
| 1440 px (desktop) | 0 | 51 |
| 768 px (tablet) | 0 | 51 |
| 390 px (celular) | 0 | 49 |

Também testado à mão: navegação completa pelo teclado, `prefers-reduced-motion` forçado e a
página sem JavaScript.

## Regras do projeto

Valem para qualquer coisa nova que entrar no site.

### Teclado

- **Tudo que clica, tabula.** Use `<button>` para ação e `<a href>` para navegação. Nunca
  `<div onClick>`.
- **O foco aparece.** O `:focus-visible` global desenha um contorno vermelho de 3 px. Não
  remova `outline` sem pôr outro indicador.
- **Ordem do Tab = ordem visual.** No celular, o botão do menu vem antes dos links no HTML:
  depois de abrir, o próximo Tab cai no primeiro link.
- **Esc fecha** o menu do celular (e devolve o foco ao botão) e a lupa (o `<dialog>` nativo
  devolve o foco sozinho).
- **Saltos levam o foco.** Os links `#secao` (menu, "pular para o conteúdo") rolam até a seção
  e põem o foco nela (`rolarAte`, em `src/lib/movimento.js`). O próximo Tab continua de lá.
- **Abas usam as setas.** As cenas são um `tablist`: ←/→ trocam de aba, e só a aba ativa
  entra no Tab (roving tabindex).

### Leitor de tela

- **Nome acessível = texto visível.** Quem usa comando de voz diz o que vê ("clicar em
  Kaizen"). Pra dar mais contexto, acrescente texto com a classe `.so-leitor` em vez de trocar
  o nome com `aria-label`.
- **Decoração fica de fora:** ícones SVG e marcas d'água têm `aria-hidden="true"`; a marca
  d'água 改善 do final vem do CSS (`::before`), não do HTML.
- **Toda imagem com conteúdo tem `alt` descritivo;** imagens decorativas (miniaturas das abas)
  têm `alt=""`.
- **Mudanças são anunciadas:** a legenda das cenas e o "Copiado!" do Pix ficam em `aria-live`.
- **Escolhas são controles nativos:** os valores do Pix são `<input type="radio">` dentro de um
  `<fieldset>` com `<legend>`. O visual de pílula é só CSS.
- **`lang="ja"`** nos kanji, pra o leitor de tela não ler em português.

### Movimento

- `prefers-reduced-motion: reduce` desliga **tudo**: GSAP, Lenis, pétalas, inclinação 3D,
  botões magnéticos, transições CSS. Nada some e nada fica escondido esperando animação.
- Nada pisca mais de 3 vezes por segundo.
- O surgir ao rolar usa `opacity` (e não `visibility`): o que ainda não apareceu continua
  alcançável pelo Tab.

### Cor

- Texto pequeno com contraste de pelo menos **4,5:1**; texto grande (24 px+, ou 19 px+ em
  negrito), **3:1**. O cinza `--tinta-3` (`#6b6760`) é o mais claro permitido sobre o papel.
- Link no meio de uma frase tem sublinhado, não só cor.

## Como testar

1. **axe DevTools** (extensão do Chrome) ou Lighthouse → Acessibilidade. Role a página até o
   fim antes de rodar, pra todo conteúdo ter aparecido.
2. **Só o teclado:** desconecte o mouse e percorra a página com Tab, Shift+Tab, Enter, Espaço,
   Esc e setas. O foco tem que estar sempre visível e nunca ficar preso.
3. **Menos movimento:** Windows → Configurações → Acessibilidade → Efeitos visuais → desligue
   "Efeitos de animação". Ou DevTools → Rendering → `prefers-reduced-motion: reduce`.
4. **Leitor de tela:** NVDA (Windows, grátis) ou VoiceOver (Mac: Cmd+F5). Navegue pelos
   títulos (tecla H no NVDA) e confira que a ordem faz sentido.
5. **Zoom de 200%:** nada pode sumir nem exigir rolagem horizontal.
