import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";
import { iniciarContador } from "./lib/contador.js";
import { iniciarRolagem } from "./lib/movimento.js";

iniciarRolagem();
// o HTML já veio pronto do build (scripts/prerender.mjs): o React só liga os eventos e o estado
hydrateRoot(document.getElementById("raiz"), <StrictMode><App /></StrictMode>);
iniciarContador();
