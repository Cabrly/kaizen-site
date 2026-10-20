/* Seção "Apoie": monta o QR Code Pix (BR Code estático, padrão do Banco Central)
   a partir dos data-pix-* da seção #apoie. Sem chave, mostra "em breve". */

import qrcode from "./vendor/qrcode.js";

const secao = document.querySelector("#apoie");

if (secao) {
    const chave = secao.dataset.pixChave.trim();
    const nome = limpar(secao.dataset.pixNome || "KAIZEN", 25);
    const cidade = limpar(secao.dataset.pixCidade || "BRASIL", 15);

    if (chave) {
        const codigo = brCode(chave, nome, cidade);

        secao.querySelector("[data-pix-mostrar]").textContent = chave;

        const qr = qrcode(0, "M");
        qr.addData(codigo);
        qr.make();
        secao.querySelector("[data-pix-qr]").innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });

        ligarCopiar(secao.querySelector("[data-pix-copiar]"), chave, "Copiado!");
        const copiaCola = secao.querySelector("[data-pix-copiacola]");
        copiaCola.hidden = false;
        ligarCopiar(copiaCola, codigo, "Código copiado!");
    } else {
        secao.classList.add("pix-sem-chave");
    }
}


function ligarCopiar(botao, texto, recado) {
    botao.disabled = false;
    const original = botao.textContent;
    botao.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(texto);
        } catch (erro) {
            // http sem permissão de área de transferência: seleciona pra copiar na mão
            window.prompt("Copie:", texto);
            return;
        }
        botao.textContent = recado;
        setTimeout(() => (botao.textContent = original), 2000);
    });
}


/* O BR Code aceita só ASCII maiúsculo nos campos de nome e cidade. */
function limpar(texto, limite) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Za-z0-9 ]/g, "").trim().toUpperCase().slice(0, limite);
}

function campo(id, valor) {
    return id + String(valor.length).padStart(2, "0") + valor;
}

function brCode(chave, nome, cidade) {
    const conta = campo("00", "br.gov.bcb.pix") + campo("01", chave);
    const corpo =
        campo("00", "01") +
        campo("26", conta) +
        campo("52", "0000") +
        campo("53", "986") +
        campo("58", "BR") +
        campo("59", nome) +
        campo("60", cidade) +
        campo("62", campo("05", "***")) +
        "6304";
    return corpo + crc16(corpo);
}

/* CRC16-CCITT (polinômio 0x1021, início 0xFFFF), como pede o manual do Pix. */
function crc16(texto) {
    let crc = 0xffff;
    for (let i = 0; i < texto.length; i++) {
        crc ^= texto.charCodeAt(i) << 8;
        for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
}
