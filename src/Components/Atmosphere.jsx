// Atmosphere.jsx
import * as THREE from "three";

function Atmosphere({ radius = 2 }) {
  return (
    <mesh scale={1.03}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial
        color="#8ac6ffff"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export default Atmosphere;