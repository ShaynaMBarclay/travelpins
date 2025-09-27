//PinLabel.jsx
import { Html } from "@react-three/drei";

/*-- CSS */
import "../Styles/PinLabel.css"

function PinLabel({ position, text }) {
  return (
    <Html position={position.toArray()} center>
      <h3 className="pin-label">
        {text}
      </h3>
    </Html>
  );
}

export default PinLabel;