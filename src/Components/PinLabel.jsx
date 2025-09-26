//PinLabel.jsx
import { Html } from "@react-three/drei";

function PinLabel({ position, text }) {
  return (
    <Html position={position.toArray()} center>
      <h3
        style={{
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          whiteSpace: "nowrap",
          pointerEvents: "none", // don't block raycasting
        }}
      >
        {text}
      </h3>
    </Html>
  );
}

export default PinLabel;