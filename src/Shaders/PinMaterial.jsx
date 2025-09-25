// shaders/PinMaterial.jsx
import * as THREE from "three"
import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"

const PinMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color("red") },
  // vertex
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // fragment
  `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    float glow = smoothstep(0.4, 0.0, dist);
    float pulse = 0.7 + 0.3 * sin(uTime * 4.0);
    gl_FragColor = vec4(uColor * glow * pulse, 1.0);
  }
  `
)

// ⬇️ This is critical: register the material with R3F
extend({ PinMaterial })

export { PinMaterial }
