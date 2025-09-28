import { useState, useEffect } from "react";
import Globe from "./Globe";
import TourController from "./Components/TourController.jsx";
import { TourProvider } from "@reactour/tour";
import { steps } from "./Data/tourSteps.js";


export default function TitlePage() {
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowGlobe(true), 3000); // 3-second title
    return () => clearTimeout(timer);
  }, []);

  if (showGlobe) {
    return (
      <TourProvider steps={steps} popoverClassName="reactour__popover">
        <Globe />
        <TourController />
      </TourProvider>
    );
  }

  return (
    <div className="title-page">
      <h1 className="title">🗺️ Pathfinder's Tale</h1>
      <p className="subtitle">Embark on your grand adventure…</p>
    </div>
  );
}
