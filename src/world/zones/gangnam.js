import * as THREE from 'three';
import { ZONES } from '../../data/zones.js';
import { std, mat } from '../../lib/materials.js';
import { mesh, box, cyl, group, scaledGroup, toWorld, tiled, repeatedTexture } from '../../lib/scene-helpers.js';
import { TEX } from '../../lib/textures.js';
import { rnd, pick } from '../../lib/random.js';
import { ZONE_SCALE } from '../layout.js';
import { ledBoard, artScreen, signTexture, crowd } from '../builders/props.js';
import { waterMaterial } from '../water.js';
import { plant } from '../trees.js';
import { parkedCars } from '../scatter.js';

const CAR_COLORS = ['#f4f4f2', '#f4f4f2', '#1d1f23', '#b9bdc2', '#8a9096', '#3b4d63', '#f4f4f2'];

/** Khu 3 · Kinh nghiệm: phố Gangnam với tháp kính, bảng LED đại sứ, ngã tư đại lộ đông xe. */
export function buildGangnam() {
  const zone = ZONES[2];
  const g = scaledGroup(zone.x, zone.z, ZONE_SCALE);
  const at = (x, z) => toWorld(g, x, z);

  box(48, 0.14, 48, tiled(TEX.paving, 10, 10, '#dcd8d0'), 0, 0, -2, g).castShadow = false;
  buildIntersection(g, at);
  buildTowers(g);
  buildStreetLife(g, at);
}

function buildIntersection(g, at) {
  const avenue = (x, z, w, len, rotationY = 0) => {
    const road = mesh(new THREE.PlaneGeometry(w, len).rotateX(-Math.PI / 2), std({ map: repeatedTexture(TEX.road, 3, len / 8) }), x, 0.17, z, g);
    road.rotation.y = rotationY;
    road.castShadow = false;
  };
  avenue(0, 27, 12, 72, Math.PI / 2);
  avenue(27, 0, 12, 72);
  box(12, 0.02, 12, '#55585c', 27, 0.17, 27, g).castShadow = false;

  // Vạch sang đường và làn xe buýt.
  for (const x of [17, 37]) for (let k = 0; k < 9; k++) box(2.6, 0.04, 0.6, '#f4f2ec', x, 0.19, 21.8 + k * 1.3, g).castShadow = false;
  for (const z of [17, 37]) for (let k = 0; k < 9; k++) box(0.6, 0.04, 2.6, '#f4f2ec', 21.8 + k * 1.3, 0.19, z, g).castShadow = false;
  box(72, 0.03, 0.5, '#c8413a', 0, 0.19, 24.6, g).castShadow = false;
  box(0.5, 0.03, 72, '#2f6db5', 29.4, 0.19, 0, g).castShadow = false;

  // Dòng xe trên hai đại lộ (xe dài là xe buýt).
  for (const [lane, dir] of [[22.6, 0], [24.9, 0], [29.1, Math.PI], [31.4, Math.PI]]) {
    for (let k = 0; k < 11; k++) {
      const x = -34 + k * 6.2 + rnd() * 2;
      if (Math.abs(x - 27) < 8) continue;
      const p = at(x, lane);
      parkedCars.push({ x: p.x, y: 0.3, z: p.z, ry: dir + Math.PI / 2, c: pick(CAR_COLORS), sz: k % 5 === 0 ? 2.5 : 1 });
    }
  }
  for (const [lane, dir] of [[22.6, Math.PI], [24.9, Math.PI], [29.1, 0], [31.4, 0]]) {
    for (let k = 0; k < 11; k++) {
      const z = -34 + k * 6.2 + rnd() * 2;
      if (Math.abs(z - 27) < 8) continue;
      const p = at(lane, z);
      parkedCars.push({ x: p.x, y: 0.3, z: p.z, ry: dir, c: k % 4 === 0 ? '#3aa55a' : pick(CAR_COLORS), sz: k % 4 === 0 ? 2.6 : 1 });
    }
  }
}

function buildTowers(g) {
  const glass = (color, roughness = 0.22) => std({ map: repeatedTexture(TEX.glass, 1, 1), color, roughness, metalness: 0.25 });
  const tower = (x, z, w, d, h, color) => {
    const m = glass(color);
    box(w, h, d, [m, m, mat('#6d7680'), mat('#6d7680'), m, m], x, 0.14, z, g);
    box(w + 0.4, 4, d + 0.4, '#2f3943', x, 0.14, z, g);
  };
  // Tháp bậc thang 3 khối.
  tower(-6, -13, 6, 6, 72, '#9fb6d4');
  tower(-0.6, -9.6, 6, 6, 86, '#8fa9cc');
  tower(-3.6, -16.6, 5, 5, 62, '#a8bdd8');
  box(4, 5, 4, '#6d7a8c', -0.6, 86.14, -9.6, g);
  cyl(0.12, 0.3, 9, '#c9ced4', -0.6, 91, -9.6, g, 6);
  // Tháp xanh ngọc có sống đứng.
  tower(-18, -5, 8, 8, 64, '#bfe1d7');
  box(0.5, 64, 1.2, '#e6f0ec', -14, 0.14, -1.2, g);
  // Tháp khách sạn.
  tower(13, -12, 8, 7, 52, '#8b9db4');
  box(8.6, 1.2, 7.6, '#2f3943', 13, 52.1, -12, g);
  // Tháp trụ tròn.
  const round = mesh(new THREE.CylinderGeometry(3.4, 3.6, 46, 32), glass('#b9cadb'), 12, 23.14, 9, g);
  round.material.map.repeat.set(3, 1);
  // Khối đế có màn hình và nhà triển lãm mái vòm.
  box(12, 11, 9, '#3e4650', -15, 0.14, 12, g);
  box(12.4, 0.5, 9.4, '#dfe3e6', -15, 11.1, 12, g);
  box(13, 4, 8, '#e8e5de', 2, 0.14, 15.5, g);
  mesh(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat('#f1eee8', { roughness: 0.4 }), 2, 4.1, 15.5, g).scale.set(7, 2.4, 4.8);

  // Bảng LED đại sứ (chỉ ghi chữ, không dùng logo).
  ledBoard(g, -6.8, 44, -9.84, 5, 3.4, ['Google', 'Student Ambassador', '02/2026 – nay'], '#7fb2ff');
  ledBoard(g, -18, 34, -0.84, 6.4, 4.2, ['Anessa', 'Students Ambassador', '2026'], '#f2c14e');
  ledBoard(g, 13, 40, -8.34, 6.6, 4.4, ['OPPO', 'NEXT TREND Ambassador', '2025'], '#5dca8a');
  ledBoard(g, -15, 7.4, 16.66, 7.4, 4.6, ['Đại sứ', 'Truyền thông sự kiện', '2024 – 2025'], '#e58aa8');
  artScreen(g, 13, 22, -8.4, 3.6, 10, 0, ['#ff5f8f', '#8f5bff', '#3fd2ff']);
  artScreen(g, -8.84, 6, 12, 6, 5, Math.PI / 2, ['#2af5c4', '#2f6dff', '#ff4fa3']);
  artScreen(g, 12, 33, 12.62, 4, 6, 0, ['#ffd23f', '#ff6a3d', '#c2185b']);
}

function buildStreetLife(g, at) {
  // Quảng trường tròn có đài phun nước và tượng điêu khắc.
  const stone = std({ map: TEX.stone });
  cyl(6, 6.3, 0.3, stone, -1, 0.14, 4, g, 40);
  cyl(5.2, 5.2, 0.32, '#dfe3e6', -1, 0.14, 4, g, 40);
  cyl(3.4, 3.5, 0.6, stone, -1, 0.3, 4, g, 32);
  cyl(3, 3, 0.2, waterMaterial(), -1, 0.8, 4, g, 32);
  cyl(0.3, 0.45, 2.6, '#dfe7ea', -1, 0.9, 4, g, 12);
  const sculpture = group(0, 0, g);
  sculpture.position.set(6, 0.14, 4);
  mesh(new THREE.TorusKnotGeometry(1.1, 0.35, 64, 8), mat('#d94b3b', { roughness: 0.3, metalness: 0.4 }), 0, 3, 0, sculpture);
  box(2, 1.2, 2, stone, 0, 0, 0, sculpture);

  // Cửa hàng tiện lợi 24 giờ.
  box(6, 3.2, 4.4, '#f4f1ea', -19, 0.14, 19, g);
  box(6.4, 0.5, 1.2, '#35a49f', -19, 3.1, 21.6, g);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), new THREE.MeshBasicMaterial({ map: signTexture('편의점 24', '#35a49f', '#ffffff', 38, 256, 64), toneMapped: false }));
  sign.position.set(-19, 2.4, 21.23);
  g.add(sign);

  for (const [x, z] of [[-10, 20], [6, 20], [18, 20], [18, 6], [18, -8], [-22, 4], [-22, -12]]) { const p = at(x, z); plant('street', p.x, p.z, 0.9); }
  for (let k = 0; k < 8; k++) { const p = at(-1 + Math.cos(k / 8 * 6.28) * 7.5, 4 + Math.sin(k / 8 * 6.28) * 7.5); plant('bush', p.x, p.z, 0.8); }
  crowd(90, -2, 8, 34, 22, g);
}
