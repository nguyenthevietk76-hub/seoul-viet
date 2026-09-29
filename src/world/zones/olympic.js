import * as THREE from 'three';
import { ZONES } from '../../data/zones.js';
import { std, mat } from '../../lib/materials.js';
import { mesh, box, cyl, group, scaledGroup, toWorld, tiled } from '../../lib/scene-helpers.js';
import { TEX } from '../../lib/textures.js';
import { ZONE_SCALE, inRiver } from '../layout.js';
import { hill, surfaceY, crowd } from '../builders/props.js';
import { lantern } from '../builders/hanok.js';
import { waterMaterial } from '../water.js';
import { plant } from '../trees.js';
import { stepPath, scatterPetals } from '../scatter.js';
import { onFrame } from '../../engine/animator.js';

const OBANGSAEK = ['#2f6db5', '#c8413a', '#f2c14e', '#ffffff', '#2d2f3a'];

/** Khu 5 · Giải thưởng: Công viên Olympic với cổng Hòa bình, ngọn lửa, bục trao giải và kệ 8 cúp. */
export function buildOlympicPark() {
  const zone = ZONES[4];
  const g = scaledGroup(zone.x, zone.z, ZONE_SCALE);
  const at = (x, z) => toWorld(g, x, z);

  // Gò đất có cây đơn độc.
  const moundAt = at(-11, -9);
  const mound = hill(moundAt.x, moundAt.z, 13 * ZONE_SCALE, 4.2 * ZONE_SCALE, ['#86ad57', '#7da350', null], 9);
  mound.scale.set(1, 1, 0.55);
  mound.updateMatrixWorld();
  plant('zelkova', moundAt.x, moundAt.z, 1.9, surfaceY([mound], moundAt.x, moundAt.z) - 0.5);

  box(28, 0.12, 22, tiled(TEX.paving, 6, 5), 6, 0, 8, g).castShadow = false;

  // Cổng Hòa bình: hai chân nghiêng, xà ngang có dải 5 màu.
  for (const s of [-1, 1]) box(2, 13, 3.4, '#e6e1d6', 6 + s * 9.5, 0, -2, g).rotation.z = s * 0.16;
  box(27, 2, 4.4, '#f1ede4', 6, 12.6, -2, g);
  OBANGSAEK.forEach((c, k) => box(5, 0.4, 4, c, -4.4 + k * 5.2, 12.25, -2, g));
  cyl(1.6, 0.9, 1.6, '#8a8578', 6, 0, -2, g, 16);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(1, 2.8, 10), new THREE.MeshBasicMaterial({ color: 0xffa534, toneMapped: false }));
  flame.position.set(6, 3, -2);
  g.add(flame);
  onFrame((dt, time) => flame.scale.set(1 + Math.sin(time * 11) * 0.06, 1 + Math.sin(time * 9) * 0.14, 1));

  // Bục 1-2-3 và cúp vàng, bạc, đồng.
  [[6, 3.2, '#e0a82e'], [2.6, 2.2, '#c9ccd3'], [9.4, 1.5, '#c98a52']].forEach(([x, h, color]) => {
    box(3.3, h, 3, '#f5f2eb', x, 0.12, 6, g);
    const y = 0.12 + h, metal = mat(color, { metalness: 0.6, roughness: 0.3 });
    box(0.9, 0.45, 0.9, metal, x, y, 6, g);
    cyl(0.72, 0.28, 1.1, metal, x, y + 0.45, 6, g, 16);
    for (const s of [-1, 1]) mesh(new THREE.TorusGeometry(0.34, 0.08, 8, 14), metal, x + s * 0.78, y + 1.1, 6, g);
  });

  // Kệ đá với 8 chiếc cúp cho 8 giải thưởng.
  box(20, 1, 2.6, std({ map: TEX.stone }), 6, 0.12, 13, g);
  const gold = mat('#e0a82e', { metalness: 0.6, roughness: 0.3 });
  for (let k = 0; k < 8; k++) {
    const x = -2.4 + k * 2.4;
    box(0.6, 0.3, 0.6, gold, x, 1.12, 13, g);
    cyl(0.46, 0.2, 0.8, gold, x, 1.42, 13, g, 12);
  }

  // Vòng cờ Obangsaek.
  [...OBANGSAEK, ...OBANGSAEK].forEach((c, k) => {
    const a = Math.PI * (0.1 + k * 0.09), x = 6 + Math.cos(a) * 15, z = 8 + Math.sin(a) * 11;
    cyl(0.08, 0.1, 6, '#8a8578', x, 0, z, g, 6);
    mesh(new THREE.PlaneGeometry(1.8, 1.1), std({ color: c, side: THREE.DoubleSide }), x + 0.9, 5.3, z, g);
  });

  // Hồ nhỏ có cầu gỗ.
  const lake = group(0, 0, g);
  lake.position.set(-10, 0, 12);
  mesh(new THREE.CircleGeometry(6, 32).rotateX(-Math.PI / 2), waterMaterial(), 0, 0.08, 0, lake).castShadow = false;
  mesh(new THREE.RingGeometry(6, 6.8, 32).rotateX(-Math.PI / 2), std({ map: TEX.stone }), 0, 0.1, 0, lake).castShadow = false;
  box(1.6, 0.5, 13, '#9c7b5a', 0, 0.1, 0, lake).rotation.y = 0.5;

  crowd(40, 6, 17, 18, 6, g);
  for (const [x, z] of [[-2, 17], [14, 17], [-18, 4], [-4, -10]]) lantern(g, x, z);
  { const a = at(-24, 20), b = at(-12, 4); stepPath(a.x, a.z, b.x, b.z); }
  { const c = at(0, 4); scatterPetals(c.x, c.z, 40, 900); }
  for (let k = 0; k < 10; k++) {
    const a = k / 10 * 6.28, p = at(6 + Math.cos(a) * 22, 4 + Math.sin(a) * 18);
    if (inRiver(p.x, p.z, 6)) continue;
    plant(k % 3 ? 'cherry' : 'zelkova', p.x, p.z, 1);
  }
}
