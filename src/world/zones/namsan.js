import * as THREE from 'three';
import { HUB } from '../../data/zones.js';
import { std } from '../../lib/materials.js';
import { mesh, box, cyl, group, scaledGroup, toWorld, tiled, getRoot } from '../../lib/scene-helpers.js';
import { canvasTexture, TEX } from '../../lib/textures.js';
import { rnd } from '../../lib/random.js';
import { ZONE_SCALE } from '../layout.js';
import { hill, surfaceY } from '../builders/props.js';
import { lantern, onggi, roofTileMaterial, dancheongMaterial } from '../builders/hanok.js';
import { plant } from '../trees.js';
import { scatterPetals } from '../scatter.js';
import { onFrame } from '../../engine/animator.js';

/** Khu 1 · Giới thiệu: tháp N Seoul trên đồi Namsan, đình bát giác, cáp treo, đường dạo ven sông. */
export function buildNamsan() {
  const hillMesh = hill(HUB.x, HUB.z, 27, 21, ['#5f8a45', '#557d3e', null], 2);
  const top = surfaceY([hillMesh], HUB.x, HUB.z) - 0.3;
  const g = scaledGroup(HUB.x, HUB.z, ZONE_SCALE);
  g.position.y = top;
  g.updateMatrixWorld(true);

  buildTower(g);

  // Rừng anh đào, du và thông phủ đồi.
  for (let k = 0; k < 140; k++) {
    const a = rnd() * 6.28, d = 18 + Math.sqrt(rnd()) * 10;
    const x = HUB.x + Math.cos(a) * d, z = HUB.z + Math.sin(a) * d;
    if (Math.abs(a - 0.35) < 0.2) continue; // chừa lối lên đình
    plant(rnd() < 0.4 ? 'cherry' : rnd() < 0.55 ? 'zelkova' : 'sonamu', x, z, 0.8 + rnd() * 0.35, surfaceY([hillMesh], x, z) - 0.3);
  }

  buildPavilion(g, hillMesh);
  buildCableCar(top);
  buildRiverPromenade();
}

function buildTower(g) {
  const glassBand = canvasTexture(256, 64, (c, w, h) => {
    c.fillStyle = '#4d6878'; c.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 16) { c.fillStyle = 'rgba(215,232,240,.4)'; c.fillRect(x, 0, 2, h); }
    c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(0, 8, w, 5);
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(0, h - 10, w, 10);
  }, 8, 1);
  const glass = std({ map: glassBand, roughness: 0.22, metalness: 0.25 });
  const white = '#f3efe7';

  // Quảng trường đỉnh đồi và toà nhà chân tháp 3 tầng kính.
  cyl(10, 10.6, 0.6, tiled(TEX.paving, 5, 5), 0, -0.5, 0, g, 48);
  cyl(7.3, 7.5, 0.5, white, 0, 0, 0, g, 48); cyl(7.05, 7.05, 2.3, glass, 0, 0.5, 0, g, 48); cyl(7.5, 7.5, 0.4, white, 0, 2.8, 0, g, 48);
  cyl(6, 6, 2.1, glass, 0, 3.2, 0, g, 44); cyl(6.35, 6.35, 0.4, white, 0, 5.3, 0, g, 44);
  cyl(4.6, 4.6, 1.9, glass, 0, 5.7, 0, g, 40); cyl(4.95, 4.95, 0.35, white, 0, 7.6, 0, g, 40);

  // Thân tháp và vòng giữa thân.
  cyl(1.35, 1.8, 30, white, 0, 7.9, 0, g, 28);
  cyl(3, 3, 0.35, white, 0, 16.5, 0, g, 32); cyl(2.4, 2.4, 1, '#dcd7ce', 0, 16.85, 0, g, 28); cyl(3.1, 3.1, 0.25, white, 0, 17.85, 0, g, 32);

  // Đài quan sát nhiều tầng.
  const D = 37.9;
  cyl(3.3, 1.9, 1.4, white, 0, D - 1.4, 0, g, 36);
  cyl(3.65, 3.65, 0.5, white, 0, D, 0, g, 40); cyl(3.6, 3.6, 2.7, glass, 0, D + 0.5, 0, g, 40); cyl(3.9, 3.9, 0.45, white, 0, D + 3.2, 0, g, 40);
  cyl(3.35, 3.35, 2.1, glass, 0, D + 3.65, 0, g, 40); cyl(3.55, 3.55, 0.4, white, 0, D + 5.75, 0, g, 40); cyl(2.6, 3.25, 1, white, 0, D + 6.15, 0, g, 36);

  // Cột ăng-ten giàn đỏ trắng, đèn đỏ trên đỉnh.
  const A0 = D + 7.15;
  for (let k = 0; k < 6; k++) { const r = 0.78 - k * 0.08; cyl(r - 0.07, r, 1.7, k % 2 ? white : '#d6402f', 0, A0 + k * 1.7, 0, g, 10); }
  for (let k = 0; k < 5; k++) for (let j = 0; j < 4; j++) {
    const a = j * Math.PI / 2 + k * 0.5, r = 0.84 - k * 0.08;
    box(0.07, 1.7, 0.07, '#b8342a', Math.cos(a) * r, A0 + k * 1.7, Math.sin(a) * r, g).rotation.z = 0.22;
  }
  cyl(0.07, 0.18, 5, '#e8e4dc', 0, A0 + 10.2, 0, g, 6);
  mesh(new THREE.SphereGeometry(0.26, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff4a3a }), 0, A0 + 15.3, 0, g);

  // Hàng rào khóa tình yêu.
  const lockColors = ['#e24b4a', '#f2c14e', '#378add', '#e58aa8', '#5dca8a', '#ffffff'];
  for (let k = 0; k < 44; k++) {
    const a = k / 44 * 6.28, x = Math.cos(a) * 9.6, z = Math.sin(a) * 9.6;
    cyl(0.06, 0.06, 1.1, '#5c6068', x, 0, z, g, 5);
    for (let j = 0; j < 4; j++) {
      box(0.24, 0.28, 0.1, lockColors[(k + j) % 6], x + Math.cos(a + 1.57) * (j - 1.5) * 0.26, 0.45 + (j % 2) * 0.28, z + Math.sin(a + 1.57) * (j - 1.5) * 0.26, g);
    }
  }
}

/** Đình bát giác Palgakjeong lợp ngói. */
function buildPavilion(towerGroup, hillMesh) {
  const at = toWorld(towerGroup, 13, 5);
  const p = new THREE.Group();
  p.position.set(at.x, surfaceY([hillMesh], at.x, at.z) - 0.2, at.z);
  p.scale.setScalar(ZONE_SCALE);
  getRoot().add(p);
  cyl(3, 3.2, 0.6, std({ map: TEX.stone }), 0, 0, 0, p, 8);
  for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28; cyl(0.14, 0.14, 2.4, '#7b3a2a', Math.cos(a) * 2.4, 0.6, Math.sin(a) * 2.4, p, 8); }
  mesh(new THREE.ConeGeometry(3.8, 1.6, 8), roofTileMaterial(), 0, 3.7, 0, p);
  cyl(0.1, 0.25, 0.8, '#2a2e35', 0, 4.4, 0, p, 8);
  cyl(2.9, 2.9, 0.3, dancheongMaterial(), 0, 2.9, 0, p, 8);
}

/** Cáp treo Namsan: cabin đỏ chạy qua lại giữa hai ga. */
function buildCableCar(top) {
  const start = new THREE.Vector3(-58, 12, -6);
  const end = new THREE.Vector3(HUB.x - 19, top - 5, HUB.z + 12);
  const span = new THREE.Vector3().subVectors(end, start), length = span.length();
  for (const offset of [-0.8, 0.8]) {
    const cable = mesh(new THREE.CylinderGeometry(0.05, 0.05, length, 4), '#3a3f48', (start.x + end.x) / 2, (start.y + end.y) / 2, (start.z + end.z) / 2 + offset);
    cable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), span.clone().normalize());
    cable.castShadow = false;
  }
  box(8, 11, 6, '#e5e1d8', start.x, 0, start.z);
  box(8.6, 0.6, 6.6, '#4a5563', start.x, 11, start.z);
  box(5, 4, 5, '#e5e1d8', end.x, end.y - 4, end.z);

  const cabin = group();
  cabin.position.copy(start);
  box(2.2, 1.8, 2.6, '#d94b3b', 0, -2.4, 0, cabin);
  box(2.24, 0.8, 2.2, std({ color: '#2a333d', roughness: 0.2 }), 0, -1.6, 0, cabin);
  cyl(0.05, 0.05, 1.2, '#3a3f48', 0, -0.8, 0, cabin, 4);
  onFrame((dt, time) => cabin.position.lerpVectors(start, end, (Math.sin(time * 0.12) + 1) / 2));
}

/** Đường dạo lát đá ven sông, chum kimchi, đèn và chiếc xe đỏ. */
function buildRiverPromenade() {
  box(220, 0.1, 11, tiled(TEX.paving, 40, 2), 0, 0, 11.5).castShadow = false;
  scatterPetals(HUB.x, HUB.z, 34, 1400);
  for (const x of [-36, -29, 29, 36]) lantern(getRoot(), x, 14.2);
  for (const x of [-27, -25.4, 25.4, 27]) onggi(getRoot(), x, 13.6, 0.8 + rnd() * 0.3);
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
    cyl(0.1, 0.12, 4, '#4a4f5c', s * (30 + k * 16), 0, 7.2, undefined, 6);
    box(0.7, 0.3, 0.7, '#fff1c2', s * (30 + k * 16), 4, 7.2);
  }

  const car = group(44, 12.4, getRoot(), -Math.PI / 2);
  box(2.2, 0.75, 4, '#d23f2f', 0, 0.45, 0, car);
  box(1.9, 0.7, 2.1, std({ color: '#27313b', roughness: 0.2 }), 0, 1.2, -0.25, car);
  box(1.95, 0.12, 2.15, '#d23f2f', 0, 1.9, -0.25, car);
  for (const sx of [-1.1, 1.1]) for (const sz of [-1.35, 1.35]) mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.4, 14), '#1f2226', sx, 0.46, sz, car).rotation.z = Math.PI / 2;
  for (const sx of [-0.7, 0.7]) {
    box(0.45, 0.2, 0.08, new THREE.MeshBasicMaterial({ color: 0xfff4c2 }), sx, 0.8, 2.02, car);
    box(0.45, 0.2, 0.08, new THREE.MeshBasicMaterial({ color: 0xff5a4a }), sx, 0.8, -2.02, car);
  }
}
