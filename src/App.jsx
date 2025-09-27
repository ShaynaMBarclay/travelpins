// App.jsx
import React from "react"
import { Routes, Route } from "react-router-dom"
import { TourProvider } from "@reactour/tour"

/*--COMPONENTS */
import Globe from "./Globe"
import ScrollToTop from "./Components/ScrollToTop"
import CountryPage from "./Pages/CountryPage"
import ChapterPage from "./Pages/ChapterPage"
import TourController from "./Components/TourController.jsx"
import GlobalSpinner from "./Components/GlobalSpinner";
import { LoadingProvider } from "./Components/LoadingContext.jsx"

/*-- CSS */
import "./Styles/App.css"
import "./Styles/Tour.css"

// Tour steps
import { steps } from "./Data/tourSteps.js";

export default function App() {
  return (
    <div>
      <LoadingProvider>
      <ScrollToTop />
      <GlobalSpinner />
      <Routes>
        <Route
          path="/"
          element={
            <TourProvider
              steps={steps}
              popoverClassName="reactour__popover"
            >
              <Globe />
            <TourController/>  
            </TourProvider>
          }
        />
        <Route path="/country/:countrySlug" element={<CountryPage />} />
        <Route
          path="/country/:countrySlug/:chapterSlug"
          element={<ChapterPage />}
        />
      </Routes>
      </LoadingProvider>
    </div>
  )
}
