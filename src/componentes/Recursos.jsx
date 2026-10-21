import { useEffect, useRef, useState } from "react";
import { calmo } from "../movimento.js";

// no PC, passar o mouse; no celular (sem mouse), tocar quando a tela aparece
const semMouse = window.matchMedia("(hover: none)").matches;

const RECURSOS = [
    {
        titulo: "Kanban que dá vontade de usar",
        texto: <>Arraste as tarefas entre <b>A fazer</b>, <b>Em andamento</b>, <b>Em revisão</b> e <b>Concluído</b>. Categorias, prioridade, prazo, busca e filtros, sem curva de aprendizado.</>,
        lista: ["Barra de progresso que enche conforme você conclui", "Filtros por categoria e prioridade, ordenação por prazo", "Backup em arquivo com um clique"],
        imagem: "img/telas/kanban-enso.webp", video: "img/videos/kanban.mp4", rotulo: "Ampliar imagem do kanban",
        alt: "Kanban do Kaizen com tarefas de trabalho, estudos e pessoais, cada uma com categoria, prioridade e prazo."
    },
    {
        titulo: "Plano de estudos montado pela IA",
        texto: "Escreva “quero aprender React”. A IA faz três perguntas rápidas, você escolhe os dias e o tempo, e em cerca de um minuto o calendário está pronto.",
        lista: [<>Cada sessão traz <b>vídeo</b>, <b>documentação oficial</b> e <b>atividade prática</b></>, "Materiais em português, inglês ou espanhol", "Não deu tempo? Marque ✕ e o item passa pra próxima sessão"],
        imagem: "img/telas/sessao.webp", video: "img/videos/estudos.mp4", rotulo: "Ampliar imagem da aba Estudos",
        alt: "Aba Estudos com o calendário de outubro e a sessão do dia aberta, mostrando vídeo, documentação e atividade."
    },
    {
        titulo: "Um assistente que conhece seu quadro",
        texto: "Pergunte por onde começar, peça pra quebrar uma tarefa grande ou tire uma dúvida do estudo. A resposta vem formatada, direto ao ponto.",
        lista: ["IA no seu computador, de graça na nuvem ou pela sua assinatura", "Você escolhe o modelo e onde ele roda"],
        imagem: "img/telas/chat.webp", video: "img/videos/chat.mp4", rotulo: "Ampliar imagem do assistente",
        alt: "Conversa com o assistente: ele sugere a ordem das três entregas da semana com base no quadro."
    },
    {
        titulo: "Flashcards prontos e uma IA que sabe o que você já estudou",
        texto: "Marcou ✓ numa sessão? Os cartões daquele conteúdo ficam prontos sozinhos, em segundo plano. É só abrir e revisar.",
        lista: ["Revisão espaçada: o que você acerta volta cada vez mais tarde, o que erra volta logo", "A IA recebe um resumo do seu progresso e explica a partir do que você já sabe", "Planos novos não repetem o básico que você já viu"],
        imagem: "img/telas/flashcards.webp", video: "img/videos/flashcards.mp4", rotulo: "Ampliar imagem dos flashcards",
        alt: "Flashcard de React virado, com a pergunta, a resposta e os botões Errei e Acertei."
    },
    {
        titulo: "Pets de estudo (se você quiser)",
        texto: "Cada plano vira um bichinho. Estudou no dia, ele fica feliz; deixou a sessão pra trás, ele fica tristinho até você recuperar. Enquanto a IA monta o plano, você adota o seu.",
        lista: ["24 bichos, mais de 80 roupinhas e acessórios, comprados com os pontos do estudo", "A ficha do pet guarda tudo o que vocês estudaram, com as notas das atividades"],
        imagem: "img/telas/pets.webp", video: "img/videos/pets.mp4", rotulo: "Ampliar imagem dos pets",
        alt: "Loja dos pets de estudo com gato, cachorro, hamster, coelho, pintinho, sapo, ratinho, raposa, panda, urso, coala e pinguim."
    },
    {
        titulo: "Entregue a atividade e receba nota",
        texto: "Fez a atividade? Entregue escrevendo a resposta, anexando os arquivos do código ou colando o link do GitHub. Com uma IA forte conectada, ela corrige como um professor: nota de 0 a 10, o que ficou bom, onde errou (com a linha) e como melhorar.",
        lista: ["Os pontos em que você teve dificuldade viram reforço nos próximos planos, flashcards e no chat", "Lê o README e os arquivos principais de um repositório público do GitHub", "Corrige com Claude Code, Gemini, ChatGPT ou modelos grandes do OpenRouter"],
        imagem: "img/telas/entrega.webp", rotulo: "Ampliar imagem da correção de uma atividade",
        alt: "Janela de entrega com duas correções: nota 3 com os erros apontados linha a linha e nota 8 depois de corrigir."
    }
];

const CARTOES = [
    { titulo: "Estude com a turma", texto: "Mande seu plano por link ou QR Code. Quem abre ganha uma cópia com vídeos, atividades e flashcards, sem o seu progresso.",
      icone: <><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 2.2-5 5-5s5 2 5 5M13.5 20c.2-2.4 1.6-4 3.5-4s3.4 1.6 3.5 4"/></> },
    { titulo: "Na agenda do celular", texto: "As sessões vão pro Google Agenda, pro iPhone ou pro Outlook, e o celular avisa antes de cada uma.",
      icone: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></> },
    { titulo: "Resumo da semana", texto: "Todo domingo: o que você estudou, suas notas e o que fazer na próxima semana.",
      icone: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/> },
    { titulo: "Acessível", texto: "Texto maior, alto contraste, menos movimento, texto espaçado e leitura em voz alta.",
      icone: <><circle cx="12" cy="4.5" r="2"/><path d="M5 8.5l7 1.5 7-1.5M12 10v5l-3 6M12 15l3 6"/></> }
];

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
    const { imagem, video, alt, rotulo } = recurso;
    const telaRef = useRef(null);
    const videoRef = useRef(null);
    const voltar = useRef(null);
    const [tocando, setTocando] = useState(false);

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

    useEffect(() => {
        if (!video || !semMouse || calmo || !("IntersectionObserver" in window)) return;
        const olho = new IntersectionObserver(([entrada]) => (entrada.isIntersecting ? tocar() : parar()), { threshold: 0.6 });
        olho.observe(telaRef.current);
        return () => {
            olho.disconnect();
            clearTimeout(voltar.current);
        };
    }, [video]);

    const comMouse = video && !semMouse ? { onMouseEnter: tocar, onMouseLeave: parar, onFocus: tocar, onBlur: parar } : {};

    return (
        <button ref={telaRef} className={tocando ? "recurso-tela ampliar tocando" : "recurso-tela ampliar"} type="button"
                aria-label={rotulo} onClick={() => ampliar({ imagem, video, alt })} {...comMouse}>
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
