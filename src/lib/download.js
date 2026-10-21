/* Download: descobre o sistema do visitante e pergunta ao GitHub quais são os arquivos da
   última versão (os nomes mudam a cada versão). Sem resposta (offline, limite da API),
   os links continuam indo pra página de versões. */

import { useEffect, useState } from "react";

export const REPO = "Cabrly/kaizen";
export const PAGINA_VERSOES = `https://github.com/${REPO}/releases/latest`;
export const APP = "https://cabrly.github.io/kaizen/";

/** "windows", "mac", "linux", "celular" ou null. Só no navegador. */
export function sistemaDoVisitante() {
    const ua = navigator.userAgent;
    if (/Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "celular";
    if (/Windows/i.test(ua)) return "windows";
    if (/Macintosh|Mac OS X/i.test(ua)) return "mac";
    if (/Linux|X11/i.test(ua)) return "linux";
    return null;
}

/**
 * O sistema do visitante, depois de a página montar. No pré-render (e no primeiro quadro)
 * é null: o HTML gerado no build serve pra qualquer sistema, e o React troca depois.
 */
export function useSistema() {
    const [so, setSo] = useState(null);
    useEffect(() => setSo(sistemaDoVisitante()), []);
    return so;
}

export const NOMES = { windows: "Windows", mac: "Mac", linux: "Linux" };
// fim do nome do instalador principal de cada sistema
export const ARQUIVOS = { windows: "x64-setup.exe", mac: "aarch64.dmg", linux: "amd64.deb" };

export function useUltimaVersao() {
    const [versao, setVersao] = useState(null);
    useEffect(() => {
        fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } })
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then(setVersao)
            .catch(() => { /* fica com os links pra página de versões */ });
    }, []);
    return versao;
}

/** Link direto do arquivo que termina em `fim`, ou null se a versão não tiver (ou não carregou). */
export function arquivo(versao, fim) {
    return versao?.assets?.find((a) => a.name.endsWith(fim))?.browser_download_url ?? null;
}
