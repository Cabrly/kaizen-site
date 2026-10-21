import { useSyncExternalStore } from "react";

const semAvisos = () => () => {};

/**
 * Lê um valor que só existe no navegador (user agent, mídia, endereço) sem quebrar a
 * hidratação: no pré-render e no primeiro render vale `noServidor`, e logo depois o React
 * troca pelo valor de `ler()`. `ler` precisa devolver sempre o mesmo valor (texto, número,
 * booleano) enquanto nada mudar.
 */
export function useDoNavegador(ler, noServidor) {
    return useSyncExternalStore(semAvisos, ler, () => noServidor);
}
