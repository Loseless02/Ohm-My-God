import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./index.css";
import App from "./App";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import FormulaPage from "./pages/FormulaPage";
import TopicPage from "./pages/TopicPage";
import Playground from "./playground/Playground";
import SchaltungPage from "./pages/SchaltungPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/kategori/:id" element={<CategoryPage />} />
          <Route path="/formul/:id" element={<FormulaPage />} />
          <Route path="/konu/:id" element={<TopicPage />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/schaltung" element={<SchaltungPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
