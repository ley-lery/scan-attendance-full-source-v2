import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../public/i18n.ts";
import { ToastProvider } from "@heroui/toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <ToastProvider placement="top-right" />
          <I18nextProvider i18n={i18n}>
            <App />
          </I18nextProvider>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>,
);

