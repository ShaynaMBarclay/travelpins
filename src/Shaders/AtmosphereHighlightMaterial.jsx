//AtmosphereMaterial.jsx
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

// Fresnel shader
const AtmosphereHighlightMaterial = shaderMaterial(
  {},
  `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      vec3 atmosphereColor = vec3(0.4, 0.7, 1.0);
      gl_FragColor = vec4(atmosphereColor, intensity * 1.5);
    }
  `
);

extend({ AtmosphereHighlightMaterial  });