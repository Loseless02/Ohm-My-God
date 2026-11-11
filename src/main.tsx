import { StrictMode, Suspense, lazy } from "react";
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
import PruefungPage from "./pages/PruefungPage";
import { I18nProvider, applyLang, detectLang, loadLang } from "./i18n";

// ağır sayfalar ayrı parçalarda: ana sayfa telefonda hızlı açılsın
const Playground = lazy(() => import("./playground/Playground"));
const SchaltungPage = lazy(() => import("./pages/SchaltungPage"));

const lang = detectLang();

// çeviri sözlüğü ilk çizimden önce yüklensin — yanlış dilde bir an görünüp değişmesin
loadLang(lang)
  .catch(() => undefined)
  .then(() => {
    applyLang(lang);
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <I18nProvider initial={lang}>
          <BrowserRouter>
            <Routes>
              <Route element={<App />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/kategori/:id" element={<CategoryPage />} />
                <Route path="/formul/:id" element={<FormulaPage />} />
                <Route path="/konu/:id" element={<TopicPage />} />
                <Route
                  path="/playground"
                  element={
                    <Suspense fallback={null}>
                      <Playground />
                    </Suspense>
                  }
                />
                <Route
                  path="/schaltung"
                  element={
                    <Suspense fallback={null}>
                      <SchaltungPage />
                    </Suspense>
                  }
                />
                <Route path="/pruefung" element={<PruefungPage />} />
                <Route path="*" element={<HomePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </I18nProvider>
      </StrictMode>,
    );
  });
