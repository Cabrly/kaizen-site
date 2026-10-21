import { useEffect, useRef, useState } from "react";
import { MENU } from "../conteudo.jsx";

export function Marca() {
    return (
        <a className="marca" href="#">
            <span className="selo" aria-hidden="true">改善</span>
            <span className="marca-nome">KAIZEN</span>
            <span className="so-leitor">, voltar ao início</span>
        </a>
    );
}


/** Barra fixa: transparente sobre o herói, sólida depois de rolar; no celular vira menu de abrir. */
export default function Topo() {
    const [rolou, setRolou] = useState(false);
    const [aberto, setAberto] = useState(false);
    const botao = useRef(null);

    useEffect(() => {
        const marcar = () => setRolou(window.scrollY > 40);
        marcar();
        window.addEventListener("scroll", marcar, { passive: true });
        return () => window.removeEventListener("scroll", marcar);
    }, []);

    // Esc fecha o menu e devolve o foco pro botão que o abriu
    useEffect(() => {
        if (!aberto) return;
        const fecharNoEsc = (e) => {
            if (e.key !== "Escape") return;
            setAberto(false);
            botao.current.focus();
        };
        document.addEventListener("keydown", fecharNoEsc);
        return () => document.removeEventListener("keydown", fecharNoEsc);
    }, [aberto]);

    return (
        <header className={rolou ? "topo rolou" : "topo"} id="topo">
            <div className="topo-dentro">
                <Marca />

                {/* o botão vem antes do menu no HTML: no celular, o Tab depois de abrir cai direto nos links.
                    (no PC ele some, e no celular o menu é absoluto, então a ordem visual não muda) */}
                <button className="menu-abrir" type="button" ref={botao} aria-controls="menu" aria-expanded={aberto}
                        aria-label={aberto ? "Fechar menu" : "Abrir menu"} onClick={() => setAberto(!aberto)}>
                    <span></span><span></span>
                </button>

                <nav className={aberto ? "menu aberto" : "menu"} id="menu" aria-label="Principal"
                     onClick={(e) => e.target.closest("a") && setAberto(false)}>
                    {MENU.map(([href, nome]) => <a key={href} href={href}>{nome}</a>)}
                    <a className="menu-github" href="https://github.com/Cabrly/kaizen" target="_blank" rel="noopener">GitHub</a>
                </nav>

                <a className="botao botao-pequeno" href="#baixar">Baixar grátis</a>
            </div>
        </header>
    );
}
