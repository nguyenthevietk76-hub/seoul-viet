import * as THREE from 'three';
import { mat, std } from '../../lib/materials.js';
import { mesh, box, cyl, repeatedTexture } from '../../lib/scene-helpers.js';
import { instanced } from '../../lib/instancing.js';
import { TEX } from '../../lib/textures.js';
import { rnd } from '../../lib/random.js';
import { waterMaterial } from '../water.js';

let M = null;
/** Vật liệu kiến trúc truyền thống, tạo một lần khi cần. */
function materials() {
  if (!M) {
    M = {
      tile: std({ map: TEX.roofTile, roughness: 0.55, metalness: 0.05 }),
      underEave: std({ map: TEX.dancheong, side: THREE.BackSide, roughness: 0.9 }),
      dancheong: std({ map: TEX.dancheong }),
      white: mat('#f3efe6', { roughness: 0.5 }),
      houseWall: std({ map: TEX.houseWall }),
      door: std({ map: TEX.door }),
      palaceWall: std({ map: TEX.palaceWall }),
      stone: std({ map: TEX.stone }),
      tileEnd: new THREE.CylinderGeometry(0.19, 0.19, 0.16, 10),
      unitBox: new THREE.BoxGeometry(1, 1, 1),
    };
  }
  return M;
}

export const roofTileMaterial = () => materials().tile;
export const dancheongMaterial = () => materials().dancheong;
export const palaceWallMaterial = () => materials().palaceWall;

/**
 * Mái ngói cong kiểu Hàn: 4 mái dốc lõm, góc mái vểnh lên (lift), hàng đầu ngói tròn trắng,
 * sống mái viền trắng. A/B: nửa dài/rộng ở mép mái, a: nửa dài sống mái, H: chiều cao mái.
 */
export function roof(parent, y0, A, B, a, H, lift) {
  const m = materials();
  const g = new THREE.Group();
  g.position.y = y0;
  parent.add(g);
  const nu = 20, nv = 8;

  const point = (side, u, v) => {
    const L = Math.abs(u) ** 3 * (1 - v) ** 2 * lift;
    let x, z;
    const y = H * Math.pow(v, 1.6) + L;
    if (side % 2 === 0) { x = u * (A * (1 - v) + a * v) + Math.sign(u) * L * 0.5; z = B * (1 - v) + L * 0.5; }
    else { x = A * (1 - v) + a * v + L * 0.5; z = u * B * (1 - v) + Math.sign(u) * L * 0.5; }
    if (side >= 2) { x = -x; z = -z; }
    return [x, y, z];
  };

  const tileEnds = [];
  for (let side = 0; side < 4; side++) {
    const pos = [], uv = [], idx = [];
    for (let j = 0; j <= nv; j++) {
      const v = j / nv;
      for (let i = 0; i <= nu; i++) {
        const u = i / nu * 2 - 1;
        pos.push(...point(side, u, v));
        uv.push(u * (side % 2 ? B : A) * 0.5, v * 3);
      }
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const q = j * (nu + 1) + i, r = q + 1, s = q + nu + 1, t = s + 1;
      if (side % 2) idx.push(q, s, r, r, s, t); else idx.push(q, r, s, r, t, s);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    mesh(geo, m.tile, 0, 0, 0, g);
    mesh(geo, m.underEave, 0, -0.28, 0, g).castShadow = false;

    const n = Math.max(2, Math.round((side % 2 ? B : A) * 2 / 0.62));
    for (let k = 0; k <= n; k++) {
      const [x, y, z] = point(side, (k / n * 2 - 1) * 0.985, 0);
      tileEnds.push(side % 2 === 0 ? { x, y: y - 0.02, z, rx: Math.PI / 2 } : { x, y: y - 0.02, z, rz: Math.PI / 2 });
    }
    if (side % 2 === 0) {
      for (const sign of [-1, 1]) {
        const pts = [];
        for (let j = 0; j <= 10; j++) { const [x, y, z] = point(side, sign, j / 10); pts.push(new THREE.Vector3(x, y + 0.16, z)); }
        mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.18, 6), '#e9e4da', 0, 0, 0, g);
      }
    }
  }
  box(2 * a + 0.8, 0.6, 0.8, '#353c5c', 0, H - 0.05, 0, g);
  box(2 * a + 0.9, 0.12, 0.85, m.white, 0, H + 0.52, 0, g);
  for (const s of [-1, 1]) box(0.6, 1.2, 0.8, '#353c5c', s * (a + 0.45), H, 0, g).rotation.z = -s * 0.3;
  instanced(m.tileEnd, m.white, tileEnds, { parent: g });
  return g;
}

/** Hàng đấu củng xanh-đỏ-vàng dưới mái. */
export function brackets(parent, y, W, D, color) {
  const m = materials();
  const blocks = [];
  for (const [len, alongZ] of [[W, 0], [D, 1]]) for (const s of [-1, 1]) {
    const n = Math.max(2, Math.round(len / 1.1));
    for (let k = 0; k <= n; k++) {
      const t = -len / 2 + k * len / n, x = alongZ ? s * W / 2 : t, z = alongZ ? t : s * D / 2;
      blocks.push({ x: x + (alongZ ? s * 0.2 : 0), y: y + 0.22, z: z + (alongZ ? 0 : s * 0.2), sx: 0.55, sy: 0.45, sz: 0.55, c: k % 2 ? color : '#b3362b' });
      blocks.push({ x: x + (alongZ ? s * 0.5 : 0), y: y + 0.62, z: z + (alongZ ? 0 : s * 0.5), sx: alongZ ? 0.9 : 0.35, sy: 0.35, sz: alongZ ? 0.35 : 0.9, c: '#c9962f' });
    }
  }
  instanced(m.unitBox, mat('#ffffff'), blocks, { parent });
  box(W + 0.4, 0.5, D + 0.4, m.dancheong, 0, y - 0.5, 0, parent).castShadow = false;
}

/**
 * Một gian nhà truyền thống.
 * options: y, ry, plat (có nền đá), palace (kiểu cung điện: cột đỏ, cửa xanh), ch (chiều cao cột), rh (chiều cao mái), lift.
 */
export function hanok(parent, x, z, w, d, options = {}) {
  const m = materials();
  const g = new THREE.Group();
  g.position.set(x, options.y || 0, z);
  g.rotation.y = options.ry || 0;
  parent.add(g);

  const house = !options.palace;
  const hasPlatform = options.plat !== false;
  let y = 0;
  if (hasPlatform) {
    box(w + 2.6, 0.9, d + 2.6, m.stone, 0, 0, 0, g);
    y = 0.9;
    for (let k = 0; k < 2; k++) box(3.2 - k * 0.4, 0.45, 0.8, m.stone, 0, k * 0.45, d / 2 + 1.3 + 0.4 - k * 0.4 + 0.4, g);
  }
  const colH = options.ch || 3;
  const wall = house ? m.houseWall : m.palaceWall, front = house ? m.door : m.palaceWall;
  box(w, colH - 0.2, d - 0.5, [wall, wall, mat('#efe7d6'), mat('#efe7d6'), front, front], 0, y, 0, g);

  const columnColor = house ? '#c98a4e' : '#a3392b';
  const n = Math.max(2, Math.round(w / 2.4) + 1);
  for (let k = 0; k < n; k++) {
    const cx = -w / 2 + k * w / (n - 1);
    for (const s of [-1, 1]) {
      cyl(0.22, 0.25, colH, columnColor, cx, y, s * (d / 2 - 0.05), g, 10);
      cyl(0.34, 0.38, 0.22, '#bdb4a2', cx, y, s * (d / 2 - 0.05), g, 10);
    }
  }
  box(w + 0.6, 0.4, d + 0.2, house ? '#b27a44' : '#a3392b', 0, y + colH - 0.35, 0, g);
  brackets(g, y + colH + 0.05, w + 0.4, d + 0.2, house ? '#b27a44' : '#2f6f62');
  roof(g, y + colH + 0.5, w / 2 + 1.9, d / 2 + 1.9, Math.max(0.6, w / 2 - d / 2 + 0.8), options.rh || 2.4, options.lift || (w > 9 ? 1.2 : 0.9));

  // Nhà dân: hiên gỗ maru và mành tre vàng cuộn dưới mái.
  if (house && hasPlatform) {
    box(w * 0.8, 0.25, 1.3, '#b98a55', 0, y, d / 2 + 0.35, g);
    const blindWidth = Math.min(3.2, w * 0.35);
    mesh(new THREE.CylinderGeometry(0.2, 0.2, blindWidth, 10), '#e4b85a', 0, y + colH - 0.55, d / 2 + 0.35, g).rotation.z = Math.PI / 2;
    box(blindWidth, 1, 0.06, mat('#e8c472'), 0, y + colH - 1.6, d / 2 + 0.37, g);
  }
  return g;
}

/** Nền đá nhiều bậc có lan can trắng và bậc thềm ở giữa (kiểu chính điện). */
export function terrace(parent, x, z, w, d, h, steps, y0 = 0) {
  const g = new THREE.Group();
  g.position.set(x, y0, z);
  parent.add(g);
  box(w, h, d, std({ map: repeatedTexture(TEX.stone, w / 8, h / 2) }), 0, 0, 0, g);
  box(w + 0.3, 0.2, d + 0.3, '#e3dccd', 0, h, 0, g);
  for (let k = 0; k < steps; k++) box(6 - k * 0.1, h / steps, (steps - k) * 0.6, k % 2 ? '#d9d1c1' : '#e0d9c9', 0, k * h / steps, d / 2 + (steps - k) * 0.3, g);

  const rail = mat('#ece6da');
  const railing = (x1, z1, x2, z2) => {
    const len = Math.hypot(x2 - x1, z2 - z1), angle = -Math.atan2(z2 - z1, x2 - x1);
    box(len, 0.12, 0.18, rail, (x1 + x2) / 2, h + 0.7, (z1 + z2) / 2, g).rotation.y = angle;
    const n = Math.max(1, Math.round(len / 1.6));
    for (let k = 0; k <= n; k++) { const q = k / n; box(0.24, 0.85, 0.24, rail, x1 + (x2 - x1) * q, h + 0.05, z1 + (z2 - z1) * q, g); }
  };
  railing(-w / 2 + 0.3, d / 2 - 0.3, -3.4, d / 2 - 0.3);
  railing(3.4, d / 2 - 0.3, w / 2 - 0.3, d / 2 - 0.3);
  railing(-w / 2 + 0.3, d / 2 - 0.3, -w / 2 + 0.3, -d / 2 + 0.3);
  railing(w / 2 - 0.3, d / 2 - 0.3, w / 2 - 0.3, -d / 2 + 0.3);
  return g;
}

/** Tường đá hộc lợp ngói, có hàng đầu ngói trắng. */
export function stoneWall(parent, x1, z1, x2, z2, h) {
  const m = materials();
  const len = Math.hypot(x2 - x1, z2 - z1), angle = -Math.atan2(z2 - z1, x2 - x1);
  const g = new THREE.Group();
  g.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
  g.rotation.y = angle;
  parent.add(g);
  box(len, h, 1, std({ map: repeatedTexture(TEX.rubble, len / 6, h / 4) }), 0, 0, 0, g);
  box(len + 0.4, 0.3, 2, '#3d4670', 0, h, 0, g);
  box(len + 0.4, 0.28, 0.5, '#353c5c', 0, h + 0.3, 0, g);
  const n = Math.max(1, Math.round(len / 0.62)), ends = [];
  for (let k = 0; k <= n; k++) for (const s of [-1, 1]) ends.push({ x: -len / 2 + k * len / n, y: h + 0.1, z: s, rx: Math.PI / 2, s: 0.8 });
  instanced(m.tileEnd, m.white, ends, { parent: g });
}

export function lantern(parent, x, z) {
  const stone = mat('#cfc7b6');
  box(1, 0.3, 1, stone, x, 0, z, parent);
  box(0.36, 1.2, 0.36, stone, x, 0.3, z, parent);
  box(0.9, 0.75, 0.9, stone, x, 1.5, z, parent);
  box(0.42, 0.34, 0.92, mat('#3a3530'), x, 1.72, z, parent);
  mesh(new THREE.ConeGeometry(0.9, 0.65, 4), stone, x, 2.55, z, parent).rotation.y = Math.PI / 4;
}

/** Chum kimchi (onggi). */
export function onggi(parent, x, z, scale) {
  const profile = [[0, 0], [0.7, 0], [1, 0.4], [1.15, 1], [1, 1.6], [0.6, 1.9], [0.66, 2.1], [0, 2.1]].map(([a, b]) => new THREE.Vector2(a * scale, b * scale));
  mesh(new THREE.LatheGeometry(profile, 16), mat('#5a3122', { roughness: 0.35 }), x, 0, z, parent);
}

export function lotusPond(parent, x, z, w, d) {
  box(w + 0.8, 0.25, d + 0.8, materials().stone, x, 0, z, parent);
  box(w, 0.28, d, waterMaterial(), x, 0, z, parent).castShadow = false;
  for (let k = 0; k < Math.round(w * d / 3); k++) {
    const pad = mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, 10), '#5f8f45', x + (rnd() - 0.5) * (w - 1), 0.3, z + (rnd() - 0.5) * (d - 1), parent);
    if (rnd() < 0.35) mesh(new THREE.ConeGeometry(0.2, 0.35, 6), '#f1a3be', pad.position.x, 0.45, pad.position.z, parent);
  }
}
