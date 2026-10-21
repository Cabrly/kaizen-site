import { useRef, useState } from "react";
import { calmo, gsap, useGSAP } from "../movimento.js";

const CENAS = [
    { id: "pagode-lofi", nome: "Pagode lofi", cada: "janelas e lanternas do pagode acendem", fim: "tudo aceso; estrelas cadentes e pétalas o tempo todo",
      alt: "Cena Pagode lofi: pagode vermelho iluminado, monte Fuji e cerejeiras sob o céu estrelado." },
    { id: "fuji", nome: "Fuji ao amanhecer", cada: "o cordão de lanternas sobe a trilha e o céu doura", fim: "o sol nasce sobre o mar de nuvens",
      alt: "Cena Fuji ao amanhecer: o monte nevado acima de um mar de nuvens, com bordo vermelho em primeiro plano." },
    { id: "enso", nome: "Ensō dourado", cada: "o pincel de ouro avança no círculo zen", fim: "o círculo se fecha e o selo é carimbado",
      alt: "Cena Ensō dourado: círculo zen pintado a pincel sobre papel claro." },
    { id: "ume", nome: "Ameixeira ao luar", cada: "flores vermelhas abrem no galho com neve", fim: "florada e pétalas no ar",
      alt: "Cena Ameixeira ao luar: galho com neve e flores vermelhas diante da lua cheia." },
    { id: "bambu", nome: "Bambuzal", cada: "mais vaga-lumes acendem", fim: "a lanterna de pedra brilha forte",
      alt: "Cena Bambuzal com vaga-lumes: bambus altos à noite e uma lanterna de pedra." },
    { id: "sansui", nome: "Montanhas ao pôr do sol", cada: "a paisagem é pintada em aguada", fim: "o sol pousa na crista e doura o lago",
      alt: "Cena Montanhas ao pôr do sol: montanhas em aguada com o sol vermelho." }
];

const imagemDa = (cena) => `img/cenas/${cena.id}.webp`;

/** Abas com as paisagens do app: troca a imagem grande e a legenda. */
export default function Cenas() {
    const raiz = useRef(null);
    const imagem = useRef(null);
    const abas = useRef([]);
    const [escolhida, setEscolhida] = useState(0);   // a aba marcada (na hora)
    const [mostrada, setMostrada] = useState(0);     // a imagem no palco (depois de decodificar)
    const { contextSafe } = useGSAP({ scope: raiz });

    const escolher = contextSafe((i) => {
        if (i === escolhida) return;
        setEscolhida(i);

        // decodifica antes de trocar: a imagem nova nunca aparece pela metade
        const nova = new Image();
        nova.src = imagemDa(CENAS[i]);
        const decodificada = (nova.decode ? nova.decode() : Promise.resolve()).catch(() => {});

        if (calmo) {
            decodificada.then(() => setMostrada(i));
            return;
        }
        const sumir = gsap.to(imagem.current, { autoAlpha: 0, scale: 1.03, duration: 0.3, ease: "power2.in", overwrite: true });
        Promise.all([decodificada, sumir]).then(contextSafe(() => {
            setMostrada(i);
            gsap.fromTo(imagem.current, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "power2.out", overwrite: true });
            gsap.fromTo(".cenas-quando b", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" });
        }));
    });

    function setas(e, i) {
        const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!passo) return;
        e.preventDefault();
        const proxima = (i + passo + CENAS.length) % CENAS.length;
        abas.current[proxima].focus();
        escolher(proxima);
    }

    const cena = CENAS[mostrada];

    return (
        <div className="cenas" ref={raiz}>
            <div className="cenas-palco">
                <img className="cenas-imagem" ref={imagem} src={imagemDa(cena)} width="2880" height="1800" loading="lazy" alt={cena.alt} />
                <div className="cenas-legenda" aria-live="polite">
                    <p className="cenas-quando"><span>A cada tarefa</span><b>{cena.cada}</b></p>
                    <p className="cenas-quando"><span>Em 100%</span><b>{cena.fim}</b></p>
                </div>
            </div>

            <div className="cenas-lista" role="tablist" aria-label="Escolher cena">
                {CENAS.map((c, i) => (
                    <button key={c.id} role="tab" aria-selected={i === escolhida} tabIndex={i === escolhida ? 0 : -1}
                            ref={(aba) => (abas.current[i] = aba)}
                            onClick={() => escolher(i)} onKeyDown={(e) => setas(e, i)}>
                        <img src={imagemDa(c)} alt="" loading="lazy" /><span>{c.nome}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
