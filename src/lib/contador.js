/* Contagem anônima de visitas (o mesmo servidor da sincronia do app).
   Uma visita por sessão, de onde veio (só o nome do site: WhatsApp, Google…) e os
   cliques em baixar, abrir no navegador e mexer na demonstração. Sem cookie e sem
   nenhum identificador. */

import { sistemaDoVisitante } from "./download.js";

const CONTADOR = "https://kaizen-sync.kaizen-sync.workers.dev/v1/visita";
const contados = new Set();

function contarSite(acao, extra = {}) {
    if (contados.has(acao) || /^(localhost|127\.0\.0\.1|)$/.test(location.hostname)) return;
    contados.add(acao);
    try {
        const corpo = new Blob([JSON.stringify({ acao, ...extra })], { type: "text/plain" });
        if (!navigator.sendBeacon?.(CONTADOR, corpo)) fetch(CONTADOR, { method: "POST", body: corpo, keepalive: true }).catch(() => {});
    } catch (erro) {
        /* contar nunca atrapalha o site */
    }
}

function origemDaVisita() {
    const utm = new URLSearchParams(location.search).get("utm_source");
    let site = (utm || "").toLowerCase();
    try {
        if (!site && document.referrer) site = new URL(document.referrer).hostname.toLowerCase();
    } catch (erro) { /* referrer estranho */ }
    if (!site || site === location.hostname) return "direto";
    const conhecidos = [["whatsapp", /whatsapp|wa\.me/], ["instagram", /instagram/], ["google", /google\./], ["facebook", /facebook|fb\.|^m\.facebook/],
                        ["x", /(^|\.)x\.com|twitter|t\.co$/], ["linkedin", /linkedin|lnkd/], ["github", /github/], ["youtube", /youtube|youtu\.be/],
                        ["tiktok", /tiktok/], ["telegram", /telegram|t\.me/], ["discord", /discord/]];
    return (conhecidos.find(([, padrao]) => padrao.test(site)) || ["outro"])[0];
}

export function iniciarContador() {
    const so = sistemaDoVisitante();
    try {
        if (!sessionStorage.getItem("kaizen-site.visita")) {
            sessionStorage.setItem("kaizen-site.visita", "1");
            contarSite("visita", { origem: origemDaVisita() });
        }
    } catch (erro) {
        contarSite("visita", { origem: origemDaVisita() });
    }

    document.addEventListener("click", (e) => {
        const sistema = e.target.closest(".sistema[data-so], [data-baixar-principal]");
        const link = e.target.closest("a[href]");
        if (sistema) {
            if (sistema.getAttribute("href") === "#baixar") return;   // o botão do topo só rolou até os downloads
            const qual = sistema.dataset.so || so;
            if (qual === "celular") contarSite("navegador");
            else if (["windows", "mac", "linux"].includes(qual)) contarSite(`baixar_${qual}`);
        } else if (link && /cabrly\.github\.io\/kaizen\/?(\?demo)?$/.test(link.href)) {
            contarSite(link.href.includes("?demo") ? "demo" : "navegador");
        }
    });

    // clicou dentro da demonstração do topo (o iframe pega o foco)
    window.addEventListener("blur", () => setTimeout(() => {
        if (document.activeElement?.tagName === "IFRAME") contarSite("demo");
    }, 0));
}
