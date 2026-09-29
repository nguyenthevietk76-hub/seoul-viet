import * as THREE from 'three';
import { ZONES } from '../../data/zones.js';
import { std, mat } from '../../lib/materials.js';
import { mesh, box, cyl, group, toWorld, repeatedTexture, getRoot } from '../../lib/scene-helpers.js';
import { TEX } from '../../lib/textures.js';
import { signTexture, crowd } from '../builders/props.js';
import { lantern } from '../builders/hanok.js';
import { plant } from '../trees.js';
import { stepPath, scatterPetals } from '../scatter.js';
import { onFrame } from '../../engine/animator.js';

const PARK_SCALE = 1.8;
const CANVAS_TITLE_FONT = 56;

/** Khu 6 · Xã hội: công viên ven sông Hàn rộng, bậc ngồi nhìn ra sông, đường chạy, lều tình nguyện, đảo nổi. */
export function buildHanRiverPark() {
  const zone = ZONES[5];
  const g = group(zone.x, zone.z);
  g.scale.setScalar(PARK_SCALE);
  g.updateMatrixWorld(true);
  const at = (x, z) => toWorld(g, x, z);

  // Bãi cỏ, lối gỗ ven sông có lan can và đèn.
  box(66, 0.06, 34, std({ map: repeatedTexture(TEX.grass, 14, 8), color: '#e8ffe0' }), 0, 0, 1, g).castShadow = false;
  box(66, 0.3, 3.6, '#b08a5e', 0, 0, -18.6, g);
  for (let k = 0; k <= 32; k++) box(0.12, 0.9, 0.12, '#8a6a46', -32 + k * 2, 0.3, -20.3, g);
  box(66, 0.1, 0.14, '#8a6a46', 0, 1.1, -20.3, g);
  for (let k = 0; k < 11; k++) {
    const x = -30 + k * 6;
    cyl(0.06, 0.08, 3.2, '#3a3f48', x, 0.3, -17, g, 6);
    box(0.5, 0.22, 0.5, '#fff1c2', x, 3.5, -17, g);
  }
  box(66, 0.05, 1.6, '#b35a48', 0, 0.07, -14.2, g).castShadow = false; // đường xe đạp
  box(66, 0.05, 0.08, '#f4f1ea', 0, 0.13, -14.2, g).castShadow = false;

  // Bậc ngồi kiểu khán đài nhìn ra sông.
  for (let k = 0; k < 6; k++) box(20, 0.35 * (k + 1), 1.3, k % 2 ? '#d9d2c3' : '#cfc7b6', -15, 0, -12.2 + k * 1.3, g);
  for (let k = 0; k < 6; k++) box(1.4, 0.2, 1.3, '#8fbf6a', -25.6, 0.35 * (k + 1), -12.2 + k * 1.3, g);

  // Đường chạy và cổng đích IRONRUN.
  const track = mesh(new THREE.RingGeometry(5.2, 7.6, 64).rotateX(-Math.PI / 2), mat('#c0674a'), 12, 0.08, 3, g);
  track.scale.x = 1.6;
  track.castShadow = false;
  for (const r of [5.9, 6.7]) mesh(new THREE.RingGeometry(r, r + 0.12, 64).rotateX(-Math.PI / 2), mat('#f4f1ea'), 12, 0.1, 3, g).scale.x = 1.6;
  for (const s of [-1, 1]) cyl(0.2, 0.2, 4.4, '#3a3f48', 12 + s * 3, 0, -3.4, g, 8);
  const ironrun = std({ map: signTexture('IRONRUN 2025', '#c8413a', '#ffffff', CANVAS_TITLE_FONT) });
  box(6.4, 1.2, 0.2, [mat('#c8413a'), mat('#c8413a'), mat('#c8413a'), mat('#c8413a'), ironrun, ironrun], 12, 3.6, -3.4, g);

  // Lều tình nguyện Thắp ĐUỐC và quà.
  const tent = (x, z, color) => {
    mesh(new THREE.ConeGeometry(3.3, 2.2, 4), color, x, 3.6, z, g).rotation.y = Math.PI / 4;
    for (const [a, b] of [[-2.2, -2.2], [2.2, -2.2], [-2.2, 2.2], [2.2, 2.2]]) cyl(0.07, 0.07, 2.5, '#8a8578', x + a, 0, z + b, g, 5);
  };
  tent(-22, 4, '#f7f4ec');
  tent(-22, 10.5, '#f7f4ec');
  tent(-16, 12, '#f2c14e');
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 0.85), std({ map: signTexture('Thắp ĐUỐC 2025', '#e0a82e', '#23262f', 52) }));
  banner.position.set(-22, 2.2, 12.72);
  g.add(banner);
  [['#c8413a', -25, 14], ['#f2c14e', -19.5, 14], ['#c8413a', -19.7, 15.4], ['#e58aa8', -25.5, 15.6], ['#2f6db5', -22.6, 15]].forEach(([c, x, z]) => {
    box(1, 1, 1, c, x, 0, z, g);
    box(1.05, 0.18, 1.05, '#fffaf1', x, 0.42, z, g);
  });

  // Xe tải chở quà, xe bán đồ ăn, thảm picnic, bồn hoa, cửa hàng và bãi xe đạp.
  box(2.4, 2.1, 2.4, '#f3efe6', 26, 0.3, 5, g);
  box(3.8, 2.7, 2.4, '#2f6db5', 26, 0.3, 8.1, g);
  [['#f2c14e', 6], ['#e58aa8', 11], ['#5dca8a', 16]].forEach(([c, x]) => {
    box(4.2, 2.6, 2.2, c, x, 0.4, 16, g);
    box(4.3, 0.3, 2.3, '#fffaf1', x, 3, 16, g);
    box(2.6, 0.9, 0.1, '#2a2320', x, 1.5, 17.12, g);
    for (const s of [-1.4, 1.4]) mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12), '#1f2226', x + s, 0.4, 16, g).rotation.x = Math.PI / 2;
  });
  [['#f2c14e', -6, -6], ['#5dca8a', -2, 6], ['#e58aa8', 2, -4], ['#7fb2ff', -8, 9], ['#f7f4ec', 4, 10], ['#c8413a', -10, 2]].forEach(([c, x, z]) => {
    box(3.4, 0.05, 2.6, c, x, 0.08, z, g).castShadow = false;
  });
  for (let k = 0; k < 12; k++) box(0.9, 0.35, 0.5, ['#e58aa8', '#f2c14e', '#c8413a'][k % 3], -29 + k * 0.9, 0.06, -10.6, g).castShadow = false;
  box(5, 2.6, 3.4, '#f4f1ea', 28, 0, -9, g);
  box(5.4, 0.4, 1, '#35a49f', 28, 2.5, -7.1, g);
  for (let k = 0; k < 6; k++) box(0.1, 0.8, 1.4, '#3a3f48', 20 + k * 0.9, 0, -11.5, g);
  for (const x of [-28, -4, 20]) lantern(g, x, -10.4);

  crowd(120, -2, 2, 52, 22, g);
  crowd(40, -15, -9, 20, 4, g);
  for (let k = 0; k < 11; k++) {
    const a = at(-30 + k * 6, -11.4), b = at(-30 + k * 6, 18);
    plant('cherry', a.x, a.z, 1.05);
    if (k % 2) plant('cherry', b.x, b.z, 1.1);
  }
  for (const [x, z] of [[-30, 2], [30, 0], [-30, 14], [30, 14]]) { const p = at(x, z); plant('zelkova', p.x, p.z, 1); }
  { const a = at(-8, 17), b = at(-2, -13); stepPath(a.x, a.z, b.x, b.z); }
  { const c = at(0, 0); scatterPetals(c.x, c.z, 60, 1800); }

  buildFloatingIslands();
  buildDuckBoats();
}

/** Ba đảo nổi mái vòm kính trên sông, nối bờ bằng cầu dạo. */
function buildFloatingIslands() {
  for (const [x, z, r] of [[-24, 25, 3.4], [-13, 23.4, 2.8], [-3.5, 26, 2.3]]) {
    cyl(r + 0.5, r + 0.7, 0.9, '#e9e6df', x, -1.2, z, undefined, 32);
    mesh(new THREE.SphereGeometry(r, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2), mat('#9fc3d6', { roughness: 0.12, metalness: 0.35, transparent: true, opacity: 0.85 }), x, -0.3, z).scale.y = 0.8;
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * 6.28;
      box(0.08, r * 0.8, 0.08, '#e9e6df', x + Math.cos(a) * r * 0.7, -0.3, z + Math.sin(a) * r * 0.7).rotation.z = 0.4;
    }
  }
  box(1.6, 0.3, 6, '#e9e6df', -24, -0.5, 29.5);
  box(1.4, 0.3, 4.5, '#e9e6df', -13, -0.5, 28.5);
  box(9, 0.25, 1.3, '#e9e6df', -18.5, -0.55, 24.4);
}

/** Thuyền vịt vàng trôi chậm trên sông. */
function buildDuckBoats() {
  const ducks = [];
  for (let k = 0; k < 4; k++) {
    const duck = group(-60 + k * 12, 21 + k * 2.5, getRoot(), 0.4 + k);
    duck.position.y = -1.1;
    box(2.6, 1, 3.6, '#f2c14e', 0, 0, 0, duck);
    mesh(new THREE.SphereGeometry(0.8, 12, 10), '#f2c14e', 0, 1.8, 1.3, duck);
    mesh(new THREE.ConeGeometry(0.3, 0.7, 8), '#ef8a27', 0, 1.7, 2.2, duck).rotation.x = Math.PI / 2;
    ducks.push(duck);
  }
  onFrame((dt, time) => ducks.forEach((d, i) => { d.position.x += Math.sin(time * 0.2 + i) * dt * 1.5; }));
}
