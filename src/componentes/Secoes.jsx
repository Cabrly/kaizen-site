/* Seções só de conteúdo: texto e imagem, sem estado. */

import { DESTAQUES, MODELOS, NIVEIS, PRIVACIDADE } from "../conteudo.jsx";
import { APP } from "../lib/download.js";
import { Cartoes } from "./Recursos.jsx";
import { Marca } from "./Topo.jsx";

const fora = { target: "_blank", rel: "noopener" };

export function Faixa() {
    return (
        <section className="faixa" aria-label="Destaques">
            <ul>{DESTAQUES.map(([forte, fraco]) => <li key={forte}><strong>{forte}</strong><span>{fraco}</span></li>)}</ul>
        </section>
    );
}

export function ComoFunciona() {
    return (
        <section className="secao secao-papel" id="como-funciona">
            <header className="secao-cabeca">
                <p className="sobretitulo"><span lang="ja">学びの道</span> · o caminho do estudo</p>
                <h2>Do “quero aprender” ao calendário em três passos</h2>
            </header>

            <ol className="passos">
                <li>
                    <span className="passo-num">1</span>
                    <h3>Diga o assunto</h3>
                    <p>Clique em <b>+ Novo plano</b>, escreva o tema e escolha o idioma dos materiais.</p>
                </li>
                <li>
                    <span className="passo-num">2</span>
                    <h3>Responda três perguntas</h3>
                    <p>Nível, objetivo e base. Depois escolha os dias da semana, o tempo por dia e por quantas semanas.</p>
                </li>
                <li>
                    <span className="passo-num">3</span>
                    <h3>Estude e marque</h3>
                    <p>O calendário se preenche sozinho. Abra o dia, assista, leia, pratique e marque ✓.</p>
                </li>
            </ol>

            <aside className="destaque">
                <div className="destaque-icone" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>
                </div>
                <div>
                    <h3>A IA nunca inventa link</h3>
                    <p>Modelo pequeno costuma inventar endereço. Por isso a IA só monta o roteiro (tópicos, ordem, objetivos e atividades), e quem busca os materiais é o próprio Kaizen: vídeos do YouTube que cabem no tempo da sessão, sem repetir, e a página certa da documentação oficial, lida direto do site do assunto. As datas também são calculadas pelo código, não pela IA.</p>
                </div>
            </aside>
        </section>
    );
}

export function Celular() {
    return (
        <section className="secao" id="celular">
            <div className="celular">
                <div className="celular-texto">
                    <p className="sobretitulo"><span lang="ja">どこでも</span> · em qualquer lugar</p>
                    <h2>No bolso também</h2>
                    <p>Abra <a href={APP} {...fora}>cabrly.github.io/kaizen</a> no celular e adicione à tela de início. Vira um app com ícone próprio, que abre até sem internet.</p>

                    <h3>Mesmos dados no PC e no celular</h3>
                    <p>Gere um código no PC (tipo <code>KZ7F-Q2MA-9XTD</code>), aponte a câmera pro QR e pronto: tarefas e planos seguem juntos.</p>
                    <ul className="lista-check">
                        <li>Criptografado no aparelho antes de sair: o servidor só guarda texto embaralhado</li>
                        <li>Sem conta e sem senha</li>
                        <li>Se os dois mudarem offline, o Kaizen pergunta com qual versão ficar</li>
                    </ul>
                </div>

                <div className="celulares" aria-label="Telas do Kaizen no celular">
                    <figure className="aparelho"><img src="img/telas/cel-kanban.webp" width="1170" height="2532" loading="lazy" alt="Kanban no celular, com a cena do monte Fuji ao fundo." /></figure>
                    <figure className="aparelho aparelho-meio"><img src="img/telas/cel-chat.webp" width="1170" height="2532" loading="lazy" alt="Conversa com o assistente no celular." /></figure>
                    <figure className="aparelho"><img src="img/telas/cel-estudos.webp" width="1170" height="2532" loading="lazy" alt="Calendário de estudos no celular." /></figure>
                </div>
            </div>
        </section>
    );
}


export function Privacidade() {
    return (
        <section className="secao secao-papel" id="privacidade">
            <header className="secao-cabeca">
                <p className="sobretitulo"><span lang="ja">安心</span> · tranquilidade</p>
                <h2>Feito pra rodar na sua máquina</h2>
                <p>O Kaizen é <i>local-first</i>: funciona inteiro no seu computador e só sai pra internet quando você pede.</p>
            </header>
            <Cartoes itens={PRIVACIDADE} />
        </section>
    );
}

/* Passo do tutorial do OpenRouter: uma telinha desenhada em CSS, só pra pessoa reconhecer o que vai ver. */
function Mock({ endereco, kaizen, centro, children }) {
    return (
        <div className={kaizen ? "mock mock-kaizen" : "mock"} aria-hidden="true">
            <div className="mock-barra"><span>{endereco}</span></div>
            <div className={centro ? "mock-corpo mock-centro" : "mock-corpo"}>{children}</div>
        </div>
    );
}

export function SuaIa() {
    return (
        <section className="secao" id="sua-ia">
            <header className="secao-cabeca">
                <p className="sobretitulo"><span lang="ja">選ぶ</span> · escolha</p>
                <h2>Escolha a IA que combina com você</h2>
                <p>O Kaizen não te prende a nenhuma. Comece pela grátis e troque quando quiser, em <b>Assistente IA → Onde a IA roda</b>.</p>
            </header>

            <div className="opcoes-ia">
                <div className="opcao-ia opcao-destaque">
                    <p className="opcao-selo">Mais fácil</p>
                    <h3>Grátis na nuvem</h3>
                    <p className="opcao-quem">OpenRouter</p>
                    <p>Funciona em qualquer aparelho, até no celular. Cria a conta em 2 minutos, sem cartão.</p>
                    <a href="#openrouter">Ver o passo a passo ↓</a>
                </div>
                <div className="opcao-ia">
                    <h3>Grátis no seu PC</h3>
                    <p className="opcao-quem">Ollama</p>
                    <p>A IA roda na sua placa de vídeo e nada sai do computador. O app instala tudo num clique.</p>
                    <a href="#requisitos">Que PC eu preciso? ↓</a>
                </div>
                <div className="opcao-ia">
                    <h3>Sua assinatura</h3>
                    <p className="opcao-quem">Claude Code · Gemini CLI · Codex</p>
                    <p>Já paga o Claude, o Gemini ou o ChatGPT? Faça login na ferramenta de terminal e o Kaizen usa ela, sem chave.</p>
                    <span className="opcao-nota">No app de computador</span>
                </div>
                <div className="opcao-ia">
                    <h3>Chave de API</h3>
                    <p className="opcao-quem">Claude · ChatGPT · Gemini</p>
                    <p>Pra quem já tem conta de desenvolvedor: cola a chave e escolhe o modelo. Paga só o que usar.</p>
                </div>
            </div>

            <div className="tutorial" id="openrouter">
                <h3 className="tutorial-titulo">IA grátis em 4 passos, com o OpenRouter</h3>
                <p className="tutorial-sub">Leva uns 2 minutos. Não precisa de cartão nem de saber programar.</p>

                <ol className="tutorial-passos">
                    <li>
                        <Mock endereco="openrouter.ai" centro>
                            <span className="mock-logo">OpenRouter</span>
                            <span className="mock-botao mock-escuro">Sign in</span>
                            <span className="mock-cursor"></span>
                        </Mock>
                        <h4>Crie sua conta</h4>
                        <p>Abra <a href="https://openrouter.ai" {...fora}>openrouter.ai</a> e clique em <b>Sign in</b>. O jeito mais rápido é <b>entrar com o Google</b>.</p>
                    </li>
                    <li>
                        <Mock endereco="openrouter.ai/keys">
                            <span className="mock-titulo">API Keys</span>
                            <span className="mock-botao">Create Key</span>
                            <span className="mock-cursor mock-cursor-2"></span>
                        </Mock>
                        <h4>Crie uma chave</h4>
                        <p>Vá em <a href="https://openrouter.ai/keys" {...fora}>openrouter.ai/keys</a>, clique em <b>Create Key</b>, dê um nome (ex.: <i>Kaizen</i>) e confirme.</p>
                    </li>
                    <li>
                        <Mock endereco="openrouter.ai/keys">
                            <span className="mock-titulo">Your new key</span>
                            <span className="mock-campo"><code>sk-or-v1-8f3a…c21e</code><span className="mock-copiar">Copy</span></span>
                        </Mock>
                        <h4>Copie a chave</h4>
                        <p>Copie o código que aparece (começa com <code>sk-or-</code>). <b>Ele só aparece uma vez</b>: se perder, é só criar outro.</p>
                    </li>
                    <li>
                        <Mock endereco="Kaizen · Assistente IA" kaizen>
                            <span className="mock-titulo">☁ Conectar OpenRouter</span>
                            <span className="mock-campo"><code>sk-or-v1-8f3a…c21e</code></span>
                            <span className="mock-botao mock-vermelho">Salvar</span>
                        </Mock>
                        <h4>Cole no Kaizen</h4>
                        <p>No Kaizen, abra <b>Assistente IA → Onde a IA roda → Conectar OpenRouter</b>, cole e clique em <b>Salvar</b>. Pronto!</p>
                    </li>
                </ol>

                <p className="tutorial-nota">O Kaizen usa só os modelos <b>grátis</b> do OpenRouter, então nada é cobrado. Nos horários de pico eles podem ficar mais lentos, e a conta grátis tem um limite diário de pedidos (um plano de estudo gasta poucos).</p>
            </div>
        </section>
    );
}



export function Requisitos() {
    return (
        <section className="secao" id="requisitos">
            <header className="secao-cabeca">
                <p className="sobretitulo"><span lang="ja">おすすめ</span> · recomendações</p>
                <h2>Que computador eu preciso?</h2>
                <p>O Kaizen em si é leve e roda em qualquer máquina. Quem pesa é a IA local, e o que manda é a <b>memória da placa de vídeo (VRAM)</b>.</p>
            </header>

            <div className="niveis">
                {NIVEIS.map((n) => (
                    <div className={n.recomendado ? "nivel nivel-recomendado" : "nivel"} key={n.nome}>
                        {n.recomendado && <p className="nivel-selo">Recomendado</p>}
                        <p className="nivel-nome">{n.nome}</p>
                        <p className="nivel-placa">{n.placa}</p>
                        <p className="nivel-modelo">{n.modelo}</p>
                        <p className="nivel-obs">{n.obs}</p>
                    </div>
                ))}
            </div>

            <details className="tabela-detalhe">
                <summary>Ver os modelos que testamos</summary>
                <div className="tabela-rolar">
                    <table className="tabela">
                        <caption>Modelos testados montando o mesmo plano (React, 12 sessões de 1 h)</caption>
                        <thead>
                            <tr><th scope="col">Modelo</th><th scope="col">Tamanho</th><th scope="col">Resultado</th></tr>
                        </thead>
                        <tbody>
                            {MODELOS.map(([modelo, tamanho, serve, selo, nota]) => (
                                <tr key={modelo}>
                                    <td><code>{modelo}</code></td><td>{tamanho}</td>
                                    <td><span className={serve ? "ok" : "nao"}>{selo}</span> {nota}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>

            <div className="dicas">
                <div className="dica">
                    <h3>Sem placa de vídeo? Sem problema</h3>
                    <p>Use a IA de outro computador seu pela rede (Tailscale ou VPN), ou o <a href="https://openrouter.ai" {...fora}>OpenRouter</a>, que tem modelos grátis e é o jeito recomendado de usar sem pagar nada.</p>
                </div>
            </div>
        </section>
    );
}

export function Final() {
    return (
        <section className="final">
            <span className="final-selo" aria-hidden="true">改善</span>
            <h2>Um passo de cada vez.</h2>
            <p>Comece hoje com uma tarefa pequena.</p>
            <div className="heroi-acoes">
                <a className="botao" href="#baixar">Baixar o Kaizen</a>
                <a className="botao botao-vazado" href={APP} {...fora}>Usar no navegador</a>
            </div>
        </section>
    );
}

export function Rodape() {
    return (
        <footer className="rodape">
            <div className="rodape-dentro">
                <Marca />
                <nav aria-label="Rodapé">
                    <a href="https://github.com/Cabrly/kaizen" {...fora}>GitHub</a>
                    <a href="https://github.com/Cabrly/kaizen/releases" {...fora}>Versões</a>
                    <a href="https://github.com/Cabrly/kaizen/issues" {...fora}>Reportar problema</a>
                    <a href={APP} {...fora}>Abrir o app</a>
                </nav>
                <p>Feito por <a href="https://github.com/Cabrly" {...fora}>Cabrly</a> · <span lang="ja">改善</span> melhoria contínua</p>
            </div>
            <p className="rodape-creditos">Bichinhos dos pets: <a href="https://github.com/microsoft/fluentui-emoji" {...fora}>Fluent Emoji</a>, da Microsoft (licença MIT).</p>
        </footer>
    );
}
