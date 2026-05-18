/**
 * @file main.jsx
 * @description Punto de entrada (entrypoint) principal para la aplicación React en el navegador. Monta la aplicación bajo React.StrictMode e inicializa el enrutador BrowserRouter.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);