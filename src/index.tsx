import React from "react";
import { createRoot } from "react-dom/client";
import { IconContext } from "@phosphor-icons/react";
import App from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <IconContext.Provider value={{ size: 22, weight: "regular", mirrored: false }}>
      <App />
    </IconContext.Provider>
  </React.StrictMode>,
);
