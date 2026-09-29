import * as THREE from 'three';

let material = null;
let normalMap = null;

function createNormalMap() {
  const n = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = n;
  const g = canvas.getContext('2d');
  const img = g.createImageData(n, n);
  const height = (x, y) => Math.sin(x * 0.19 + Math.sin(y * 0.11) * 2) * 0.5 + Math.sin(y * 0.23 + x * 0.07) * 0.35 + Math.sin((x + y) * 0.31) * 0.2;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const dx = height(x + 1, y) - height(x - 1, y), dy = height(x, y + 1) - height(x, y - 1), i = (y * n + x) * 4;
    img.data[i] = 128 + dx * 60; img.data[i + 1] = 128 + dy * 60; img.data[i + 2] = 255; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(300, 2);
  return t;
}

/** Vật liệu mặt nước dùng chung (sông, hồ, đài phun nước), có gợn sóng trôi. */
export function waterMaterial() {
  if (!material) {
    normalMap = createNormalMap();
    material = new THREE.MeshPhongMaterial({ color: '#4e8a92', specular: '#cfe3ea', shininess: 70, normalMap, normalScale: new THREE.Vector2(0.5, 0.5) });
  }
  return material;
}

export function animateWater(dt) {
  if (normalMap) normalMap.offset.x += dt * 0.02;
}
