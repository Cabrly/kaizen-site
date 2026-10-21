import { useEffect, useRef, useState } from "react";
import { CARTOES, RECURSOS } from "../conteudo.jsx";
import { calmo } from "../lib/movimento.js";



/** Cartões com ícone, título e texto: usados aqui e na seção de privacidade. */
export function Cartoes({ itens }) {
    return (
        <div className="cartoes">
            {itens.map(({ titulo, texto, icone }) => (
                <div className="cartao" key={titulo}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">{icone}</svg>
                    <h3>{titulo}</h3>
                    <p>{texto}</p>
                </div>
            ))}
        </div>
    );
}

/** Print do app que vira vídeo: passa o mouse (ou aparece na tela, no celular) e ela cresce e mostra o app em uso. */
function Tela({ recurso, ampliar }) {
    const { imagem, video, alt } = recurso;
    const telaRef = useRef(null);
    const videoRef = useRef(null);
    const voltar = useRef(null);
    const [tocando, setTocando] = useState(false);
    // no PC, passar o mouse; no celular (sem mouse), tocar quando a tela aparece
    const [semMouse, setSemMouse] = useState(false);

    function tocar() {
        const filme = videoRef.current;
        clearTimeout(voltar.current);
        filme.preload = "auto";
        filme.play().then(() => setTocando(true)).catch(() => {});
    }

    function parar() {
        setTocando(false);
        // depois do fade, volta pro começo: da próxima vez começa do início
        voltar.current = setTimeout(() => {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }, 350);
    }

    useEffect(() => setSemMouse(window.matchMedia("(hover: none)").matches), []);

    useEffect(() => {
        if (!video || !semMouse || calmo || !("IntersectionObserver" in window)) return;
        const olho = new IntersectionObserver(([entrada]) => (entrada.isIntersecting ? tocar() : parar()), { threshold: 0.6 });
        olho.observe(telaRef.current);
        return () => {
            olho.disconnect();
            clearTimeout(voltar.current);
        };
    }, [video, semMouse]);

    const comMouse = video && !semMouse ? { onMouseEnter: tocar, onMouseLeave: parar, onFocus: tocar, onBlur: parar } : {};

    return (
        <button ref={telaRef} className={tocando ? "recurso-tela ampliar tocando" : "recurso-tela ampliar"} type="button"
                onClick={() => ampliar({ imagem, video, alt })} {...comMouse}>
            {/* o nome do botão é o próprio texto: "Ampliar imagem:" + a descrição da tela */}
            <span className="so-leitor">Ampliar imagem: </span>
            <img src={imagem} width="2880" height="1800" loading="lazy" alt={alt} />
            {video && <>
                <video ref={videoRef} src={video} muted loop playsInline preload="none" aria-hidden="true"></video>
                <span className="recurso-play" aria-hidden="true">▶ Ver em ação</span>
            </>}
        </button>
    );
}

export default function Recursos({ ampliar }) {
    return (
        <section className="secao" id="recursos">
            <header className="secao-cabeca">
                <p className="sobretitulo"><span lang="ja">道具</span> · suas ferramentas</p>
                <h2>Tudo o que você precisa pra andar pra frente</h2>
                <p>Tarefas do dia, estudos da semana, revisão na hora certa e um assistente pra destravar. Num lugar só, sem trocar de app.</p>
            </header>

            {RECURSOS.map((recurso, i) => (
                <article className={i % 2 ? "recurso recurso-invertido" : "recurso"} key={recurso.titulo}>
                    <div className="recurso-texto">
                        <span className="recurso-num">{String(i + 1).padStart(2, "0")}</span>
                        <h3>{recurso.titulo}</h3>
                        <p>{recurso.texto}</p>
                        <ul className="lista-check">
                            {recurso.lista.map((item, j) => <li key={j}>{item}</li>)}
                        </ul>
                    </div>
                    <Tela recurso={recurso} ampliar={ampliar} />
                </article>
            ))}

            <div className="novos">
                <h3 className="novos-titulo">E mais</h3>
                <Cartoes itens={CARTOES} />
            </div>
        </section>
    );
}
