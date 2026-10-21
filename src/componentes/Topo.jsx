import { useEffect, useState } from "react";
import { MENU } from "../conteudo.jsx";

export function Marca() {
    return (
        <a className="marca" href="#" aria-label="Kaizen, início">
            <span className="selo" aria-hidden="true">改善</span>
            <span className="marca-nome">KAIZEN</span>
        </a>
    );
}


/** Barra fixa: transparente sobre o herói, sólida depois de rolar; no celular vira menu de abrir. */
export default function Topo() {
    const [rolou, setRolou] = useState(false);
    const [aberto, setAberto] = useState(false);

    useEffect(() => {
        const marcar = () => setRolou(window.scrollY > 40);
        const fecharNoEsc = (e) => e.key === "Escape" && setAberto(false);
        marcar();
        window.addEventListener("scroll", marcar, { passive: true });
        document.addEventListener("keydown", fecharNoEsc);
        return () => {
            window.removeEventListener("scroll", marcar);
            document.removeEventListener("keydown", fecharNoEsc);
        };
    }, []);

    return (
        <header className={rolou ? "topo rolou" : "topo"} id="topo">
            <div className="topo-dentro">
                <Marca />

                <nav className={aberto ? "menu aberto" : "menu"} id="menu" aria-label="Principal"
                     onClick={(e) => e.target.closest("a") && setAberto(false)}>
                    {MENU.map(([href, nome]) => <a key={href} href={href}>{nome}</a>)}
                    <a className="menu-github" href="https://github.com/Cabrly/kaizen" target="_blank" rel="noopener">GitHub</a>
                </nav>

                <a className="botao botao-pequeno" href="#baixar">Baixar grátis</a>

                <button className="menu-abrir" type="button" aria-controls="menu" aria-expanded={aberto}
                        aria-label="Abrir menu" onClick={() => setAberto(!aberto)}>
                    <span></span><span></span>
                </button>
            </div>
        </header>
    );
}
