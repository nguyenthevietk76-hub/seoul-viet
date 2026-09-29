import * as THREE from 'three';
import { rnd, pick, getSeed, setSeed } from '../lib/random.js';
import { blob, matrix, mergeColored } from '../lib/geometry.js';
import { std } from '../lib/materials.js';
import { instanced } from '../lib/instancing.js';

const trunk = (rt, rb, h, seg = 7) => new THREE.CylinderGeometry(rt, rb, h, seg);
const part = (geometry, color, x, y, z, rx, ry, rz) => ({ geometry, color, matrix: matrix(x, y, z, rx, ry, rz) });
const crown = (x, y, z, r, color, seed, squash = 1, res) => ({
  geometry: blob(r, seed, 0.5, res, res ? Math.max(4, res - 2) : 7), color, matrix: matrix(x, y, z, 0, 0, 0, 1, squash, 1),
});

/** Anh đào hồng đậm, thân uốn lượn. Mỗi hạt giống cho một dáng cây khác nhau. */
function cherryPrototype(seed) {
  const saved = getSeed();
  setSeed(seed);
  const parts = [];
  const branch = (points, radius) => parts.push({
    geometry: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((q) => new THREE.Vector3(...q))), 14, radius, 6),
    color: '#6f5244',
  });
  const lean = (rnd() - 0.5) * 1.4;
  branch([[0, -0.3, 0], [lean * 0.3, 1.4, 0.2], [lean, 2.9, -0.3], [lean * 1.3, 4.1, 0.1]], 0.36);
  for (let k = 0; k < 5; k++) {
    const a = k / 5 * 6.28 + rnd(), len = 2 + rnd() * 1.4;
    branch([[lean * 1.2, 3.8, 0], [lean + Math.cos(a) * len * 0.5, 4.5 + rnd(), Math.sin(a) * len * 0.5], [lean + Math.cos(a) * len, 5 + rnd() * 1.2, Math.sin(a) * len]], 0.13);
  }
  const pinks = ['#e8658c', '#f08aa7', '#f5a6bd', '#dc5a82', '#f7bfd0', '#ec7a9b'];
  for (let k = 0; k < 13; k++) {
    const a = rnd() * 6.28, d = 0.8 + rnd() * 2.7;
    parts.push({ geometry: blob(1.1 + rnd() * 0.9, k + seed, 0.6, 9, 7), color: pick(pinks), matrix: matrix(lean + Math.cos(a) * d, 5.3 + rnd() * 2 - d * 0.22, Math.sin(a) * d, 0, 0, 0, 1, 0.8, 1) });
  }
  setSeed(saved);
  return mergeColored(parts);
}

let prototypes = null;
function buildPrototypes() {
  prototypes = {
    cherry: cherryPrototype(3),
    cherry2: cherryPrototype(7),
    // Cây du (neutinamu): tán tròn rộng.
    zelkova: mergeColored([
      part(trunk(0.35, 0.6, 4.2), '#5b4a3c', 0, 2.1, 0), part(trunk(0.15, 0.26, 3, 6), '#5b4a3c', 1, 4.6, 0, 0, 0, -0.6), part(trunk(0.15, 0.26, 3, 6), '#5b4a3c', -0.9, 4.6, 0.3, 0.3, 0, 0.6),
      crown(0, 6.4, 0, 2.8, '#6f9a4a', 1), crown(2.2, 5.8, 0.5, 2.2, '#7ba652', 2), crown(-2.2, 5.9, -0.4, 2.3, '#648d43', 3),
      crown(0.4, 5.6, 2.2, 2.1, '#76a24f', 4), crown(-0.3, 5.7, -2.2, 2.1, '#6a9347', 5), crown(0.2, 7.9, 0.1, 2, '#86b05c', 6),
    ]),
    // Thông đỏ Hàn Quốc (sonamu): thân nghiêng, tán dẹt.
    sonamu: mergeColored([
      part(trunk(0.26, 0.38, 3.2), '#8b4d34', 0, 1.6, 0, 0, 0, 0.18), part(trunk(0.18, 0.26, 3), '#8b4d34', -0.55, 4.4, 0, 0, 0, -0.35), part(trunk(0.09, 0.15, 2.3, 5), '#8b4d34', 0.7, 5.1, 0.2, 0, 0, -1.1),
      crown(-0.9, 6.2, 0, 1.9, '#3f6a3a', 1, 0.45), crown(1.4, 5.6, 0.3, 1.5, '#4a7842', 2, 0.45), crown(-0.2, 7, -0.4, 1.4, '#456f3d', 3, 0.5), crown(0.2, 5.5, -1.2, 1.2, '#4a7842', 4, 0.45),
    ]),
    ginkgo: mergeColored([
      part(trunk(0.22, 0.34, 5), '#6a5a4a', 0, 2.5, 0),
      crown(0, 4.6, 0, 2, '#8cbc58', 1, 1.15), crown(0, 6.6, 0, 1.8, '#96c562', 2, 1.1), crown(0, 8.3, 0, 1.3, '#a2cd6c', 3, 1.1), crown(0.8, 5.4, 0.5, 1.3, '#88b654', 4),
    ]),
    conifer: mergeColored([
      part(trunk(0.2, 0.3, 2), '#5a4636', 0, 1, 0),
      part(new THREE.ConeGeometry(2.2, 4, 8), '#3d6b40', 0, 3.2, 0), part(new THREE.ConeGeometry(1.7, 3.4, 8), '#44744a', 0, 5, 0), part(new THREE.ConeGeometry(1.1, 2.6, 8), '#4c7d50', 0, 6.6, 0),
    ]),
    bush: mergeColored([crown(0, 0.7, 0, 1, '#5f8c45', 1), crown(0.9, 0.6, 0.3, 0.8, '#6a9a4c', 2), crown(-0.8, 0.6, -0.2, 0.8, '#577f40', 3)]),
    // Bản rút gọn cho cây xa (ít đa giác).
    street: mergeColored([part(trunk(0.16, 0.24, 3, 5), '#5b4a3c', 0, 1.5, 0), crown(0, 4.2, 0, 1.8, '#739f4e', 1, 1.2, 6), crown(0.3, 5.6, 0.2, 1.3, '#80ab58', 2, 1.1, 6)]),
    streetCherry: mergeColored([part(trunk(0.16, 0.24, 3, 5), '#5a4033', 0, 1.5, 0), crown(0, 4, 0, 1.9, '#ec7a9b', 1, 1, 6), crown(0.4, 5.1, 0.1, 1.3, '#f39ab3', 2, 1, 6)]),
  };
}

const plots = {};

/** Đăng ký một cây; tất cả cây cùng loại được vẽ chung một lần ở flushTrees(). */
export function plant(kind, x, z, scale = 1, y = 0, rotationY) {
  const k = kind === 'cherry' && rnd() < 0.5 ? 'cherry2' : kind;
  (plots[k] ||= []).push({ x, y, z, s: scale, ry: rotationY === undefined ? rnd() * 6.28 : rotationY });
}

export function initTrees() {
  buildPrototypes();
}

export function flushTrees() {
  const material = std({ vertexColors: true, roughness: 0.95 });
  for (const kind in plots) instanced(prototypes[kind], material, plots[kind]);
}
