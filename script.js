/* Site do Kaizen: menu, cenas, lupa, animação ao rolar e links de download. */

const REPO = "Cabrly/kaizen";


/* ---------- topo: fica sólido depois de rolar ---------- */

const topo = document.querySelector(".topo");
const marcarTopo = () => topo.classList.toggle("rolou", window.scrollY > 40);
marcarTopo();
window.addEventListener("scroll", marcarTopo, { passive: true });


/* ---------- menu do celular ---------- */

const menu = document.querySelector("#menu");
const abrirMenu = document.querySelector(".menu-abrir");

function fecharMenu() {
    menu.classList.remove("aberto");
    abrirMenu.setAttribute("aria-expanded", "false");
}

abrirMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    abrirMenu.setAttribute("aria-expanded", String(aberto));
});
menu.addEventListener("click", (e) => { if (e.target.closest("a")) fecharMenu(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharMenu(); });


/* ---------- demo: o app de verdade dentro da janela do herói ----------
   O app é desenhado com 1280 px de largura e encolhido pra caber na janela,
   então fica igual ao print. Abaixo de 640 px ficaria pequeno demais pra
   usar: aí fica o print com um botão que abre a demo em outra aba. */

const LARGURA_APP = 1280;
const figuraDemo = document.querySelector("[data-demo]");

if (figuraDemo) {
    // ?demo-url=... no endereço do site troca a demo (pra testar uma cópia local do app)
    const urlDemo = new URLSearchParams(location.search).get("demo-url") || figuraDemo.dataset.demo;
    const tela = figuraDemo.querySelector(".janela-tela");
    let quadro = null;

    figuraDemo.querySelectorAll("[data-demo-abrir], .demo-abrir-celular").forEach((a) => (a.href = urlDemo));

    function encaixar() {
        if (!quadro) return;
        const escala = tela.clientWidth / LARGURA_APP;
        quadro.style.width = `${LARGURA_APP}px`;
        quadro.style.height = `${tela.clientHeight / escala}px`;
        quadro.style.transform = `scale(${escala})`;
    }

    function carregar() {
        if (quadro || tela.clientWidth < 640) return;
        figuraDemo.classList.remove("sem-demo");
        quadro = document.createElement("iframe");
        quadro.title = "Demonstração interativa do Kaizen";
        quadro.src = urlDemo;
        quadro.addEventListener("load", () => setTimeout(() => quadro.classList.add("pronto"), 400));
        tela.append(quadro);
        encaixar();
    }

    figuraDemo.classList.toggle("sem-demo", tela.clientWidth < 640);
    carregar();
    window.addEventListener("resize", () => { carregar(); encaixar(); });

    figuraDemo.querySelector("[data-demo-zerar]").addEventListener("click", () => {
        if (!quadro) return;
        quadro.classList.remove("pronto");
        quadro.src = urlDemo;   // a demo guarda tudo em memória: recarregar volta ao começo
    });
}


/* ---------- cenas: troca a imagem grande e a legenda ---------- */

const cenas = document.querySelector("[data-cenas]");

if (cenas) {
    const imagem = cenas.querySelector("[data-cena-imagem]");
    const cada = cenas.querySelector("[data-cena-cada]");
    const fim = cenas.querySelector("[data-cena-fim]");
    const abas = [...cenas.querySelectorAll("[data-cena]")];

    function escolher(aba) {
        if (aba.getAttribute("aria-selected") === "true") return;
        abas.forEach((a) => {
            a.setAttribute("aria-selected", String(a === aba));
            a.tabIndex = a === aba ? 0 : -1;
        });

        const nova = new Image();
        nova.src = `img/cenas/${aba.dataset.cena}.webp`;
        imagem.classList.add("trocando");
        const trocar = () => {
            imagem.src = nova.src;
            imagem.alt = aba.dataset.alt;
            cada.textContent = aba.dataset.cada;
            fim.textContent = aba.dataset.fim;
            imagem.classList.remove("trocando");
        };
        (nova.decode ? nova.decode() : Promise.resolve()).then(trocar, trocar);
    }

    abas.forEach((aba, i) => {
        aba.tabIndex = i === 0 ? 0 : -1;
        aba.addEventListener("click", () => escolher(aba));
        aba.addEventListener("keydown", (e) => {
            const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
            if (!passo) return;
            e.preventDefault();
            const proxima = abas[(i + passo + abas.length) % abas.length];
            proxima.focus();
            escolher(proxima);
        });
    });
}


/* ---------- lupa: amplia as telas ---------- */

const lupa = document.querySelector(".lupa");

if (lupa && typeof lupa.showModal === "function") {
    const img = lupa.querySelector("img");
    document.querySelectorAll("[data-ampliar]").forEach((botao) => {
        botao.addEventListener("click", () => {
            img.src = botao.dataset.ampliar;
            img.alt = botao.querySelector("img").alt;
            lupa.showModal();
        });
    });
    lupa.querySelector(".lupa-fechar").addEventListener("click", () => lupa.close());
    lupa.addEventListener("click", (e) => { if (e.target === lupa) lupa.close(); });
} else {
    // navegador sem <dialog>: o botão vira um link pra imagem
    document.querySelectorAll("[data-ampliar]").forEach((b) => b.addEventListener("click", () => window.open(b.dataset.ampliar)));
}


/* ---------- surgir ao rolar ---------- */

const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduzir && "IntersectionObserver" in window) {
    const alvos = document.querySelectorAll(
        ".secao-cabeca, .recurso, .passos li, .destaque, .cenas, .celular-texto, .celulares, .cartao, .nivel, .tabela-rolar, .dica, .sistema, .faq, .opcao-ia, .tutorial"
    );
    const olho = new IntersectionObserver((itens) => {
        itens.forEach((item) => {
            if (item.isIntersecting) {
                item.target.classList.add("visivel");
                olho.unobserve(item.target);
            }
        });
    }, { rootMargin: "0px 0px -8% 0px" });

    alvos.forEach((el) => { el.classList.add("surge"); olho.observe(el); });
}


/* ---------- download: detecta o sistema e aponta pro arquivo da última versão ---------- */

function sistemaDoVisitante() {
    const ua = navigator.userAgent;
    if (/Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "celular";
    if (/Windows/i.test(ua)) return "windows";
    if (/Macintosh|Mac OS X/i.test(ua)) return "mac";
    if (/Linux|X11/i.test(ua)) return "linux";
    return null;
}

const NOMES = { windows: "Windows", mac: "Mac", linux: "Linux" };
const so = sistemaDoVisitante();
const cartaoDoSo = so && document.querySelector(`.sistema[data-so="${so}"]`);

if (cartaoDoSo) cartaoDoSo.classList.add("seu-sistema");

const principal = document.querySelector("[data-baixar-principal]");
const rotulo = document.querySelector("[data-baixar-rotulo]");

if (so === "celular") {
    principal.href = "https://cabrly.github.io/kaizen/";
    rotulo.textContent = "Abrir o Kaizen";
} else if (NOMES[so]) {
    rotulo.textContent = `Baixar para ${NOMES[so]}`;
}

// Os nomes dos arquivos mudam a cada versão, então pergunta ao GitHub qual é a última.
// Sem resposta (offline, limite da API), os links continuam indo pra página de versões.
fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((versao) => {
        const arquivos = versao.assets || [];
        const achar = (fim) => arquivos.find((a) => a.name.endsWith(fim));

        document.querySelectorAll("[data-arquivo], [data-arquivo-extra]").forEach((link) => {
            const arquivo = achar(link.dataset.arquivo || link.dataset.arquivoExtra);
            if (arquivo) link.href = arquivo.browser_download_url;
        });

        const doSo = cartaoDoSo && cartaoDoSo.querySelector("[data-arquivo]") || cartaoDoSo;
        if (doSo && doSo.dataset.arquivo && so !== "celular") {
            const arquivo = achar(doSo.dataset.arquivo);
            if (arquivo) principal.href = arquivo.browser_download_url;
        }

        const rotuloVersao = document.querySelector("[data-versao]");
        if (rotuloVersao && versao.tag_name) rotuloVersao.textContent = `Versão atual: ${versao.tag_name}.`;
    })
    .catch(() => { /* fica com os links pra página de versões */ });
