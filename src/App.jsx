import React from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop";
import CountryPage from "./Pages/CountryPage";
import ChapterPage from "./Pages/ChapterPage";
import Globe from "./Globe";
import "./Styles/App.css";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/country/:countrySlug/:chapterSlug" element={<ChapterPage />} />
        <Route path="/" element={<Globe />} />
        <Route path="/country/:countrySlug" element={<CountryPage />} />
      </Routes>
    </>
  );
}

export default App;
