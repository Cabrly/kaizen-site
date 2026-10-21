import { useRef } from "react";
import { PERGUNTAS } from "../conteudo.jsx";
import { calmo, gsap, useGSAP } from "../lib/movimento.js";


/* A resposta abre e fecha deslizando. O <details> continua nativo (busca do navegador,
   teclado e leitor de tela funcionam); o GSAP só anima a altura da caixa da resposta. */
function Pergunta({ pergunta, resposta }) {
    const item = useRef(null);
    const { contextSafe } = useGSAP({ scope: item });

    const alternar = contextSafe((e) => {
        if (calmo) return;   // sem animação: o navegador abre e fecha sozinho
        e.preventDefault();
        const detalhe = item.current;
        const corpo = detalhe.querySelector(".faq-corpo");
        if (!detalhe.open) {
            detalhe.open = true;
            gsap.fromTo(corpo, { height: 0, autoAlpha: 0 }, { height: "auto", autoAlpha: 1, duration: 0.45, ease: "power3.out", overwrite: true });
        } else {
            gsap.to(corpo, { height: 0, autoAlpha: 0, duration: 0.3, ease: "power2.in", overwrite: true,
                             onComplete: () => { detalhe.open = false; gsap.set(corpo, { clearProps: "all" }); } });
        }
    });

    return (
        <details ref={item}>
            <summary onClick={alternar}>{pergunta}</summary>
            <div className="faq-corpo"><p>{resposta}</p></div>
        </details>
    );
}

export default function Faq() {
    return (
        <section className="secao" id="perguntas">
            <header className="secao-cabeca">
                <p className="sobretitulo"><span lang="ja">質問</span> · perguntas</p>
                <h2>Perguntas frequentes</h2>
            </header>

            <div className="faq">
                {PERGUNTAS.map(([pergunta, resposta]) => <Pergunta key={pergunta} pergunta={pergunta} resposta={resposta} />)}
            </div>
        </section>
    );
}
