import * as THREE from 'three';
import { ZONES } from '../../data/zones.js';
import { std, mat } from '../../lib/materials.js';
import { mesh, box, cyl, scaledGroup, toWorld, tiled } from '../../lib/scene-helpers.js';
import { TEX } from '../../lib/textures.js';
import { blob } from '../../lib/geometry.js';
import { ZONE_SCALE } from '../layout.js';
import { hanok, terrace, stoneWall, lantern, roof, brackets, palaceWallMaterial } from '../builders/hanok.js';
import { crowd, hill } from '../builders/props.js';
import { plant } from '../trees.js';
import { scatterPetals } from '../scatter.js';

const OBANGSAEK = ['#2f6db5', '#c8413a', '#f2c14e', '#ffffff', '#2d2f3a'];

/** Khu 4 · Lãnh đạo: cổng Gwanghwamun, quảng trường có sân khấu và đám đông, chính điện hai tầng mái. */
export function buildGwanghwamun() {
  const zone = ZONES[3];
  const g = scaledGroup(zone.x, zone.z, ZONE_SCALE);
  const at = (x, z) => toWorld(g, x, z);

  // Quảng trường lát đá, hai kênh nước.
  box(34, 0.12, 44, tiled(TEX.stone, 9, 11), 0, 0, 22, g).castShadow = false;
  for (const s of [-1, 1]) box(1.4, 0.2, 38, '#8fb9c3', s * 14.5, 0.05, 23, g).castShadow = false;

  // Cổng đá 3 vòm và lầu hai tầng mái.
  const gateStone = tiled(TEX.stone, 4, 1.2);
  box(24, 6.5, 8, gateStone, 0, 0, 0, g);
  for (const x of [-5.5, 0, 5.5]) {
    box(2.8, 3.4, 8.2, '#3b342c', x, 0, 0, g);
    mesh(new THREE.CylinderGeometry(1.4, 1.4, 8.2, 16), '#3b342c', x, 3.4, 0, g).rotation.x = Math.PI / 2;
  }
  hanok(g, 0, 0, 15, 6, { y: 6.5, plat: false, rh: 2, palace: true });
  hanok(g, 0, 0, 10.5, 4.4, { y: 11.3, plat: false, rh: 1.8, palace: true });

  // Tường thành bao cung điện và sân trong.
  stoneWall(g, -12, 0, -40, 0, 4);
  stoneWall(g, 12, 0, 40, 0, 4);
  stoneWall(g, -40, 0, -40, -62, 4);
  stoneWall(g, 40, 0, 40, -62, 4);
  stoneWall(g, -40, -62, 40, -62, 4);
  box(78, 0.1, 60, tiled(TEX.paving, 13, 10), 0, 0, -31, g).castShadow = false;
  hanok(g, 0, -14, 10, 4, { rh: 1.8, palace: true });

  // Chính điện hai tầng mái trên hai tầng nền đá có lan can.
  terrace(g, 0, -40, 30, 20, 1.1, 4, 0);
  terrace(g, 0, -41, 24, 15, 1.1, 4, 1.1);
  hanok(g, 0, -42, 17, 8.5, { y: 2.2, plat: false, palace: true, ch: 4.2, rh: 2.4, lift: 1.3 });
  const upper = new THREE.Group();
  upper.position.set(0, 9, -42);
  g.add(upper);
  box(13, 1.9, 6, [mat('#a3392b'), mat('#a3392b'), mat('#efe7d6'), mat('#efe7d6'), palaceWallMaterial(), palaceWallMaterial()], 0, -0.1, 0, upper);
  brackets(upper, 1.8, 13.3, 6.3, '#2f6f62');
  roof(upper, 2.25, 8.6, 5.2, 4.2, 2.8, 1.4);

  // Vạc đồng hai bên sân rồng.
  for (const s of [-1, 1]) {
    const cauldron = new THREE.Group();
    cauldron.position.set(s * 10, 2.2, -33);
    g.add(cauldron);
    cyl(1, 1.15, 0.4, mat('#6e5a3e', { metalness: 0.5, roughness: 0.4 }), 0, 0, 0, cauldron, 16);
    mesh(new THREE.SphereGeometry(0.9, 16, 12, 0, 6.3, 0, 1.9), mat('#5a4a33', { metalness: 0.6, roughness: 0.35 }), 0, 1.2, 0, cauldron);
  }
  for (const [x, z] of [[-8, -24], [8, -24], [-8, 4], [8, 4]]) lantern(g, x, z);

  // Các dãy nhà hai bên sân trong.
  hanok(g, -26, -26, 14, 5, { ry: Math.PI / 2, palace: true });
  hanok(g, 26, -26, 14, 5, { ry: -Math.PI / 2, palace: true });
  hanok(g, -26, -48, 10, 5, { ry: Math.PI / 2, palace: true });
  hanok(g, 26, -48, 10, 5, { ry: -Math.PI / 2, palace: true });
  for (const [x, z] of [[-33, -12], [33, -12], [-33, -56], [33, -56], [-16, -56], [16, -56]]) { const p = at(x, z); plant('cherry', p.x, p.z, 1.1); }
  { const c = at(0, -10); scatterPetals(c.x, c.z, 70, 1600); }

  // Hàng tượng đá dẫn vào điện, tượng Haetae trước cổng.
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) box(1.2, 0.6, 1.2, std({ map: TEX.stone }), s * 4.5, 1, -30 + k * -3, g);
  for (const s of [-1, 1]) {
    box(1.6, 1.4, 2.4, gateStone, s * 14, 0, 6, g);
    mesh(blob(1, s + 3, 0.35), '#bfb6a4', s * 14, 2.1, 6, g);
  }

  // Sân khấu, micro, loa và cờ Obangsaek.
  box(12, 1.1, 6, '#b83a33', 0, 0.1, 15, g);
  cyl(0.06, 0.06, 1.8, '#22252c', 0, 1.2, 16, g, 6);
  mesh(new THREE.SphereGeometry(0.25, 10, 8), '#22252c', 0, 3.1, 16, g);
  box(1.4, 1.3, 0.8, '#6b4a36', -2.5, 1.2, 15.5, g);
  for (const s of [-1, 1]) {
    cyl(0.1, 0.1, 5, '#3a3f48', s * 6.5, 1.2, 17.8, g, 6);
    box(0.6, 0.4, 0.6, '#3a3f48', s * 6.5, 6, 17.6, g);
  }
  OBANGSAEK.forEach((c, k) => {
    const x = -13 + k * 6.5;
    cyl(0.1, 0.12, 8, '#8a8578', x, 0, 8, g, 6);
    mesh(new THREE.PlaneGeometry(2.6, 1.6), std({ color: c, side: THREE.DoubleSide }), x + 1.3, 7.1, 8, g);
  });
  for (const s of [-1, 1]) for (let k = 0; k < 6; k++) box(3, 0.5, 2, k % 2 ? '#e58aa8' : '#f2c14e', s * 10, 0.1, 22 + k * 3.4, g);

  crowd(150, 0, 26, 16, 12, g);
  crowd(20, 0, -30, 20, 10, g);
  for (let k = 0; k < 5; k++) {
    const a = at(-17, 10 + k * 7), b = at(17, 10 + k * 7);
    plant('zelkova', a.x, a.z, 0.9);
    plant('zelkova', b.x, b.z, 0.9);
  }

  // Núi đá Bugaksan phía sau cung điện, đồi anh đào bên cạnh.
  hill(100, -300, 95, 64, ['#6f7f52', '#5f7147', '#b8a996'], 5);
  hill(-40, -330, 110, 58, ['#e59ab3', '#6c8a55', null], 41);
}
