import GlobalStyles from "styles/GlobalStyles";

import ComponentRenderer from "ComponentRenderer.js";
import "./index.css";

import SaaSProductLandingPage from "demos/SaaSProductLandingPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

export default function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/:type/:slug" element={<ComponentRenderer />} />
          <Route
            path="/components/:type/:subtype/:name"
            element={<ComponentRenderer />}
          />
          <Route
            path="/components/:type/:name"
            element={<ComponentRenderer />}
          />
          <Route path="/" element={<SaaSProductLandingPage />} />
        </Routes>
      </Router>
    </>
  );
}