import { useEffect, useMemo, useRef, useState } from "react";
import { brCode } from "../lib/pix.js";
import { calmo, gsap, useGSAP } from "../lib/movimento.js";

/* Pra trocar a chave Pix, edite só estes três campos.
   Nome: até 25 letras; cidade: até 15 (sem acento é mais seguro). Sem chave, mostra "em breve". */
const PIX = { chave: "cc99ff46-3c97-468b-a006-e71fbb7d7364", nome: "Vitor Cabral", cidade: "Palmas" };

/** Valores prontos, em reais. 0 = quem paga escolhe no banco. */
const VALORES = [5, 10, 25, 50, 0];

const reais = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

// a biblioteca de QR Code é pesada (~60 kB) e só serve aqui embaixo: vem num arquivo à parte, uma vez só
let qrcodeCarregando = null;
const carregarQrcode = () => (qrcodeCarregando ||= import("../lib/vendor/qrcode.js").then((m) => m.default));

/* Pétalas de sakura saindo de um ponto: o "obrigado" quando alguém copia a chave. */
function soltarPetalas(origem, palco) {
    if (calmo) return;
    const caixa = palco.getBoundingClientRect();
    const ponto = origem.getBoundingClientRect();
    const x = ponto.left + ponto.width / 2 - caixa.left;
    const y = ponto.top + ponto.height / 2 - caixa.top;
    for (let i = 0; i < 18; i++) {
        const petala = document.createElement("span");
        petala.className = "petala";
        petala.setAttribute("aria-hidden", "true");
        palco.append(petala);
        // voa inteira e só desbota no último meio segundo (desbotar junto com o voo apagava cedo demais)
        const duracao = gsap.utils.random(1.1, 1.8);
        gsap.fromTo(petala,
            { x, y, scale: gsap.utils.random(0.6, 1.1), rotate: gsap.utils.random(0, 360) },
            {
                x: x + gsap.utils.random(-180, 120),
                y: y + gsap.utils.random(-220, -60),
                rotate: `+=${gsap.utils.random(120, 420)}`,
                duration: duracao,
                ease: "power2.out"
            });
        gsap.to(petala, { autoAlpha: 0, duration: 0.5, delay: duracao - 0.5, ease: "power1.in", onComplete: () => petala.remove() });
    }
}

function Copiar({ texto, recado, className, aoCopiar, children }) {
    const [copiado, setCopiado] = useState(false);
    async function copiar(evento) {
        const botao = evento.currentTarget;
        try {
            await navigator.clipboard.writeText(texto);
        } catch {
            // http sem permissão de área de transferência: seleciona pra copiar na mão
            window.prompt("Copie:", texto);
            return;
        }
        setCopiado(true);
        aoCopiar?.(botao);
        setTimeout(() => setCopiado(false), 2000);
    }
    return (
        <button className={className} type="button" onClick={copiar}>
            {/* aria-live: o leitor de tela anuncia o "Copiado!" */}
            <span aria-live="polite">{copiado ? recado : children}</span>
        </button>
    );
}

/** Seção "Apoie": escolhe o valor, o QR Code Pix (BR Code estático) é gerado no navegador. */
export default function Apoie() {
    const chave = PIX.chave.trim();
    const [valor, setValor] = useState(10);
    const codigo = useMemo(() => chave && brCode(chave, PIX.nome, PIX.cidade, valor), [chave, valor]);
    const [svg, setSvg] = useState("");
    const cartao = useRef(null);

    useEffect(() => {
        if (!codigo) return undefined;
        let valido = true;   // trocou de valor antes de carregar: o QR antigo não sobrescreve o novo
        carregarQrcode().then((qrcode) => {
            const qr = qrcode(0, "M");
            qr.addData(codigo);
            qr.make();
            if (valido) setSvg(qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true }));
        });
        return () => { valido = false; };
    }, [codigo]);

    const { contextSafe } = useGSAP(() => {
        if (calmo || !svg) return;
        // QR novo entra girando de leve, como um carimbo
        gsap.fromTo(".pix-qr svg", { scale: 0.85, rotate: -4, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(2)" });
    }, { scope: cartao, dependencies: [svg] });

    // o cartão inclina em 3D seguindo o mouse (só com mouse fino)
    useGSAP(() => {
        if (calmo || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
        const caixa = cartao.current;
        gsap.set(caixa, { transformPerspective: 900 });
        const girarX = gsap.quickTo(caixa, "rotateX", { duration: 0.5, ease: "power3.out" });
        const girarY = gsap.quickTo(caixa, "rotateY", { duration: 0.5, ease: "power3.out" });
        const mover = (e) => {
            const r = caixa.getBoundingClientRect();
            girarY(((e.clientX - r.left) / r.width - 0.5) * 10);
            girarX(-((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const soltar = () => { girarX(0); girarY(0); };
        caixa.addEventListener("pointermove", mover);
        caixa.addEventListener("pointerleave", soltar);
        return () => {
            caixa.removeEventListener("pointermove", mover);
            caixa.removeEventListener("pointerleave", soltar);
        };
    }, { scope: cartao });

    const agradecer = contextSafe((botao) => soltarPetalas(botao, cartao.current));

    return (
        <section className={chave ? "secao secao-papel" : "secao secao-papel pix-sem-chave"} id="apoie">
            <div className="apoie">
                <div className="apoie-texto">
                    <p className="sobretitulo"><span lang="ja">応援</span> · apoie</p>
                    <h2>Gostou? Ajude o Kaizen a crescer</h2>
                    <p>O Kaizen é grátis e vai continuar assim. Se ele te ajudou a se organizar ou a estudar, um Pix de qualquer valor ajuda a manter o projeto andando: novas cenas, novos recursos e mais tempo pra cuidar dele.</p>
                    <p className="apoie-outros">Não pode doar agora? Dar uma ⭐ no <a href="https://github.com/Cabrly/kaizen" target="_blank" rel="noopener">GitHub</a> e mostrar pra um amigo também ajuda muito.</p>
                </div>

                <div className="pix" ref={cartao}>
                    {chave && (
                        <fieldset className="pix-valores">
                            <legend className="pix-rotulo">Quanto você quer doar?</legend>
                            {VALORES.map((v) => (
                                <label key={v} className="pix-valor">
                                    <input type="radio" name="pix-valor" value={v} checked={valor === v} onChange={() => setValor(v)} />
                                    <span>{v ? reais(v) : "Outro valor"}</span>
                                </label>
                            ))}
                        </fieldset>
                    )}

                    {/* o SVG sai da biblioteca de QR Code local (src/lib/vendor), a partir de um texto montado aqui */}
                    <div className="pix-qr" role="img" dangerouslySetInnerHTML={{ __html: svg }}
                         aria-label={valor ? `QR Code Pix de ${reais(valor)}` : "QR Code Pix, valor escolhido no banco"}></div>
                    <p className="pix-quanto">{valor ? <>Pix de <b>{reais(valor)}</b>, já preenchido no banco</> : "Você escolhe o valor no app do banco"}</p>

                    <p className="pix-rotulo">Chave Pix</p>
                    <div className="pix-chave">
                        <code>{chave || "em breve"}</code>
                        {chave
                            ? <Copiar className="botao botao-pequeno" texto={chave} recado="Copiado!" aoCopiar={agradecer}>Copiar</Copiar>
                            : <button className="botao botao-pequeno" type="button" disabled>Copiar</button>}
                    </div>
                    {codigo && <Copiar className="pix-copia-cola" texto={codigo} recado="Código copiado!" aoCopiar={agradecer}>Copiar código “Pix copia e cola”</Copiar>}
                    <p className="pix-dica">Abra o app do seu banco, escolha Pix e aponte a câmera pro QR, ou cole o código.</p>
                </div>
            </div>
        </section>
    );
}
