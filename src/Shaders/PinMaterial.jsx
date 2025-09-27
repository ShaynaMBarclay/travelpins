// shaders/PinMaterial.jsx
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

// Custom shader: glowing Fresnel effect with pulse
const PinMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color("pink") },

  // Vertex shader
  `
  varying vec3 vNormal;

  void main() {
    // Pass the normal to fragment for Fresnel effect
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,

  // Fragment shader
  `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vNormal;

  void main() {
    // Fresnel term: bright on edges
    float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.0);

    // Pulse factor
    float pulse = 0.8 + 0.2 * sin(uTime * 3.0);

    // Mix base + fresnel
    vec3 base = uColor * 0.5;          // constant glow everywhere
    vec3 rim  = uColor * fresnel * 1.2; // rim contribution

    vec3 color = (base + rim) * pulse;

    gl_FragColor = vec4(color, 1.0);
  }
  `
);

// Make <pinMaterial /> available in JSX
extend({ PinMaterial });

export { PinMaterial };
