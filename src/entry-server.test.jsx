import { describe, expect, it } from "vitest";
import { perguntasEmTexto, render } from "./entry-server.jsx";
import { PERGUNTAS } from "./conteudo.jsx";

// Roda no Node, sem window nem document: se algum módulo tocar no navegador ao ser
// importado ou renderizado, o pré-render do build quebra, e este teste quebra antes.
describe("pré-render", () => {
    it("renderiza a página inteira no servidor", () => {
        const html = render();
        expect(html).toContain("Pequenos passos.");
        expect(html).toContain('id="perguntas"');
        expect(html).toContain("Gostou? Ajude o Kaizen a crescer");
    });

    it("gera o FAQ em texto puro, sem tags HTML, pro JSON-LD", () => {
        const faq = perguntasEmTexto();
        expect(faq).toHaveLength(PERGUNTAS.length);
        for (const { resposta } of faq) expect(resposta).not.toMatch(/<[^>]+>/);
        expect(faq.find((p) => p.pergunta === "Dá pra ver o código?").resposta).toContain("está tudo no GitHub");
    });
});
