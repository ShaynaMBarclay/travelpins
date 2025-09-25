  import { Canvas, useFrame } from "@react-three/fiber";
  import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
  import { useRef } from "react";
  import { useState } from "react";
  import * as THREE from "three";
  import { Html } from "@react-three/drei";
  import {PinMaterial} from "./Shaders/PinMaterial"
  import StarField from "./StarField";

  function latLngToVector3(lat, lng, radius = 2.05) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  function Pin({ lat, lng, name }) {
  const [hovered, setHovered] = useState(false)
  const [selected, setSelected] = useState(false)
  const matRef = useRef()

  const stemHeight = 0.10
  const baseRadius = 2.05

  const surfacePos = latLngToVector3(lat, lng, baseRadius)
  const normal = surfacePos.clone().normalize()

  const quaternion = new THREE.Quaternion()
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)

  const headPos = surfacePos.clone().add(normal.clone().multiplyScalar(stemHeight / 2))

  // Animate shader time
  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uTime = clock.getElapsedTime()
    }
  })

  return (
    <group>
      {/* Stem */}
      <mesh
        position={surfacePos}
        quaternion={quaternion}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => { 
          setSelected(!selected)
          console.log("Stem clicked at:", surfacePos);
      }}>
        <cylinderGeometry args={[0.015, 0.015, stemHeight, 8]} />
        <meshStandardMaterial color={hovered ? "orange" : "red"} />
      </mesh>

      {/* Head with Shader */}
      <mesh
        position={headPos}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => { 
          setSelected(!selected)
          console.log("Head clicked at:", headPos)
      }}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <pinMaterial ref={matRef} uColor={hovered ? new THREE.Color("orange") : new THREE.Color("pink")} />
      </mesh>

      {/* Popup */}
      {selected && (
        <Html position={headPos.toArray()} center>
          <div
            style={{
              background: "white",
              color: "black",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            📍 {name}
          </div>
        </Html>
      )}
    </group>
  )
}
  function Atmosphere({ radius = 2 }) {
  return (
    <mesh scale={1.05}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial
        color="#4faaff"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide} // render inside-out to avoid z-fighting
      />
    </mesh>
  );
}

  function EarthWithPins() {
    const texture = useTexture("/earth-texture.jpg");
    const earthRef = useRef();

    useFrame(() => {
      earthRef.current.rotation.y += 0.0015;
    });

    const locations = [
      { lat: 40.7128, lng: -74.006, name: "New York" },
      { lat: 48.8566, lng: 2.3522, name: "Paris" },
      { lat: 35.6895, lng: 139.6917, name: "Tokyo" },
      { lat: 36.81897, lng: 10.16579, name: "Tunis"},
      { lat: 39.045753, lng: -76.641273, name: "Maryland"}
    ];

    return (
      <group ref={earthRef}>
        <Sphere args={[2, 64, 64]}>
          <meshStandardMaterial map={texture} />
        </Sphere>

        {/* Atmosphere Glow */}
        <Atmosphere radius={2} />

        {locations.map((loc, i) => (
          <Pin key={i} {...loc} />
        ))}
      </group>
    );
  }

    function MovingStars() {
    const starsRef = useRef();
    useFrame(() => {
      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0020;
      }
    });

    return (
      <StarField count={5000} radius={300} />
    )
  }
  
  export default function Globe() {
    return (
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        {/* Base fill light */}
        <ambientLight intensity={0.60} />

        {/* Sunlight */}
        <directionalLight position={[5, 3, 5]} intensity={1.2} castShadow />

        {/* Back/rim light */}
        <directionalLight position={[-5, -2, -4]} intensity={0.6} color={"#88aaff"} />

        {/* Point light near camera */}
        <pointLight position={[0, 0, 6]} intensity={20} />

        <EarthWithPins />
        <MovingStars/>
        <OrbitControls enableZoom />
      </Canvas>
    );
  }
