/* Painel do Kaizen: lê as contagens anônimas do Worker (GET /v1/painel, com a chave)
   e os downloads do GitHub, e desenha tudo em SVG puro. */

const SERVIDOR = new URLSearchParams(location.search).get("servidor") || "https://kaizen-sync.kaizen-sync.workers.dev";
const REPO = "Cabrly/kaizen";
const GUARDADA = "kaizen-painel.chave";

const PLATAFORMAS = [["pc", "Computador (app ou PC)", "--s1"], ["navegador", "Navegador", "--s2"], ["celular", "Celular", "--s3"]];
const FUNCOES = {
    plano_criado: "Planos criados", plano_importado: "Planos recebidos", plano_compartilhado: "Planos compartilhados",
    item_feito: "Itens marcados ✓", entrega: "Atividades entregues", cartao_revisado: "Flashcards revisados",
    chat: "Mensagens no chat", agenda: "Planos na agenda", resumo: "Resumos da semana abertos", acessibilidade: "Opções de acessibilidade"
};
const SITE = { visita: "Visitas", demo: "Mexeram na demonstração", navegador: "Abriram no navegador",
               baixar_windows: "Baixaram pro Windows", baixar_mac: "Baixaram pro Mac", baixar_linux: "Baixaram pro Linux" };
const ORIGENS = { direto: "Direto / link", whatsapp: "WhatsApp", instagram: "Instagram", google: "Google", facebook: "Facebook",
                  x: "X (Twitter)", linkedin: "LinkedIn", github: "GitHub", youtube: "YouTube", tiktok: "TikTok",
                  telegram: "Telegram", discord: "Discord", outro: "Outros sites" };

const $ = (id) => document.getElementById(id);
const cor = (variavel) => getComputedStyle(document.documentElement).getPropertyValue(variavel).trim();
const numero = (n) => Number(n || 0).toLocaleString("pt-BR");
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[c]);


/* ---------- datas ---------- */

function somarDias(iso, n) {
    const [a, m, d] = iso.split("-").map(Number);
    return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10);
}

function segundaDe(iso) {
    const [a, m, d] = iso.split("-").map(Number);
    const dia = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
    return somarDias(iso, -((dia + 6) % 7));
}

const curto = (iso) => { const [, m, d] = iso.split("-"); return `${d}/${m}`; };


/* ---------- dados ---------- */

let dados = null;   // { hoje, porDia: {dia: {chave: valor}}, downloads }

async function carregar(chave) {

    const resposta = await fetch(`${SERVIDOR}/v1/painel`, { headers: { Authorization: `Bearer ${chave}` } });
    if (resposta.status === 401) throw new Error("Chave errada.");
    if (!resposta.ok) throw new Error(`O servidor respondeu ${resposta.status}.`);
    const { hoje, contagens } = await resposta.json();

    const porDia = {};
    contagens.forEach(({ dia, chave: k, valor }) => ((porDia[dia] ||= {})[k] = valor));

    let downloads = [];
    try {
        const versoes = await (await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=50`)).json();
        downloads = versoes.map((v) => [v.tag_name, v.assets.filter((a) => /(exe|msi|dmg|deb|rpm|AppImage)$/.test(a.name))
            .reduce((soma, a) => soma + a.download_count, 0)]);
    } catch (erro) {
        /* sem GitHub, o resto aparece igual */
    }

    return { hoje, porDia, downloads };

}

function dias(n) {
    return Array.from({ length: n }, (_, i) => somarDias(dados.hoje, i - n + 1));
}

function valor(dia, chave) {
    return dados.porDia[dia]?.[chave] || 0;
}

function somaDesde(desde, chave) {
    return Object.entries(dados.porDia).filter(([dia]) => dia >= desde && dia <= dados.hoje)
        .reduce((soma, [, v]) => soma + (v[chave] || 0), 0);
}

function somaPorPrefixo(desde, prefixo) {
    const total = {};
    Object.entries(dados.porDia).filter(([dia]) => dia >= desde).forEach(([, v]) =>
        Object.entries(v).filter(([k]) => k.startsWith(prefixo)).forEach(([k, n]) => (total[k.slice(prefixo.length)] = (total[k.slice(prefixo.length)] || 0) + n)));
    return total;
}


/* ---------- desenho ---------- */

function tiles() {
    const hoje = dados.hoje;
    const total = dados.downloads.reduce((s, [, n]) => s + n, 0);
    const lista = [
        [numero(valor(hoje, "ativos")), "pessoas hoje", `ontem: ${numero(valor(somarDias(hoje, -1), "ativos"))}`],
        [numero(somaDesde(segundaDe(hoje), "semana")), "nesta semana", `semana passada: ${numero(somaDesde(somarDias(segundaDe(hoje), -7), "semana") - somaDesde(segundaDe(hoje), "semana"))}`],
        [numero(somaDesde(hoje.slice(0, 8) + "01", "mes")), "neste mês", "pessoas diferentes"],
        [numero(somaDesde(somarDias(hoje, -29), "novos")), "pessoas novas", "últimos 30 dias"],
        [numero(somaDesde(somarDias(hoje, -29), "site:visita")), "visitas ao site", "últimos 30 dias"],
        [numero(total), "downloads", "instaladores, todas as versões"]
    ];
    $("tiles").innerHTML = lista.map(([n, rotulo, detalhe]) => `<div class="tile"><strong>${n}</strong><span>${rotulo}</span><small>${detalhe}</small></div>`).join("");
}


/* Barras por dia (empilhadas quando há mais de uma série), com dica ao passar o mouse. */
function barrasPorDia(alvo, series) {

    // desenha na largura de verdade (texto sem esticar); tela estreita mostra 30 dias
    const largura = Math.max(280, alvo.clientWidth);
    const lista = dias(largura < 600 ? 30 : 60);
    const altura = 220, esquerda = 32, direita = 18, base = 196;   // folga pro último rótulo de data
    const totais = lista.map((d) => series.reduce((s, [chave]) => s + valor(d, chave), 0));
    const maximo = Math.max(4, ...totais);
    const passo = Math.ceil(maximo / 4);
    const topo = passo * 4;
    const y = (v) => base - (v / topo) * (base - 8);
    const larguraBarra = (largura - esquerda - direita) / lista.length;

    let svg = "";
    for (let v = 0; v <= topo; v += passo) {
        svg += `<line class="grade-y" x1="${esquerda}" x2="${largura - direita}" y1="${y(v)}" y2="${y(v)}"/><text x="${esquerda - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    }

    lista.forEach((d, i) => {
        const x = esquerda + i * larguraBarra + 1;
        const w = Math.max(1, larguraBarra - 2);   // 2 px de respiro entre as barras
        let acumulado = 0;
        series.forEach(([chave, , variavel], s) => {
            const v = valor(d, chave);
            if (!v) return;
            const y1 = y(acumulado + v), y0 = y(acumulado);
            const ultima = series.slice(s + 1).every(([k]) => !valor(d, k));
            // ponta de cima arredondada só no último pedaço; 2 px de respiro entre pedaços
            svg += ultima
                ? `<path d="M${x},${y0 - (acumulado ? 1 : 0)} V${y1 + 3} Q${x},${y1} ${x + 3},${y1} H${x + w - 3} Q${x + w},${y1} ${x + w},${y1 + 3} V${y0 - (acumulado ? 1 : 0)} Z" fill="${cor(variavel)}"/>`
                : `<rect x="${x}" y="${y1}" width="${w}" height="${Math.max(0, y0 - y1 - (acumulado ? 1 : 0) - 1)}" fill="${cor(variavel)}"/>`;
            acumulado += v;
        });
        if ((lista.length - 1 - i) % 7 === 0) svg += `<text x="${x + w / 2}" y="${altura - 6}" text-anchor="middle">${curto(d)}</text>`;
        svg += `<rect class="alvo" data-i="${i}" x="${esquerda + i * larguraBarra}" y="0" width="${larguraBarra}" height="${base}"/>`;
    });

    alvo.innerHTML = `<svg viewBox="0 0 ${largura} ${altura}" role="img" aria-label="Gráfico de barras por dia">${svg}</svg>`;

    const dica = $("dica");
    alvo.querySelectorAll(".alvo").forEach((retangulo) => {
        retangulo.addEventListener("mousemove", (evento) => {
            const d = lista[Number(retangulo.dataset.i)];
            const linhas = series.map(([chave, nome, variavel]) => `<div><i style="background:${cor(variavel)}"></i>${esc(nome)}: <b style="display:inline">${numero(valor(d, chave))}</b></div>`).join("");
            dica.innerHTML = `<b>${curto(d)}</b>${series.length > 1 ? `<div>Total: ${numero(totais[Number(retangulo.dataset.i)])}</div>` : ""}${linhas}`;
            dica.style.display = "block";
            const caixa = dica.getBoundingClientRect();
            dica.style.left = `${Math.min(innerWidth - caixa.width - 8, evento.pageX + 12)}px`;
            dica.style.top = `${evento.pageY - caixa.height - 12}px`;
            retangulo.style.fill = "rgba(127,127,127,.12)";
        });
        retangulo.addEventListener("mouseleave", () => {
            dica.style.display = "none";
            retangulo.style.fill = "";
        });
    });

}


function barrasHorizontais(alvo, contagem, nomes) {
    const linhas = Object.entries(contagem).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
    if (!linhas.length) {
        alvo.innerHTML = `<p class="vazio">Nada ainda.</p>`;
        return;
    }
    const maximo = linhas[0][1];
    alvo.innerHTML = linhas.map(([k, n]) => `<div class="barra"><span>${esc(nomes?.[k] || k)}</span>
        <div><i style="width:${(100 * n) / maximo}%"></i></div><b>${numero(n)}</b></div>`).join("");
}


function tabela() {
    const lista = dias(60).reverse();
    const colunas = [["ativos", "Pessoas"], ["ativos:pc", "PC"], ["ativos:navegador", "Navegador"], ["ativos:celular", "Celular"],
                     ["novos", "Novas"], ["site:visita", "Visitas site"]];
    $("tabela").innerHTML = `<table><thead><tr><th>Dia</th>${colunas.map(([, n]) => `<th>${n}</th>`).join("")}</tr></thead><tbody>
        ${lista.map((d) => `<tr><td>${curto(d)}</td>${colunas.map(([k]) => `<td>${numero(valor(d, k))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}


function desenhar() {
    const mes = somarDias(dados.hoje, -29);
    tiles();
    $("legenda-ativos").innerHTML = PLATAFORMAS.map(([, nome, v]) => `<span><i style="background:${cor(v)}"></i>${nome}</span>`).join("");
    barrasPorDia($("g-ativos"), PLATAFORMAS.map(([k, nome, v]) => [`ativos:${k}`, nome, v]));
    barrasPorDia($("g-visitas"), [["site:visita", "Visitas", "--s1"]]);
    barrasHorizontais($("b-origens"), somaPorPrefixo(mes, "origem:"), ORIGENS);
    const site = somaPorPrefixo(mes, "site:");
    delete site.visita;
    barrasHorizontais($("b-site"), site, SITE);
    barrasHorizontais($("b-funcoes"), somaPorPrefixo(mes, "evento:"), FUNCOES);
    barrasHorizontais($("b-versoes"), somaPorPrefixo(somarDias(dados.hoje, -6), "versao:"));
    barrasHorizontais($("b-downloads"), Object.fromEntries(dados.downloads));
    tabela();
    $("atualizado").textContent = `Atualizado às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}


/* ---------- entrar ---------- */

async function abrir(chave) {
    try {
        dados = await carregar(chave);
        localStorage.setItem(GUARDADA, chave);
        $("entrar").hidden = true;
        $("painel").hidden = false;
        desenhar();
    } catch (erro) {
        $("entrar").hidden = false;
        $("painel").hidden = true;
        $("erro").textContent = erro.message;
    }
}

$("form-chave").addEventListener("submit", (e) => {
    e.preventDefault();
    abrir($("chave").value.trim());
});
$("recarregar").addEventListener("click", () => abrir(localStorage.getItem(GUARDADA)));
$("sair").addEventListener("click", () => {
    localStorage.removeItem(GUARDADA);
    location.reload();
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => dados && desenhar());
let redesenho = null;
addEventListener("resize", () => {
    $("dica").style.display = "none";
    clearTimeout(redesenho);
    redesenho = setTimeout(() => dados && desenhar(), 200);
});

const guardada = localStorage.getItem(GUARDADA);
if (guardada) abrir(guardada);
else $("entrar").hidden = false;
