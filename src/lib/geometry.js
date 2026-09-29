import * as THREE from 'three';
import { valueNoise } from './noise.js';

export function matrix(x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)),
    new THREE.Vector3(sx, sy, sz),
  );
}

/** Khối cầu méo theo nhiễu: dùng làm tán cây, bụi cây, tượng đá. */
export function blob(radius, seed, amplitude = 0.5, widthSegments = 9, heightSegments = 7) {
  const g = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = valueNoise(v.x / radius * 1.4 + seed * 3.1, v.y / radius * 1.4 + seed * 1.7, v.z / radius * 1.4 - seed * 2.3);
    v.multiplyScalar(1 + (n - 0.5) * amplitude);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/**
 * Gộp nhiều phần thành 1 geometry có màu theo đỉnh.
 * Mặt hướng xuống được tối đi một chút để giả bóng đổ khuất (ambient occlusion).
 * parts: [{ geometry, color, matrix?, flat? }]
 */
export function mergeColored(parts) {
  const positions = [], normals = [], colors = [];
  const c = new THREE.Color();
  for (const part of parts) {
    let g = part.geometry.clone();
    if (part.matrix) g.applyMatrix4(part.matrix);
    if (g.index) g = g.toNonIndexed();
    const p = g.attributes.position, n = g.attributes.normal;
    c.set(part.color);
    for (let i = 0; i < p.count; i++) {
      positions.push(p.getX(i), p.getY(i), p.getZ(i));
      const ny = n.getY(i);
      normals.push(n.getX(i), ny, n.getZ(i));
      const shade = part.flat ? 1 : 0.55 + 0.45 * (ny * 0.5 + 0.5);
      colors.push(c.r * shade, c.g * shade, c.b * shade);
    }
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  out.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  out.computeBoundingSphere();
  return out;
}
