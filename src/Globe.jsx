// Globe.jsx
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

//-- DATA -- //
import countries_coord from "./Data/countries-coord.json";

//-- COMPONENTS --//
import Pin from "./Components/Pin";
import Atmosphere from "./Components/Atmosphere";
import MovingStars from "./Components/MovingStars";

//Creates the earth with its texture and creates all the pins on earth from given country data
function EarthWithPins({ onPinClick, spinning}) {
  const texture = useTexture("/earth-texture.jpg");
  const earthRef = useRef();

  // Idle spin only when "spinning" is true
  useFrame(() => {
    if (spinning && earthRef.current) {
      earthRef.current.rotation.y += 0.001; // slower = smoother
    }
  });

  // convert your JSON to an array of {lat, lng, name}
  const locations = Object.entries(countries_coord.countries_coord).map(
    ([name, { lat, lng }]) => ({
      name,
      lat,
      lng,
    })
  );

  return (
    <group ref={earthRef}>
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial map={texture} />
      </Sphere>
      <Atmosphere radius={2} /> 
      {locations.map((loc, i) => (
        <Pin key={i} {...loc} onClick={onPinClick} earthRef={earthRef}/>
      ))}
    </group>
  );
}

//Declares a globe scene with controls and spinning (zooms and stops for a bit when we click on a pin)
function GlobeScene() {
  const controlsRef = useRef();
  const [targetPos, setTargetPos] = useState(null);
  const [zooming, setZooming] = useState(false);
  const [spinning, setSpinning] = useState(true); // 👈 control idle spin

  useFrame(({ camera }) => {
    if (zooming && targetPos && controlsRef.current) {
      // smooth target interpolation
      controlsRef.current.target.lerp(targetPos, 0.05);
      setSpinning(false)

      // keep camera radius relative to target
      const camDir = new THREE.Vector3()
        .subVectors(camera.position, controlsRef.current.target)
        .normalize();
      const desiredPos = targetPos.clone().add(camDir.multiplyScalar(3)); // 3 units away
      camera.position.lerp(desiredPos, 0.05);

      controlsRef.current.update();

      if (controlsRef.current.target.distanceTo(targetPos) < 0.01) {
        setZooming(false);
        // restart spin after a short delay
        setTimeout(() => setSpinning(true), 1500);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, -2, -4]} intensity={0.6} color="#88aaff" />
      <pointLight position={[0, 0, 6]} intensity={20} />

      <EarthWithPins
        spinning={spinning}
        onPinClick={(worldPos) => {
          setTargetPos(worldPos.clone());
          setZooming(true);
        }}
      />
      <MovingStars />
      <OrbitControls ref={controlsRef} enableZoom enableDamping dampingFactor={0.1} />
    </>
  );
}

export default function Globe() {
  return (
    <Canvas className="globe-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        touchAction: "none", // prevents weird scroll/zoom gestures on mobile
      }}
      camera={{ position: [0, 0, 6], fov: 50 }}
    >
      <GlobeScene />
    </Canvas>
  );
}