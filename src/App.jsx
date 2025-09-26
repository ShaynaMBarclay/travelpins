import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"
import CountryPage from "./Pages/CountryPage"
import ChapterPage from "./Pages/ChapterPage"
import Globe from "./Globe"
import { TourProvider, useTour } from "@reactour/tour"
import "./Styles/App.css"

const steps = [
  {
    selector: "body",
    position: "center",
    content: "👋 Welcome! Let’s take a quick tour of how this works.",
  },
  {
    selector: ".globe-canvas",
    content: "This is the globe. You can rotate and zoom to explore countries.",
  },
  {
    selector: ".pin",
    content: "Click a pin to open its country page.",
  },
  {
    selector: ".country-page",
    content: "Here you’ll see categories of content for that country.",
  },
  {
    selector: ".chapter-page",
    content: "Finally, click a chapter to dive into the details.",
  },
  {
    selector: "body",
    position: "center",
    content: "🎉 That’s it! Enjoy exploring.",
  },
]

function TourController() {
  const { setIsOpen, currentStep, setCurrentStep } = useTour()

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      <button onClick={() => setIsOpen(true)}>🎓 Start Tour</button>
      <div style={{ marginTop: 8 }}>
        Step: {currentStep + 1}/{steps.length}
      </div>
      <button
        onClick={() => setCurrentStep(currentStep - 1)}
        disabled={currentStep === 0}
      >
        ⬅ Prev
      </button>
      <button
        onClick={() => setCurrentStep(currentStep + 1)}
        disabled={currentStep === steps.length - 1}
      >
        Next ➡
      </button>
    </div>
  )
}

function App() {
  const [open, setOpen] = useState(false)

  return (
    <TourProvider steps={steps} isOpen={open} setIsOpen={setOpen}>
      <Routes>
        <Route path="/country/:countrySlug/:chapterSlug" element={<ChapterPage />} />
        <Route path="/" element={<Globe />} />
        <Route path="/country/:countrySlug" element={<CountryPage />} />
      </Routes>

      <TourController />
    </TourProvider>
  )
}

export default App
