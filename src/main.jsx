import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";
import { iniciarContador } from "./contador.js";

createRoot(document.getElementById("raiz")).render(<StrictMode><App /></StrictMode>);
iniciarContador();
