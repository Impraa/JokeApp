import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Router";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Navbar />
    <App />
    <Footer />
  </BrowserRouter>
);
