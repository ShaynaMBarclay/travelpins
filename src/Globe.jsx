// Globe.jsx
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture, Html } from "@react-three/drei";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import StarField from "./StarField";
import CountryPage from "./Pages/CountryPage";
import { useNavigate } from "react-router-dom";
import countries_coord from "./Data/countries-coord.json";

function latLngToVector3(lat, lng, radius = 2.05) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")   // spaces → dashes
    .replace(/[^\w-]+/g, ""); // remove special chars
}

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

function Pin({ lat, lng, name, onClick }) {
  const [hovered, setHovered] = useState(false);
  const headRef = useRef();
  const stemRef = useRef();
  const navigate = useNavigate();

  const stemHeight = 0.1;
  const baseRadius = 2.05;

  const surfacePos = latLngToVector3(lat, lng, baseRadius);
  const normal = surfacePos.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    normal
  );
  const headLocalPos = surfacePos.clone().add(normal.clone().multiplyScalar(stemHeight / 2));

  // ✅ hover handler now inside component (has closure access)
  const handleHoverPin = (value) => () => {
    setHovered(value);
  };

  const handleClick = (ref) => (e) => {
    e.stopPropagation();
    const worldPos = new THREE.Vector3();
    ref.current.getWorldPosition(worldPos);

    onClick?.(worldPos);

    // navigate to country
    const slug = slugify(name);
    navigate(`/country/${slug}`);

    // 👇 On mobile, also toggle hover state to show label
    if ("ontouchstart" in window) {
      setHovered((prev) => !prev);
    }
  };

  return (
    <group>
      {/* Stem */}
      <mesh
        ref={stemRef}
        position={surfacePos}
        quaternion={quaternion}
        onPointerOver={handleHoverPin(true)}
        onPointerOut={handleHoverPin(false)}
        onClick={handleClick(stemRef)}
      >
        <cylinderGeometry args={[0.005, 0.005, stemHeight, 8]} />
        <meshStandardMaterial color={hovered ? "#9E8762" : "#d4b483"} />
      </mesh>

      {/* Head */}
      <mesh
        ref={headRef}
        position={headLocalPos}
        onPointerOver={handleHoverPin(true)}
        onPointerOut={handleHoverPin(false)}
        onClick={handleClick(headRef)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={hovered ? "#9E8762" : "#d4b483"} />
      </mesh>

      {/* Tooltip */}
      {hovered && <PinLabel position={headLocalPos} text={name} />}
    </group>
  );
}

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
        <Pin key={i} {...loc} onClick={onPinClick} />
      ))}
    </group>
  );
}

function MovingStars() {
  return <StarField count={5000} radius={400} />;
}

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
    <Canvas
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