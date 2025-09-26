import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CountryPage from "./Pages/CountryPage";
import Placeholder from "./Pages/Placeholder"; 
import ChapterPage from "./Pages/ChapterPage";
import Globe from "./Globe";
import "./Styles/App.css";

function App() {
  return (
    <>
        <Routes>
          <Route path="/country/:countrySlug/:chapterSlug" element={<ChapterPage />} />
          <Route path="/" element={<Placeholder />} /> {/* root homepage placeholder for now */}
          <Route path="/country/:countrySlug" element={<CountryPage />} />
        </Routes>

      <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
        <Globe />
      </div>
    </>
  );
}

export default App;
