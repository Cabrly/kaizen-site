/* Todo o texto repetível do site, separado da apresentação. Os componentes só desenham
   o que está aqui: pra mudar um recurso, uma cena ou uma pergunta, mexa só neste arquivo.
   Textos com negrito ou link são JSX; o resto é texto puro. */

/* ---------- Faixa de destaques [forte, fraco] ---------- */

export const DESTAQUES = [
    ["100% grátis", "sem plano pago, sem anúncio"],
    ["IA no seu PC", "modelos leves do Ollama"],
    ["Seus dados ficam com você", "nada vai pra servidor nosso"],
    ["PC e celular", "sincronia criptografada"]
];


/* ---------- Navegação do topo ---------- */

export const MENU = [["#recursos", "Recursos"], ["#como-funciona", "Como funciona"], ["#sua-ia", "Sua IA"],
              ["#requisitos", "Requisitos"], ["#perguntas", "Perguntas"], ["#apoie", "Apoie"]];


/* ---------- Recursos (cada um com print e, quando tem, vídeo do app em uso) ---------- */

export const RECURSOS = [
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


/* ---------- Cartões "E mais" ---------- */

export const CARTOES = [
    { titulo: "Estude com a turma", texto: "Mande seu plano por link ou QR Code. Quem abre ganha uma cópia com vídeos, atividades e flashcards, sem o seu progresso.",
      icone: <><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 2.2-5 5-5s5 2 5 5M13.5 20c.2-2.4 1.6-4 3.5-4s3.4 1.6 3.5 4"/></> },
    { titulo: "Na agenda do celular", texto: "As sessões vão pro Google Agenda, pro iPhone ou pro Outlook, e o celular avisa antes de cada uma.",
      icone: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></> },
    { titulo: "Resumo da semana", texto: "Todo domingo: o que você estudou, suas notas e o que fazer na próxima semana.",
      icone: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/> },
    { titulo: "Acessível", texto: "Texto maior, alto contraste, menos movimento, texto espaçado e leitura em voz alta.",
      icone: <><circle cx="12" cy="4.5" r="2"/><path d="M5 8.5l7 1.5 7-1.5M12 10v5l-3 6M12 15l3 6"/></> }
];


/* ---------- Cenas de fundo do app ---------- */

export const CENAS = [
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


/* ---------- Privacidade ---------- */

export const PRIVACIDADE = [
    { titulo: "IA no seu PC", texto: "Com o Ollama, o modelo roda na sua placa de vídeo. Nenhuma conversa sai do computador.",
      icone: <><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></> },
    { titulo: "Dados na sua pasta", texto: "Tarefas e planos ficam num arquivo na pasta do usuário. Atualizar ou reinstalar não apaga nada.",
      icone: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></> },
    { titulo: "IA em um clique", texto: "O app confere memória e placa de vídeo, recomenda o modelo certo e instala tudo sozinho, sem terminal.",
      icone: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></> },
    { titulo: "Atualiza sozinho", texto: "Saiu versão nova? O app avisa ao abrir e se atualiza num clique, com pacote assinado.",
      icone: <><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/></> }
];


/* ---------- Requisitos: níveis de computador ---------- */

export const NIVEIS = [
    { nome: "PC simples", placa: "Sem placa boa · 8 GB de RAM", modelo: <><code>llama3.2:3b</code> ou <code>qwen3:1.7b</code></>,
      obs: "Funciona, mais devagar e com planos mais simples. Dica: use a IA grátis na nuvem (OpenRouter)." },
    { nome: "Mínimo", placa: "6 GB de VRAM · 8 GB de RAM", modelo: <code>qwen3:4b</code>,
      obs: "GTX 1660, RTX 2060, RTX 3050. Plano de 12 sessões em ~45 s." },
    { nome: "Ideal", placa: "12 GB de VRAM · 16 GB de RAM", modelo: <code>qwen3:8b</code>, recomendado: true,
      obs: "RTX 3060 12 GB, RTX 4070. Melhor equilíbrio entre qualidade e velocidade." },
    { nome: "Mac", placa: "M1 ou mais novo · 16 GB", modelo: <code>qwen3:8b</code>,
      obs: "A memória é compartilhada entre CPU e GPU, então roda bem." }
];


/* ---------- Requisitos: modelos testados [modelo, tamanho, serve?, selo, nota] ---------- */

export const MODELOS = [
    ["qwen3:8b", "5,2 GB", true, "Recomendado", "~65 s, melhor qualidade"],
    ["qwen3:4b", "2,5 GB", true, "Ótimo", "~45 s, bom pra placa de 6 GB"],
    ["llama3.2:3b", "2,0 GB", true, "Bom", "12 sessões coerentes, com mini projeto"],
    ["qwen3:1.7b", "1,4 GB", true, "Bom", "progressão boa, roda em PC simples"],
    ["gemma3:1b", "0,8 GB", false, "Não serve", "quebra o formato da resposta"],
    ["qwen2.5:3b", "1,9 GB", false, "Não serve", "entra em loop"]
];


/* ---------- Perguntas frequentes [pergunta, resposta]. Viram também o FAQPage do JSON-LD (scripts/prerender.mjs) ---------- */

export const PERGUNTAS = [
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
