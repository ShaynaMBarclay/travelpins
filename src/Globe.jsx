// Globe.jsx
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture, Html } from "@react-three/drei";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import StarField from "./StarField";
import CountryPage from "./Pages/CountryPage";
import { useNavigate } from "react-router-dom";

function latLngToVector3(lat, lng, radius = 2.05) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Pin({ lat, lng, name, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const headRef = useRef();
  const stemRef = useRef();

  const navigate = useNavigate()

  const stemHeight = 0.1;
  const baseRadius = 2.05;

  const surfacePos = latLngToVector3(lat, lng, baseRadius);
  const normal = surfacePos.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    normal
  );
  const headLocalPos = surfacePos
    .clone()
    .add(normal.clone().multiplyScalar(stemHeight / 2));

  const handleClick = (ref) => (e) => {
    e.stopPropagation();
    const worldPos = new THREE.Vector3();
    ref.current.getWorldPosition(worldPos);
    setSelected((s) => !s);
    onClick?.(worldPos);
    navigate(`/country/${France}`);
  };

  return (
    <group>
      {/* Stem */}
      <mesh
        ref={stemRef}
        position={surfacePos}
        quaternion={quaternion}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick(stemRef)}
      >
        <cylinderGeometry args={[0.005, 0.005, stemHeight, 8]} />
        <meshStandardMaterial color={hovered ? "#9E8762" : "#d4b483"} />
      </mesh>

      {/* Head */}
      <mesh
        ref={headRef}
        position={headLocalPos}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick(headRef)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={hovered ? "#9E8762" : "#d4b483"} />
      </mesh>
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

  const locations = [
    { lat: 40.7128, lng: -74.006, name: "New York" },
    { lat: 48.8566, lng: 2.3522, name: "Paris" },
    { lat: 35.6895, lng: 139.6917, name: "Tokyo" },
    { lat: 36.81897, lng: 10.16579, name: "Tunis" },
    { lat: 39.045753, lng: -76.641273, name: "Maryland" },
  ];

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
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <GlobeScene />
    </Canvas>
  );
}
