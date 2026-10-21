/* Animação do site: GSAP + ScrollTrigger, e a rolagem suave do Lenis no mesmo relógio.
   Quem pede menos movimento no sistema fica sem nada disso: rolagem nativa e tudo parado. */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// o Lenis anda no tick do GSAP: o ScrollTrigger lê a posição no mesmo quadro, sem tremer
export const lenis = calmo ? null : new Lenis({ autoRaf: false, anchors: { offset: -84 } });

if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
    gsap.ticker.lagSmoothing(0);
}

// <details> abrindo e fechando muda a altura da página: as posições dos gatilhos precisam ser refeitas
document.addEventListener("toggle", () => ScrollTrigger.refresh(), true);

export { gsap, ScrollTrigger, useGSAP };
