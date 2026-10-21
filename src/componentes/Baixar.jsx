import { APP, ARQUIVOS, PAGINA_VERSOES, arquivo } from "../lib/download.js";

/** Cartões de download; o do sistema do visitante fica em destaque. */
export default function Baixar({ versao, so }) {
    const link = (fim) => arquivo(versao, fim) || PAGINA_VERSOES;
    const destaque = (qual) => (so === qual ? "sistema seu-sistema" : "sistema");

    return (
        <section className="secao secao-noite" id="baixar">
            <header className="secao-cabeca">
                <p className="sobretitulo"><span lang="ja">始めよう</span> · vamos começar</p>
                <h2>Baixe o Kaizen</h2>
                <p>Grátis. Instale com dois cliques: não precisa de Python, terminal nem navegador. {versao?.tag_name &&
                    <span className="versao">Versão atual: {versao.tag_name}.</span>}</p>
            </header>

            <div className="baixar">
                <a className={destaque("windows")} data-so="windows" href={link(ARQUIVOS.windows)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5 10 4.5v7H3zM11 4.3 21 3v8.5H11zM3 12.5h7v7l-7-1zM11 12.5h10V21l-10-1.4z"/></svg>
                    <strong>Windows</strong>
                    <span>Instalador .exe · 10 e 11</span>
                </a>
                <a className={destaque("mac")} data-so="mac" href={link(ARQUIVOS.mac)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.9-.8-3.1-.8C6.8 7.3 5.3 8.2 4.5 9.7c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.1.8c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.6-1-2.7-4.1ZM14.1 5.6c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3Z"/></svg>
                    <strong>Mac</strong>
                    <span>.dmg · Apple Silicon (M1 ou mais novo)</span>
                </a>
                <div className={destaque("linux")} data-so="linux">
                    <a className="sistema-link" href={link(ARQUIVOS.linux)} aria-label="Baixar para Linux (.deb)"></a>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c-2 0-3.2 1.7-3.2 4 0 1.3.3 2.1-.6 3.5-1 1.6-2.7 3.6-2.7 6.2 0 .8.2 1.4.5 1.9-.9.5-1.6 1.1-1.6 1.8 0 1.1 2 1.6 3.4 1.6 1 0 1.8-.4 2.2-.9.6.1 1.3.2 2 .2s1.4-.1 2-.2c.4.5 1.2.9 2.2.9 1.4 0 3.4-.5 3.4-1.6 0-.7-.7-1.3-1.6-1.8.3-.5.5-1.1.5-1.9 0-2.6-1.7-4.6-2.7-6.2-.9-1.4-.6-2.2-.6-3.5 0-2.3-1.2-4-3.2-4Zm-1.5 4.2a.7.9 0 1 1 0 1.8.7.9 0 0 1 0-1.8Zm3 0a.7.9 0 1 1 0 1.8.7.9 0 0 1 0-1.8ZM12 9.2l1.6 1-1.6.9-1.6-.9z"/></svg>
                    <strong>Linux</strong>
                    <span>.deb (Ubuntu/Debian) · <a href={link("amd64.AppImage")}>AppImage</a> · <a href={link("x86_64.rpm")}>.rpm</a></span>
                </div>
                <a className={destaque("celular")} data-so="celular" href={APP} target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>
                    <strong>Celular e navegador</strong>
                    <span>iPhone e Android · abra e adicione à tela de início</span>
                </a>
            </div>

            <details className="aviso-windows">
                <summary>Apareceu “O Windows protegeu o computador”?</summary>
                <p>Clique em <b>Mais informações → Executar assim mesmo</b>. O aviso aparece porque o app ainda não tem certificado de assinatura do Windows (que é pago). No Mac, abra com o botão direito → <b>Abrir</b>.</p>
            </details>
        </section>
    );
}
