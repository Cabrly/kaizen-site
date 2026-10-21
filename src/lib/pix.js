/* BR Code estático do Pix (padrão do Banco Central). */

/* O BR Code aceita só ASCII maiúsculo nos campos de nome e cidade. */
export function limpar(texto, limite) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Za-z0-9 ]/g, "").trim().toUpperCase().slice(0, limite);
}

function campo(id, valor) {
    return id + String(valor.length).padStart(2, "0") + valor;
}

export function brCode(chave, nome, cidade) {
    const conta = campo("00", "br.gov.bcb.pix") + campo("01", chave);
    const corpo =
        campo("00", "01") +
        campo("26", conta) +
        campo("52", "0000") +
        campo("53", "986") +
        campo("58", "BR") +
        campo("59", limpar(nome || "KAIZEN", 25)) +
        campo("60", limpar(cidade || "BRASIL", 15)) +
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
