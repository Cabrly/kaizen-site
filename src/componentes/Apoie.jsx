import { useEffect, useMemo, useState } from "react";
import { brCode } from "../lib/pix.js";

/* Pra trocar a chave Pix, edite só estes três campos.
   Nome: até 25 letras; cidade: até 15 (sem acento é mais seguro). Sem chave, mostra "em breve". */
const PIX = { chave: "cc99ff46-3c97-468b-a006-e71fbb7d7364", nome: "Vitor Cabral", cidade: "Palmas" };

function Copiar({ texto, recado, className, children }) {
    const [copiado, setCopiado] = useState(false);
    async function copiar() {
        try {
            await navigator.clipboard.writeText(texto);
        } catch (erro) {
            // http sem permissão de área de transferência: seleciona pra copiar na mão
            window.prompt("Copie:", texto);
            return;
        }
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    }
    return <button className={className} type="button" onClick={copiar}>{copiado ? recado : children}</button>;
}

/** Seção "Apoie": QR Code Pix (BR Code estático) gerado no navegador. */
export default function Apoie() {
    const chave = PIX.chave.trim();
    const codigo = useMemo(() => chave && brCode(chave, PIX.nome, PIX.cidade), [chave]);
    const [svg, setSvg] = useState("");

    // a biblioteca de QR Code é pesada (~60 kB) e só serve aqui embaixo: vem num arquivo à parte, depois da página
    useEffect(() => {
        if (!codigo) return;
        import("../lib/vendor/qrcode.js").then(({ default: qrcode }) => {
            const qr = qrcode(0, "M");
            qr.addData(codigo);
            qr.make();
            setSvg(qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true }));
        });
    }, [codigo]);

    return (
        <section className={chave ? "secao secao-papel" : "secao secao-papel pix-sem-chave"} id="apoie">
            <div className="apoie">
                <div className="apoie-texto">
                    <p className="sobretitulo"><span lang="ja">応援</span> · apoie</p>
                    <h2>Gostou? Ajude o Kaizen a crescer</h2>
                    <p>O Kaizen é grátis e vai continuar assim. Se ele te ajudou a se organizar ou a estudar, um Pix de qualquer valor ajuda a manter o projeto andando: novas cenas, novos recursos e mais tempo pra cuidar dele.</p>
                    <p className="apoie-outros">Não pode doar agora? Dar uma ⭐ no <a href="https://github.com/Cabrly/kaizen" target="_blank" rel="noopener">GitHub</a> e mostrar pra um amigo também ajuda muito.</p>
                </div>

                <div className="pix">
                    {/* o SVG sai da biblioteca de QR Code local (src/vendor), a partir de um texto montado aqui */}
                    <div className="pix-qr" aria-label="QR Code Pix" role="img" dangerouslySetInnerHTML={{ __html: svg }}></div>
                    <p className="pix-rotulo">Chave Pix</p>
                    <div className="pix-chave">
                        <code>{chave || "em breve"}</code>
                        {chave
                            ? <Copiar className="botao botao-pequeno" texto={chave} recado="Copiado!">Copiar</Copiar>
                            : <button className="botao botao-pequeno" type="button" disabled>Copiar</button>}
                    </div>
                    {codigo && <Copiar className="pix-copia-cola" texto={codigo} recado="Código copiado!">Copiar código “Pix copia e cola”</Copiar>}
                    <p className="pix-dica">Abra o app do seu banco, escolha Pix e aponte a câmera pro QR, ou cole a chave.</p>
                </div>
            </div>
        </section>
    );
}
