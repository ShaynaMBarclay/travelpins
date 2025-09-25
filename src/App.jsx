import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CountryPage from "./Pages/CountryPage";
import Placeholder from "./Pages/Placeholder"; 
import ChapterPage from "./Pages/ChapterPage";
import "./Styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/country/:countrySlug/:chapterSlug" element={<ChapterPage />} />
        <Route path="/" element={<Placeholder />} /> {/* root homepage placeholder for now */}
        <Route path="/country/:countrySlug" element={<CountryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
