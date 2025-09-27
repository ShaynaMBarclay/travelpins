// TourController.jsx
import { useTour } from "@reactour/tour";

export default function TourController() {
  const { setIsOpen } = useTour();

  return (
    <div className="tour-div">
      <button className="tour-start" onClick={() => setIsOpen(true)}>
        🎓 Start Tour
      </button>
    </div>
  );
}