// components/BookAnimationOverlay.jsx
import { useEffect, useState } from "react";

export default function BookAnimationOverlay({ title, onFinish }) {
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => setOpening(true), 500); // start opening after fade-in
    const finishTimer = setTimeout(() => onFinish?.(), 1500); // remove overlay after animation
    return () => {
      clearTimeout(openTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`book-closed-overlay ${opening ? "opening" : ""}`}>
      <div className="book-closed-spine"></div>
      <div className="book-closed-front">{title}</div>
    </div>
  );
}
