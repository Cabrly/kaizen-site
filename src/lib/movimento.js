/* Animação do site: GSAP + ScrollTrigger, e a rolagem suave do Lenis no mesmo relógio.
   Quem pede menos movimento no sistema fica sem nada disso: rolagem nativa e tudo parado.
   Este módulo também é carregado no pré-render (Node), então nada aqui pode tocar em
   window ou document ao ser importado: só dentro das funções. */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const temJanela = typeof window !== "undefined";

/** true quando o sistema pede menos movimento (e no pré-render, onde não há animação). */
export const calmo = !temJanela || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A instância do Lenis, ou null (menos movimento, ou antes de iniciarRolagem). */
export let lenis = null;

/**
 * Liga a rolagem suave e a navegação pelos links "#secao". Chamar uma vez, no navegador.
 * O Lenis anda no tick do GSAP: o ScrollTrigger lê a posição no mesmo quadro, sem tremer.
 */
export function iniciarRolagem() {
    // <details> abrindo e fechando muda a altura da página: as posições dos gatilhos precisam ser refeitas
    document.addEventListener("toggle", () => ScrollTrigger.refresh(), true);
    document.addEventListener("click", aoClicarEmAncora);

    if (calmo) return;
    lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
    gsap.ticker.lagSmoothing(0);
}

/* Links internos: rola até a seção e leva o foco do teclado pra ela, então o próximo Tab
   continua de lá (e não do menu). O endereço ganha o #secao, como num link normal. */
function aoClicarEmAncora(evento) {
    const link = evento.target.closest('a[href^="#"]');
    if (!link || evento.defaultPrevented || evento.metaKey || evento.ctrlKey || evento.shiftKey) return;
    const hash = link.getAttribute("href");
    const alvo = hash === "#" ? document.body : document.querySelector(hash);
    if (!alvo) return;
    evento.preventDefault();
    history.pushState(null, "", hash === "#" ? location.pathname + location.search : hash);
    rolarAte(alvo);
}

export function rolarAte(alvo) {
    const focar = () => {
        if (alvo === document.body) return;
        if (!alvo.matches("a, button, input, select, textarea, [tabindex]")) alvo.setAttribute("tabindex", "-1");
        alvo.focus({ preventScroll: true });
    };
    // a folga do topo fixo vem do scroll-padding-top do CSS, que o Lenis e o navegador respeitam
    if (lenis) {
        lenis.scrollTo(alvo === document.body ? 0 : alvo, { duration: 1.2, onComplete: focar });
        return;
    }
    if (alvo === document.body) window.scrollTo({ top: 0, behavior: calmo ? "auto" : "smooth" });
    else alvo.scrollIntoView({ behavior: calmo ? "auto" : "smooth" });
    focar();
}

export { gsap, ScrollTrigger, useGSAP };
