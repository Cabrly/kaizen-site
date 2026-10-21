import { describe, expect, it } from "vitest";
import { brCode, crc16, limpar } from "./pix.js";

const CHAVE = "cc99ff46-3c97-468b-a006-e71fbb7d7364";

describe("crc16", () => {
    it("bate com o valor de referência do CRC16-CCITT-FALSE", () => {
        expect(crc16("123456789")).toBe("29B1");
    });
});

describe("limpar", () => {
    it("tira acento e símbolo, põe em maiúscula e corta no limite", () => {
        expect(limpar("São José d'Água", 25)).toBe("SAO JOSE DAGUA");
        expect(limpar("Palmas", 3)).toBe("PAL");
    });
});

describe("brCode", () => {
    it("monta o código estático completo, terminando no CRC dele mesmo", () => {
        const codigo = brCode(CHAVE, "Vitor Cabral", "Palmas");
        expect(codigo).toBe(
            "00020126580014br.gov.bcb.pix0136cc99ff46-3c97-468b-a006-e71fbb7d736452040000" +
            "5303986" + "5802BR5912VITOR CABRAL6006PALMAS62070503***6304" + crc16(codigo.slice(0, -4))
        );
    });

    it("com valor, inclui o campo 54 com duas casas e recalcula o CRC", () => {
        const codigo = brCode(CHAVE, "Vitor Cabral", "Palmas", 10);
        expect(codigo).toContain("5303986540510.005802BR");
        expect(codigo.slice(-4)).toBe(crc16(codigo.slice(0, -4)));
    });

    it("sem valor (ou zero), deixa o campo 54 de fora: quem paga escolhe", () => {
        expect(brCode(CHAVE, "A", "B", 0)).not.toContain("5303986" + "54");
    });
});
