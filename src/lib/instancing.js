import * as THREE from 'three';
import { getRoot } from './scene-helpers.js';

/**
 * Vẽ nhiều bản sao của cùng một hình trong 1 lần gọi vẽ.
 * Mỗi phần tử: { x, y, z, rx, ry, rz, s | sx, sy, sz, c }.
 */
export function instanced(geometry, material, items, { shadow = true, parent = getRoot(), dynamic = false } = {}) {
  if (!items.length) return null;
  const im = new THREE.InstancedMesh(geometry, material, items.length);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  items.forEach((p, i) => {
    dummy.position.set(p.x, p.y || 0, p.z);
    dummy.rotation.set(p.rx || 0, p.ry || 0, p.rz || 0);
    dummy.scale.set(p.sx || p.s || 1, p.sy || p.s || 1, p.sz || p.s || 1);
    dummy.updateMatrix();
    im.setMatrixAt(i, dummy.matrix);
    im.setColorAt(i, color.set(p.c || '#ffffff'));
  });
  im.castShadow = shadow;
  im.receiveShadow = true;
  if (dynamic) im.frustumCulled = false;
  else im.computeBoundingSphere();
  parent.add(im);
  return im;
}
