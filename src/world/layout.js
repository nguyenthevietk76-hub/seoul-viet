import { ZONES, HUB } from '../data/zones.js';

/** Các khu chính được phóng to 1,6 lần so với nền thành phố. */
export const ZONE_SCALE = 1.6;

/** Sông Hàn chạy ngang bản đồ, từ z = 17 đến z = 33. */
export const RIVER = { north: 17, south: 33 };
export const BRIDGE_X = 40;
export const FAR_BRIDGES = [-230, 230, -380, 380, -540, 540];

/** Vùng không đặt nhà phố/cây ngẫu nhiên: khuôn viên các khu, cung điện và núi Bugaksan. */
export const EXCLUSIONS = [
  ...ZONES.map((z) => ({ x: z.x, z: z.z, r: z.r })),
  { x: 100, z: -165, r: 52 },
  { x: 100, z: -300, r: 100 },
];

/** Các đoạn đường chính: [ax, az, bx, bz]. */
export const ROADS = [];
function link(a, b, trimA, trimB) {
  const dx = b.x - a.x, dz = b.z - a.z, len = Math.hypot(dx, dz), ux = dx / len, uz = dz / len;
  ROADS.push([a.x + ux * trimA, a.z + uz * trimA, b.x - ux * trimB, b.z - uz * trimB]);
}
link(HUB, ZONES[1], 36, 32);
link(HUB, ZONES[3], 36, 32);
link(HUB, { x: -BRIDGE_X, z: RIVER.north - 9 }, 36, 0);
link(HUB, { x: BRIDGE_X, z: RIVER.north - 9 }, 36, 0);
link({ x: -BRIDGE_X, z: RIVER.south + 9 }, ZONES[2], 0, 30);
link({ x: BRIDGE_X, z: RIVER.south + 9 }, ZONES[4], 0, 30);
ROADS.push(
  [0, -82, 0, -520],
  [-138, -100, -560, -100], [138, -104, 560, -104],
  [-140, 112, -560, 112], [140, 112, 560, 112],
  [-105, 148, -105, 560], [105, 150, 105, 560],
);

export function segmentDistance(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz)));
  return Math.hypot(px - ax - dx * t, pz - az - dz * t);
}

/** Điểm có nằm trên đường (kể cả vành đai quanh Namsan) không. */
export function onRoad(x, z, margin = 6) {
  for (const r of ROADS) if (segmentDistance(x, z, ...r) < margin) return true;
  const d = Math.hypot(x - HUB.x, z - HUB.z);
  return d > 27 && d < 45;
}

export function inExclusion(x, z, margin = 0) {
  for (const e of EXCLUSIONS) if (Math.hypot(x - e.x, z - e.z) < e.r + margin) return true;
  return false;
}

export const inRiver = (x, z, margin = 0) => z > RIVER.north - margin && z < RIVER.south + margin;

/** Vùng lõi quanh 6 khu (nhà thấp, cây); ngoài vùng này là lưới phố. */
export const inCore = (x, z) => (x / 205) ** 2 + ((z - 5) / 205) ** 2 < 1;
