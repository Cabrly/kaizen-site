import { describe, expect, it } from "vitest";
import { ARQUIVOS, arquivo } from "./download.js";

const versao = {
    tag_name: "v1.5.0",
    assets: [
        { name: "Kaizen_1.5.0_x64-setup.exe", browser_download_url: "https://exemplo/win.exe" },
        { name: "Kaizen_1.5.0_aarch64.dmg", browser_download_url: "https://exemplo/mac.dmg" }
    ]
};

describe("arquivo", () => {
    it("acha o instalador pelo fim do nome", () => {
        expect(arquivo(versao, ARQUIVOS.windows)).toBe("https://exemplo/win.exe");
        expect(arquivo(versao, ARQUIVOS.mac)).toBe("https://exemplo/mac.dmg");
    });

    it("devolve null quando a versão não tem o arquivo ou ainda não carregou", () => {
        expect(arquivo(versao, ARQUIVOS.linux)).toBeNull();
        expect(arquivo(null, ARQUIVOS.windows)).toBeNull();
    });
});
