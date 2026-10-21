import { useLayoutEffect, useRef, useState } from "react";
import { APP, ARQUIVOS, NOMES, arquivo } from "../lib/download.js";
import { useDoNavegador } from "../lib/navegador.js";

/* O app é desenhado com 1280 px de largura e encolhido pra caber na janela, então fica
   igual ao print. Abaixo de 640 px ficaria pequeno demais pra usar: aí fica o print com
   um botão que abre a demo em outra aba. */
const LARGURA_APP = 1280;
const LARGURA_MINIMA = 640;
const DEMO = `${APP}?demo`;
// ?demo-url=... no endereço do site troca a demo (pra testar uma cópia local do app)
const lerUrlDemo = () => new URLSearchParams(location.search).get("demo-url") || DEMO;

/** Botão principal: aponta direto pro instalador do sistema do visitante quando dá. */
function BotaoBaixar({ versao, so }) {
    let href = "#baixar";
    let rotulo = "Baixar o Kaizen";
    if (so === "celular") {
        href = APP;
        rotulo = "Abrir o Kaizen";
    } else if (NOMES[so]) {
        href = arquivo(versao, ARQUIVOS[so]) || href;
        rotulo = `Baixar para ${NOMES[so]}`;
    }
    return (
        <a className="botao" href={href} data-baixar-principal>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16"/></svg>
            <span>{rotulo}</span>
        </a>
    );
}

/** O app de verdade, no modo demonstração: dados de exemplo que somem ao recarregar. */
function Demo() {
    const telaRef = useRef(null);
    const quadroRef = useRef(null);
    const [ligada, setLigada] = useState(false);   // uma vez carregada, fica
    const [pronta, setPronta] = useState(false);
    const [rodada, setRodada] = useState(0);       // mudar a key recria o iframe: a demo volta ao começo
    const urlDemo = useDoNavegador(lerUrlDemo, DEMO);

    function encaixar() {
        const tela = telaRef.current, quadro = quadroRef.current;
        if (!tela || !quadro) return;
        const escala = tela.clientWidth / LARGURA_APP;
        quadro.style.width = `${LARGURA_APP}px`;
        quadro.style.height = `${tela.clientHeight / escala}px`;
        quadro.style.transform = `scale(${escala})`;
    }

    useLayoutEffect(() => {
        const tela = telaRef.current;
        const medir = () => {
            if (tela.clientWidth >= LARGURA_MINIMA) setLigada(true);
            encaixar();
        };
        const olho = new ResizeObserver(medir);
        olho.observe(tela);
        return () => olho.disconnect();
    }, []);

    function recomecar() {
        setPronta(false);
        setRodada((n) => n + 1);
    }

    return (
        <figure className={ligada ? "heroi-tela" : "heroi-tela sem-demo"}>
            <p className="demo-selo"><span className="demo-ponto" aria-hidden="true"></span>Experimente aqui mesmo: é o app de verdade</p>
            <div className="janela">
                <div className="janela-barra">
                    <i aria-hidden="true"></i><i aria-hidden="true"></i><i aria-hidden="true"></i>
                    <span className="janela-endereco">cabrly.github.io/kaizen</span>
                    <button className="janela-botao" type="button" data-demo-zerar title="Voltar a demonstração ao começo" onClick={recomecar}>↺ Recomeçar</button>
                    <a className="janela-botao" href={urlDemo} target="_blank" rel="noopener">Tela cheia ↗</a>
                </div>
                <div className="janela-tela" ref={telaRef}>
                    <img src="img/telas/kanban.webp" width="2880" height="1800" fetchPriority="high"
                         alt="Quadro kanban do Kaizen com as colunas A fazer, Em andamento, Em revisão e Concluído, sobre a cena do pagode à noite." />
                    <a className="demo-abrir-celular botao" href={urlDemo} target="_blank" rel="noopener">Experimentar a demonstração</a>
                    {ligada && (
                        <iframe key={rodada} title="Demonstração interativa do Kaizen" src={urlDemo}
                                className={pronta ? "pronto" : undefined}
                                ref={(quadro) => { quadroRef.current = quadro; encaixar(); }}
                                onLoad={() => setTimeout(() => setPronta(true), 400)} />
                    )}
                </div>
            </div>
        </figure>
    );
}

export default function Heroi({ versao, so }) {
    return (
        <section className="heroi">
            <div className="heroi-fundo" aria-hidden="true"></div>

            <div className="heroi-texto">
                <p className="sobretitulo"><span lang="ja">改善</span> · melhoria contínua</p>
                {/* cada linha numa máscara: o texto sobe de dentro dela na abertura */}
                <h1>
                    <span className="linha"><span>Pequenos passos.</span></span>
                    <span className="linha"><em>Grandes resultados.</em></span>
                </h1>
                <p className="heroi-sub">
                    Organize suas tarefas num kanban e diga o que quer aprender: a IA monta
                    a rotina de estudos no calendário, com vídeo, documentação oficial e
                    atividades pra cada dia. Tudo no seu computador, de graça.
                </p>

                <div className="heroi-acoes">
                    <BotaoBaixar versao={versao} so={so} />
                    <a className="botao botao-vazado" href={APP} target="_blank" rel="noopener">
                        Usar no navegador
                    </a>
                </div>

                <p className="heroi-nota">Windows · Linux · Mac · iPhone · Android — sem conta, sem cartão.</p>
            </div>

            <Demo />
        </section>
    );
}
