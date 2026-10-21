import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CENAS, PERGUNTAS, RECURSOS } from "./conteudo.jsx";

const existe = (caminho) => existsSync(new URL(`../public/${caminho}`, import.meta.url));

describe("conteúdo", () => {
    it("toda imagem e vídeo dos recursos existe em public/", () => {
        for (const { imagem, video } of RECURSOS) {
            expect(existe(imagem), imagem).toBe(true);
            if (video) expect(existe(video), video).toBe(true);
        }
    });

    it("toda cena tem imagem e um id único (o id vira o id da aba)", () => {
        for (const { id } of CENAS) expect(existe(`img/cenas/${id}.webp`), id).toBe(true);
        expect(new Set(CENAS.map((c) => c.id)).size).toBe(CENAS.length);
    });

    it("perguntas não se repetem (a pergunta é a key do React e o name do FAQPage)", () => {
        expect(new Set(PERGUNTAS.map(([p]) => p)).size).toBe(PERGUNTAS.length);
    });
});
