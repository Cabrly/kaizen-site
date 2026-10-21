import { StrictMode } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import App from "./App.jsx";
import { PERGUNTAS } from "./conteudo.jsx";

/**
 * A página inteira como HTML estático. O scripts/prerender.mjs coloca isso dentro de #raiz no
 * build, então buscadores, assistentes de IA e previews de link leem o conteúdo sem rodar
 * JavaScript. No navegador, o React assume esse mesmo HTML (hydrateRoot) em vez de redesenhar.
 */
export function render() {
    return renderToString(<StrictMode><App /></StrictMode>);
}

/** As perguntas frequentes em texto puro, para o FAQPage do JSON-LD. */
export function perguntasEmTexto() {
    const texto = (no) => (typeof no === "string" ? no : renderToStaticMarkup(<>{no}</>).replace(/<[^>]+>/g, ""));
    return PERGUNTAS.map(([pergunta, resposta]) => ({ pergunta, resposta: texto(resposta) }));
}
