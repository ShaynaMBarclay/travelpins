// Shaders/StarMaterial.jsx
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

const StarMaterial = shaderMaterial(
  {
    uTime: 0,
    uCameraPos: new THREE.Vector3(),
  },
  `
  uniform float uTime;
  uniform vec3 uCameraPos;
  attribute float aTwinkleOffset;
  varying float vTwinkle;
  varying float vDist;

  void main() {
    vec3 worldPos = position;
    vDist = length(uCameraPos - worldPos);

    vTwinkle = 0.5 + 0.5 * sin(uTime + aTwinkleOffset);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 3.5;
  }
  `,
  `
  varying float vTwinkle;
  varying float vDist;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    if (length(uv) > 0.5) discard;

    vec3 nearColor = vec3(1.0, 0.9, 0.7);
    vec3 farColor  = vec3(0.6, 0.6, 1.0);

    float t = clamp(vDist / 300.0, 0.0, 1.0);
    vec3 baseColor = mix(nearColor, farColor, t);

    vec3 finalColor = baseColor * vTwinkle;
    gl_FragColor = vec4(finalColor, 1.0);
  }
  `
);

extend({ StarMaterial }); // 👈 makes <starMaterial /> available

export { StarMaterial };
