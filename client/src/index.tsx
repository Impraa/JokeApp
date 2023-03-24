import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Router";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CookiesProvider>
    <BrowserRouter>
      <Navbar />
      <App />
      <Footer />
    </BrowserRouter>
  </CookiesProvider>
);
