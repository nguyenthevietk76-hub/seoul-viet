import * as THREE from 'three';
import { rnd, pick } from '../lib/random.js';
import { mat } from '../lib/materials.js';
import { instanced } from '../lib/instancing.js';

/** Đá bước và cánh hoa rơi trên đất: gom lại rồi vẽ một lần. */
const stones = [];
const petals = [];
/** Xe đỗ và xe trên đại lộ (vẽ chung với xe của lưới phố). */
export const parkedCars = [];

export function stepPath(ax, az, bx, bz) {
  const len = Math.hypot(bx - ax, bz - az), n = Math.round(len / 2.3);
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    stones.push({
      x: ax + (bx - ax) * t + Math.sin(t * 6) * 0.8, y: 0.06, z: az + (bz - az) * t,
      ry: rnd() * 3, sx: 1.1 + rnd() * 0.4, sy: 1, sz: 0.8 + rnd() * 0.3,
      c: pick(['#cfcac0', '#c2bdb2', '#d7d2c8']),
    });
  }
}

export function scatterPetals(cx, cz, radius, count) {
  for (let k = 0; k < count; k++) {
    const a = rnd() * 6.28, d = Math.sqrt(rnd()) * radius;
    petals.push({ x: cx + Math.cos(a) * d, y: 0.22, z: cz + Math.sin(a) * d, ry: rnd() * 6, s: 0.7 + rnd() * 0.8, c: pick(['#f19bb4', '#f7bccb', '#e9759a', '#fbd3de']) });
  }
}

export function flushScatter() {
  instanced(new THREE.CylinderGeometry(1, 1.05, 0.18, 9), mat('#ffffff', { roughness: 0.95 }), stones);
  instanced(new THREE.PlaneGeometry(0.26, 0.17).rotateX(-Math.PI / 2), mat('#ffffff', { side: THREE.DoubleSide }), petals, { shadow: false });
}
