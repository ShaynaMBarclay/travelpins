// raycaster.js
import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function checkOcclusion(pinRef, earthRef, camera, event, domElement) {
  if (!pinRef.current || !earthRef.current) return false;

  // Convert mouse coords → normalized device coords
  const rect = domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Build ray from the actual camera
  raycaster.setFromCamera(mouse, camera);

  const earthHits = raycaster.intersectObject(earthRef.current, true);
  const pinHits = raycaster.intersectObject(pinRef.current, true);

  if (pinHits.length && earthHits.length) {
    if (earthHits[0].distance < pinHits[0].distance) {
      return false; // occluded by Earth
    }
  }

  return pinHits.length > 0;
}

export default checkOcclusion;
