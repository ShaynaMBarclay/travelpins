// Pin.jsx
import { useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import transformCoordToVec3 from "../Helpers/transformCoord"
import { useThree } from "@react-three/fiber";
import PinLabel from "./PinLabel";
import checkOcclusion from "../Helpers/raycaster";

import "../Shaders/PinMaterial";

const stemHeight = 0.1;
const baseRadius = 2.05;

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-") 
    .replace(/[^\w-]+/g, "");
}

function calculateLabelPosition(camera, normal, headLocalPos) {
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);

    // u = perpendicular vector (normal × camDir)
    const u = new THREE.Vector3().crossVectors(normal, camDir).normalize();

    // offset
    const labelPos = headLocalPos
        .clone()
        .add(normal.clone().multiplyScalar(0.15)) // push outward from globe
        .add(u.clone().multiplyScalar(0.05)); // slide sideways relative to camera
    return labelPos;
}

function calculateHeadPosition(lat, lng, baseRadius, stemHeight) {
    const surfacePos = transformCoordToVec3(lat, lng, baseRadius);
    const normal = surfacePos.clone().normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        normal
    );
    const headLocalPos = surfacePos.clone().add(normal.clone().multiplyScalar(stemHeight / 2));
    return { normal, headLocalPos, surfacePos, quaternion };
}

function Pin({ highlighted, earthRef, lat, lng, name, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { camera, gl } = useThree();

  const headRef = useRef();
  const stemRef = useRef();
  const navigate = useNavigate();

  const { normal, headLocalPos, surfacePos, quaternion } = calculateHeadPosition(lat, lng, baseRadius, stemHeight);

  // camera direction
  const labelPos = calculateLabelPosition(camera, normal, headLocalPos);      // slide sideways relative to camera

  const handleHoverPin = (ref, value) => (e) => {
    e.stopPropagation();
    if (value) {
        const visible = checkOcclusion(ref, earthRef, camera, e, gl.domElement);
        if (!visible) return;
    }
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

    // On mobile, toggle hover state to show label
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
        onPointerOver={handleHoverPin(stemRef, true)}
        onPointerOut={handleHoverPin(stemRef, false)}
        onClick={handleClick(stemRef)}
      >
        <cylinderGeometry args={[0.005, 0.005, stemHeight, 8]} />
        <meshStandardMaterial color={hovered ? "#9E8762" : "#d4b483"} />
      </mesh>

      {/* Head */}
      <mesh
        ref={headRef}
        position={headLocalPos}
        onPointerOver={handleHoverPin(headRef, true)}
        onPointerOut={handleHoverPin(headRef, false)}
        onClick={handleClick(headRef)}

        scale={highlighted ? 1.4 : 1}
      >
        <sphereGeometry args={[0.04, 32, 32]} />
        {highlighted ? (
          <pinMaterial
            attach="material"
          />
        ) : (
          <meshStandardMaterial
            attach="material"
            color={hovered ? "#9E8762" : "#d4b483"}
          />
        )}
      </mesh>

      {/* Tooltip */}
      {hovered && <PinLabel position={labelPos} text={name} />}
    </group>
  );
}

export default Pin;

