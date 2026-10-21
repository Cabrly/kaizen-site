import { useRef } from "react";
import { calmo, gsap, useGSAP } from "../movimento.js";

const PERGUNTAS = [
    ["É grátis mesmo?",
     "Sim. O app é grátis e a IA local também. Se você preferir IA na nuvem, o OpenRouter tem modelos grátis. Claude, ChatGPT e Gemini são opcionais e cobrados pelo próprio serviço, com a sua chave."],
    ["Preciso criar conta?",
     "Não. Não existe conta no Kaizen. A sincronia entre aparelhos usa só um código que você gera."],
    ["Meus dados vão pra algum servidor?",
     <>Não, a menos que você ligue a sincronia ou compartilhe um plano. Nos dois casos, tudo é criptografado no seu aparelho e o servidor guarda só texto cifrado: quem tem o código (ou o link) vê os dados, então só mande pra quem você quiser. As chaves de IA nunca sincronizam. Além disso, o Kaizen conta de forma anônima quantas pessoas usam o app (só “abri hoje”, o tipo de aparelho e a versão, sem nome nem nada do que você estuda), e dá pra desligar no botão <b>Privacidade</b> do app.</>],
    ["Meu computador é fraco. Vai rodar?",
     "O Kaizen roda. A IA local pode ficar lenta: o app mede seu hardware e, se for o caso, recomenda usar a IA na nuvem (grátis) em vez de deixar tudo travando. Também dá pra usar a IA de outro computador seu pela rede."],
    ["Funciona sem internet?",
     "Tarefas e calendário funcionam offline. A IA local também. Precisam de internet: buscar vídeos e documentação pra um plano novo, a IA na nuvem e a sincronia."],
    ["Atualizar apaga minhas tarefas?",
     "Não. Os dados ficam na pasta do usuário, separados do programa. E dá pra fazer backup em arquivo a qualquer hora."],
    ["Já pago o Claude, o ChatGPT ou o Gemini. Dá pra usar?",
     <>Dá. Se você usa o <b>Claude Code</b>, o <b>Gemini CLI</b> ou o <b>Codex</b>, instale, faça login uma vez no terminal e abra o Kaizen no computador: eles aparecem sozinhos em “Onde a IA roda”, usando a sua assinatura, sem chave de API. Também dá pra conectar uma chave de API do Claude, do ChatGPT ou do Gemini.</>],
    ["O que é essa “chave” do OpenRouter? É seguro?",
     "É como uma senha que deixa o Kaizen usar a IA da sua conta no OpenRouter. Ela fica guardada só no seu aparelho e você pode apagar ou criar outra quando quiser, em openrouter.ai/keys. Com modelos grátis, não tem cobrança nenhuma: nem precisa cadastrar cartão."],
    ["Dá pra ver o código?",
     <>Sim, está tudo no <a href="https://github.com/Cabrly/kaizen" target="_blank" rel="noopener">GitHub</a>. Dá até pra publicar a sua versão no GitHub Pages com poucos cliques.</>]
];

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
