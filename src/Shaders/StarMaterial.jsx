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
    // --------------------- Vertex Shader ---------------------

    uniform float uTime;
    uniform vec3 uCameraPos;
    attribute float aTwinkleOffset; // Each star has an offset so they don't all twinkle in sync
    varying float vTwinkle;         // Passed to fragment shader: how much the star twinkles
    varying float vDist;            // Passed to fragment shader: distance from camera

    void main() {
      vec3 worldPos = position;
      // Calculate distance from camera to this star
      vDist = length(uCameraPos - worldPos);

      // Create a twinkle effect using sine wave and offset.
      // Multiplying time by 1.5 makes the twinkling faster.
      vTwinkle = 0.5 + 0.8 * sin(uTime * 1.5 + aTwinkleOffset);

      // Standard projection of the vertex position
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      // Set the size of the star point
      gl_PointSize = 3.5;
    }
    `,
    `
    // --------------------- Fragment Shader ---------------------

    varying float vTwinkle; // Twinkle factor
    varying float vDist;    // Distance from camera

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      // Discard pixels outside a circular region (makes the star round instead of square)
      if (length(uv) > 0.5) discard;

      // nearColor: warm tone for nearby stars
      // farColor: cooler tone for distant stars
      vec3 nearColor = vec3(1.0, 0.9, 0.7);
      vec3 farColor  = vec3(0.6, 0.6, 1.0);

      // Interpolate between nearColor and farColor based on distance
      // Stars further away appear more bluish
      float t = clamp(vDist / 300.0, 0.0, 1.0);
      vec3 baseColor = mix(nearColor, farColor, t);

      // Apply twinkling effect to final color
      vec3 finalColor = baseColor * vTwinkle;

      gl_FragColor = vec4(finalColor, 1.0);
    }
    `
  );

  extend({ StarMaterial }); // 👈 makes <starMaterial /> available

  export { StarMaterial };
