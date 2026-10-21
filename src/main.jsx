import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";
import { iniciarContador } from "./lib/contador.js";
import { iniciarRolagem } from "./lib/movimento.js";

iniciarRolagem();
createRoot(document.getElementById("raiz")).render(<StrictMode><App /></StrictMode>);
iniciarContador();
