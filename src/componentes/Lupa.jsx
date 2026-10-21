import { useEffect, useRef, useState } from "react";
import { calmo, gsap, lenis } from "../lib/movimento.js";

/** Amplia a tela de um recurso num <dialog>: o vídeo grande quando o recurso tem, senão a imagem. */
export default function Lupa({ item, fechar }) {
    const caixa = useRef(null);
    const filme = useRef(null);
    const [semVideo, setSemVideo] = useState(false);   // vídeo que não carrega dá lugar à imagem

    useEffect(() => {
        const lupa = caixa.current;
        setSemVideo(false);
        if (!item || lupa.open) return;
        lupa.showModal();
        lenis?.stop();   // a página atrás não rola enquanto a lupa está aberta
        filme.current?.play().catch(() => {});
        if (!calmo) gsap.fromTo(lupa, { autoAlpha: 0, scale: 0.96, y: 12 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out" });
    }, [item]);

    function sair() {
        const lupa = caixa.current;
        if (calmo) return lupa.close();
        gsap.to(lupa, { autoAlpha: 0, scale: 0.97, duration: 0.25, ease: "power2.in", onComplete: () => lupa.close() });
    }

    function aoFechar() {
        filme.current?.pause();
        gsap.set(caixa.current, { clearProps: "all" });
        lenis?.start();
        fechar();
    }

    return (
        <dialog className="lupa" aria-label="Imagem ampliada" ref={caixa} onClose={aoFechar}
                onClick={(e) => e.target === caixa.current && sair()}>
            <button className="lupa-fechar" type="button" aria-label="Fechar" onClick={sair}>×</button>
            {item?.video && !semVideo
                ? <video ref={filme} src={item.video} muted loop playsInline aria-label={item.alt} onError={() => setSemVideo(true)}></video>
                : <img src={item?.imagem} alt={item?.alt ?? ""} />}
        </dialog>
    );
}
