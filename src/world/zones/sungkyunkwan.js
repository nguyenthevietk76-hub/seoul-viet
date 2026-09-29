import { ZONES } from '../../data/zones.js';
import { std } from '../../lib/materials.js';
import { box, scaledGroup, toWorld, tiled } from '../../lib/scene-helpers.js';
import { TEX } from '../../lib/textures.js';
import { rnd } from '../../lib/random.js';
import { ZONE_SCALE } from '../layout.js';
import { hanok, stoneWall, lantern, lotusPond, onggi } from '../builders/hanok.js';
import { crowd } from '../builders/props.js';
import { plant } from '../trees.js';
import { stepPath, scatterPetals } from '../scatter.js';

/** Khu 2 · Học vấn: học viện Sungkyunkwan với hai sân trong, nhà gỗ, ngân hạnh và ao sen. */
export function buildSungkyunkwan() {
  const zone = ZONES[1];
  const g = scaledGroup(zone.x, zone.z, ZONE_SCALE);
  const at = (x, z) => toWorld(g, x, z);

  box(46, 0.1, 54, tiled(TEX.paving, 8, 9, '#e8e0cf'), 0, 0, -6, g).castShadow = false;

  // Tường bao hai lớp sân.
  stoneWall(g, -17, -30, 17, -30, 2.4);
  stoneWall(g, -17, -30, -17, 15, 2.4);
  stoneWall(g, 17, -30, 17, 15, 2.4);
  stoneWall(g, -17, 15, -3, 15, 2.4);
  stoneWall(g, 3, 15, 17, 15, 2.4);
  stoneWall(g, -17, -14, -3, -14, 2);
  stoneWall(g, 3, -14, 17, -14, 2);

  // Cổng, giảng đường chính, nhà ở hai bên và điện thờ phía sau.
  hanok(g, 0, 15, 5, 2.8, { plat: false, rh: 1.6 });
  hanok(g, 0, -14, 4, 2.4, { plat: false, rh: 1.4 });
  hanok(g, 0, -5, 16, 8);
  hanok(g, -11, 4, 11, 4.6, { ry: Math.PI / 2 });
  hanok(g, 11, 4, 11, 4.6, { ry: Math.PI / 2 });
  hanok(g, 0, -23, 13, 6.5, { rh: 2.2 });
  hanok(g, -11, -22, 6, 3.6, { ry: Math.PI / 2, rh: 1.6 });
  hanok(g, 11, -22, 6, 3.6, { ry: Math.PI / 2, rh: 1.6 });

  box(3, 0.14, 28, std({ map: TEX.stone }), 0, 0, 1, g).castShadow = false;
  for (const z of [6, 10]) for (const s of [-1, 1]) lantern(g, s * 2.6, z);
  lotusPond(g, -9, 10, 5, 3.6);

  for (const [x, z, s] of [[-5.5, 5, 1.6], [5.5, 5, 1.5], [0, -19, 1.4]]) { const p = at(x, z); plant('ginkgo', p.x, p.z, s); }
  for (const [x, z] of [[-13, -9], [13, -9], [-13, 12], [13, 12], [-14, -26], [14, -26]]) { const p = at(x, z); plant('sonamu', p.x, p.z, 0.95); }
  for (let k = 0; k < 7; k++) { const p = at(-6 + k * 2, -0.4); plant('bush', p.x, p.z, 0.7); }

  // Chồng sách 6 màu.
  const bookColors = ['#2f6db5', '#c8413a', '#f2c14e', '#3aa57a', '#f3efe6', '#2d2f3a'];
  for (let k = 0; k < 6; k++) box(2.3 - k * 0.08, 0.42, 1.6, bookColors[k], 7, 0.12 + k * 0.42, 9, g).rotation.y = (rnd() - 0.5) * 0.6;

  onggi(g, -7, -10, 1);
  onggi(g, -5.6, -9.2, 0.75);
  onggi(g, -8.3, -9, 0.85);
  crowd(14, 0, 6, 14, 10, g);

  for (const [x, z] of [[-14, -3], [14, -3], [-13, -24], [13, -24], [-22, 8], [22, 8], [-22, -22], [22, -22]]) { const p = at(x, z); plant('cherry', p.x, p.z, 1.05); }
  for (let k = 0; k < 10; k++) {
    const a = at(-15.5, -28 + k * 4.4), b = at(15.5, -28 + k * 4.4);
    plant('bush', a.x, a.z, 0.8);
    plant('bush', b.x, b.z, 0.8);
  }
  { const a = at(0, 15.5), b = at(0, 27); stepPath(a.x, a.z, b.x, b.z); }
  { const a = at(-20, 18), b = at(-20, -26); stepPath(a.x, a.z, b.x, b.z); }
  for (const [x, z] of [[-3, 20], [3, 20], [-20, -4], [20, -4]]) lantern(g, x, z);
  { const c = at(0, -6); scatterPetals(c.x, c.z, 40, 1100); }
}
