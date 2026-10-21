import { useRef, useState } from "react";
import { useSistema, useUltimaVersao } from "./lib/download.js";
import { calmo, gsap, ScrollTrigger, useGSAP } from "./lib/movimento.js";
import Topo from "./componentes/Topo.jsx";
import Heroi from "./componentes/Heroi.jsx";
import Recursos from "./componentes/Recursos.jsx";
import Cenas from "./componentes/Cenas.jsx";
import Baixar from "./componentes/Baixar.jsx";
import Faq from "./componentes/Faq.jsx";
import Apoie from "./componentes/Apoie.jsx";
import Lupa from "./componentes/Lupa.jsx";
import { Celular, ComoFunciona, Faixa, Final, Privacidade, Requisitos, Rodape, SuaIa } from "./componentes/Secoes.jsx";

// o que surge ao entrar na tela (em grupos, um atrás do outro)
const SURGEM = [
    ".faixa li", ".secao-cabeca", ".recurso-texto", ".recurso-tela", ".novos-titulo", ".cartao", ".passos li", ".destaque",
    ".cenas", ".cenas-dica", ".celular-texto", ".opcao-ia", ".tutorial", ".nivel", ".tabela-detalhe", ".dica", ".sistema",
    ".aviso-windows", ".faq details", ".apoie-texto", ".pix", ".final h2", ".final p", ".final .heroi-acoes"
].join(", ");

/* Todas as animações de rolagem num lugar só. Ficam no escopo da página (useGSAP desfaz
   tudo ao desmontar) e só existem pra quem não pediu menos movimento. */
function useAnimacoes(pagina) {
    useGSAP(() => {
        if (calmo) return;

        // abertura: o título sobe de dentro das máscaras, o resto vem atrás, a janela do app por último
        gsap.timeline({ defaults: { ease: "power4.out", duration: 1.1 } })
            .from(".heroi h1 .linha > *", { yPercent: 110, stagger: 0.12 })
            .from([".heroi .sobretitulo", ".heroi-sub", ".heroi-acoes", ".heroi-nota"], { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.9 }, 0.15)
            .from(".heroi-tela", { y: 90, autoAlpha: 0, duration: 1.4 }, 0.35);

        // o fundo do herói desce mais devagar que a página (profundidade)
        gsap.to(".heroi-fundo", { yPercent: 22, ease: "none", scrollTrigger: { trigger: ".heroi", start: "top top", end: "bottom top", scrub: true } });

        // a janela do app chega inclinada e se endireita conforme sobe
        gsap.fromTo(".janela", { rotateX: 16, scale: 0.94, transformPerspective: 1400, transformOrigin: "50% 0%" },
            { rotateX: 0, scale: 1, ease: "none", scrollTrigger: { trigger: ".heroi-tela", start: "top 85%", end: "top 20%", scrub: 0.6 } });

        // surgir ao rolar: opacity (não autoAlpha) pra nada deixar de receber foco pelo teclado
        // no fim, devolve o transform pro CSS: os :hover que levantam cartões e telas voltam a valer
        gsap.set(SURGEM, { opacity: 0, y: 40 });
        ScrollTrigger.batch(SURGEM, {
            start: "top 90%",
            once: true,
            onEnter: (grupo) => gsap.to(grupo, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", overwrite: true, clearProps: "transform,opacity" })
        });

        // as telas dos recursos assentam (zoom de 1.08 pra 1) enquanto passam
        gsap.utils.toArray(".recurso-tela img").forEach((img) => {
            gsap.fromTo(img, { scale: 1.08 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "center center", scrub: true } });
        });

        // celulares: cada um numa velocidade, o do meio mais rápido
        gsap.utils.toArray(".aparelho").forEach((aparelho, i) => {
            gsap.fromTo(aparelho, { yPercent: i === 1 ? 14 : 6 }, { yPercent: i === 1 ? -10 : -4, ease: "none",
                scrollTrigger: { trigger: ".celulares", start: "top bottom", end: "bottom top", scrub: true } });
        });

        // o 改善 gigante do final gira e cresce de leve enquanto a seção passa
        gsap.set(".final-selo", { xPercent: -50, yPercent: -50, x: 0, y: 0 });   // o CSS centraliza com translate(-50%, -50%)
        gsap.fromTo(".final-selo", { rotate: -8, scale: 0.9 }, { rotate: 6, scale: 1.05, ease: "none",
            scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom top", scrub: true } });
    }, { scope: pagina });
}

export default function App() {
    const pagina = useRef(null);
    const versao = useUltimaVersao();
    const so = useSistema();
    const [ampliado, setAmpliado] = useState(null);
    useAnimacoes(pagina);

    return (
        <div ref={pagina}>
            <a className="pular" href="#conteudo">Pular para o conteúdo</a>
            <Topo />

            <main id="conteudo">
                <Heroi versao={versao} so={so} />
                <Faixa />
                <Recursos ampliar={setAmpliado} />
                <ComoFunciona />

                <section className="secao secao-noite" id="cenas">
                    <header className="secao-cabeca">
                        <p className="sobretitulo"><span lang="ja">景色</span> · paisagens</p>
                        <h2>Cada tarefa concluída muda a paisagem</h2>
                        <p>Escolha uma cena pro fundo e veja ela ganhar vida conforme você avança. Tudo desenhado em código, sem imagem pra baixar.</p>
                    </header>
                    <Cenas />
                    <p className="cenas-dica">Aperte <kbd>Z</kbd> no app pra ver a cena inteira.</p>
                </section>

                <Celular />
                <Privacidade />
                <SuaIa />
                <Requisitos />
                <Baixar versao={versao} so={so} />
                <Faq />
                <Apoie />
                <Final />
            </main>

            <Rodape />
            <Lupa item={ampliado} fechar={() => setAmpliado(null)} />
        </div>
    );
}
