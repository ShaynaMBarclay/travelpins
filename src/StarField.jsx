// StarField.jsx
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import "./Shaders/StarMaterial"; // 👈 only need to import once to register

function StarField({ count = 3000, radius = 250 }) {
  const pointsRef = useRef();
  const matRef = useRef();
  const { camera } = useThree();

  const { positions, twinkleOffsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const offs = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = radius * Math.random();
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      offs[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, twinkleOffsets: offs };
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uTime = clock.getElapsedTime();
      matRef.current.uCameraPos.copy(camera.position); // ✅ will now work
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0012;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTwinkleOffset"
          count={twinkleOffsets.length}
          array={twinkleOffsets}
          itemSize={1}
        />
      </bufferGeometry>
      <starMaterial ref={matRef} transparent />
    </points>
  );
}

export default StarField;
