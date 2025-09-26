// App.jsx
import React from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { TourProvider, useTour } from "@reactour/tour"
import Globe from "./Globe"
import CountryPage from "./Pages/CountryPage"
import ChapterPage from "./Pages/ChapterPage"
import "./Styles/App.css"

// Tour steps
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
    selector: ".globe-canvas",
    position: "top",
    content:
      "Click the France pin to open its country page.\n(Hover a pin to see its country name.)",
    stepInteraction: true,
  },
  {
    selector: '[data-tour="country-book"]',
    position: "left",
    content: "Here you’ll see categories of content for the selected country (eg. France).",
  },
  {
    selector: '[data-tour="chapter-food"]',
    content: "Click this chapter to dive into the details of French food.",
    stepInteraction: true,
  },
  {
    selector: '[data-tour="chapter-book"]',
    position: "right",
    content: "This is the chapter page, where you can read the details.",
  },
  {
    selector: "body",
    position: "center",
    content: "🎉 That’s it! Enjoy exploring.",
  },
]

/**
 * Hook that retries until the selector exists in DOM,
 * and freezes/unfreezes Next/Prev buttons accordingly.
 */
function useStepReady(steps, currentStep, setDisabledActions) {
  React.useEffect(() => {
    const selector = steps[currentStep]?.selector
    if (!selector) return

    let retries = 0
    const check = setInterval(() => {
      const el = document.querySelector(selector)
      if (el) {
        setDisabledActions(false) // element exists → enable buttons
        clearInterval(check)
      } else {
        setDisabledActions(true) // element missing → freeze
        retries++
        if (retries > 50) clearInterval(check) // stop after ~5s
      }
    }, 100)

    return () => clearInterval(check)
  }, [steps, currentStep, setDisabledActions])
}

/**
 * Watches currentStep + URL and keeps them in sync
 */
function TourNavigation({ steps }) {
  const { isOpen, currentStep, setCurrentStep, setDisabledActions } = useTour()
  const navigate = useNavigate()
  const location = useLocation()

  // Wait until selector is ready
  useStepReady(steps, currentStep, setDisabledActions)

  React.useEffect(() => {
    if (!isOpen) return

    const { pathname } = location

    // Step 2: when France pin clicked → advance to country page step
    if (pathname === "/country/france" && currentStep < 3) {
      setCurrentStep(3)
    }

    // Step 4: when Food chapter clicked → advance to chapter step
    if (pathname === "/country/france/food" && currentStep < 5) {
      setCurrentStep(5)
    }
  }, [isOpen, location.pathname, currentStep, setCurrentStep])

  React.useEffect(() => {
    if (!isOpen) return

    // Step 3: enforce France page
    if (currentStep === 3 && location.pathname !== "/country/france") {
      navigate("/country/france")
    }

    // Step 5: enforce Food chapter page
    if (currentStep === 5 && location.pathname !== "/country/france/food") {
      navigate("/country/france/food")
    }

    // Step 6: final step goes home
    if (currentStep === 6 && location.pathname !== "/") {
      navigate("/")
    }
  }, [isOpen, currentStep, location.pathname, navigate])

  return null
}

/**
 * Controller UI for demo/debug
 */
function TourController({ steps }) {
  const { isOpen, setIsOpen, currentStep, setCurrentStep } = useTour()

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      <button onClick={() => setIsOpen(true)}>🎓 Start Tour</button>

      {isOpen && (
        <>
          <div>Step {currentStep + 1}/{steps.length}</div>
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
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <TourProvider steps={steps}>
      <Routes>
        <Route path="/" element={<Globe />} />
        <Route path="/country/:countrySlug" element={<CountryPage />} />
        <Route path="/country/:countrySlug/:chapterSlug" element={<ChapterPage />} />
      </Routes>

      <TourNavigation steps={steps} />
      <TourController steps={steps} />
    </TourProvider>
  )
}
