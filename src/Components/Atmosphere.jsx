// Atmosphere.jsx
import * as THREE from "three";
import "../Shaders/AtmosphereHighlightMaterial";
import { useTour } from "@reactour/tour";

function Atmosphere({ radius = 2 }) {
  const { isOpen, currentStep } = useTour();

  const highlight = isOpen && currentStep === 1; 

  return (
    <mesh scale={1.05}>
      <sphereGeometry args={[radius, 64, 64]} />
      {highlight ? (
        <atmosphereHighlightMaterial
          attach="material"
          blending={THREE.AdditiveBlending}
          transparent
          side={THREE.BackSide}
        />
      ) : (
        <meshBasicMaterial
          color="#8ac6ff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      )}
    </mesh>
  );
}

export default Atmosphere;