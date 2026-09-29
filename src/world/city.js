import * as THREE from 'three';
import { std, mat } from '../lib/materials.js';
import { instanced } from '../lib/instancing.js';
import { TEX, apartmentSideTexture, apartmentEndTexture } from '../lib/textures.js';
import { matrix, mergeColored } from '../lib/geometry.js';
import { rnd, pick } from '../lib/random.js';
import { RIVER, BRIDGE_X, FAR_BRIDGES, ROADS, inExclusion, inRiver, onRoad, inCore } from './layout.js';
import { plant } from './trees.js';
import { parkedCars } from './scatter.js';
import { hill } from './builders/props.js';
import { onFrame } from '../engine/animator.js';

const HOUSE_COLORS = ['#f2efe9', '#e8d9c4', '#d9c6ae', '#c9b8a6', '#b8715a', '#dfe4e6', '#e9dcc9'];
const CITY_HOUSE_COLORS = ['#f2efe9', '#e8d9c4', '#d9c6ae', '#c9b8a6', '#b8715a', '#a8a39a', '#dfe4e6', '#e9dcc9'];
const CAR_COLORS = ['#f4f4f2', '#f4f4f2', '#1d1f23', '#b9bdc2', '#8a9096', '#3b4d63', '#8c2f2a'];
const BLOCK = 34;

/** Nền thành phố quanh 6 khu: thấp và nhỏ hơn các khu chính để khu chính nổi bật. */
export function buildCity() {
  plantRiversideCherries();
  const houses = [], roofs = [];
  fillCore(houses);
  const blocks = buildGrid(houses, roofs);
  drawBuildings(houses, roofs, blocks);
  buildTraffic(blocks.cars);
  buildDistantMountains();
}

function plantRiversideCherries() {
  for (let x = -700; x <= 700; x += 11) {
    for (const [z, southBank] of [[RIVER.north - 3, false], [RIVER.south + 3, true]]) {
      if (southBank && Math.abs(x) < 62) continue; // chừa chỗ cho công viên sông Hàn
      if (!southBank && Math.abs(x) < 26) continue;
      if ([-BRIDGE_X, BRIDGE_X, ...FAR_BRIDGES].some((b) => Math.abs(x - b) < 11)) continue;
      plant(Math.abs(x) < 260 ? 'cherry' : 'streetCherry', x + (rnd() - 0.5) * 2, z + (rnd() - 0.5), 0.7 + rnd() * 0.25);
    }
  }
}

/** Vùng lõi: nhà thấp xếp theo ô 9 m xen cây xanh. */
function fillCore(houses) {
  for (let k = 0; k < 3200; k++) {
    const x = Math.round((rnd() * 2 - 1) * 210 / 9) * 9, z = Math.round(((rnd() * 2 - 1) * 210 + 5) / 9) * 9;
    if (!inCore(x, z) || inExclusion(x, z, 3) || inRiver(x, z, 9) || onRoad(x, z, 7)) continue;
    if (rnd() < 0.5) {
      if (!houses.some((h) => Math.hypot(h.x - x, h.z - z) < 8)) {
        houses.push({ x, z, sx: 5 + rnd() * 2, sy: 2.5 + rnd() * 4, sz: 5 + rnd() * 2, ry: 0, c: pick(HOUSE_COLORS) });
      }
    } else if (rnd() < 0.35) {
      plant(pick(['zelkova', 'sonamu', 'cherry', 'conifer', 'bush']), x, z, 0.65 + rnd() * 0.3);
    }
  }
}

/** Lưới phố bên ngoài: chung cư, nhà phố, tháp kính (nhiều hơn ở phía Gangnam) và công viên nhỏ. */
function buildGrid(houses, roofs) {
  const apartments = [[], [], []], glass = [], pads = [], tiles = [], cars = [];
  for (let gx = -16; gx <= 16; gx++) for (let gz = -16; gz <= 16; gz++) {
    const cx = gx * BLOCK, cz = gz * BLOCK + 7;
    if (Math.hypot(cx, cz) > 560) continue;
    if (Math.abs(cz - 25) < 46) continue;
    if ((cx / 225) ** 2 + ((cz - 5) / 225) ** 2 < 1) continue;
    if (inExclusion(cx, cz, 20)) continue;
    tiles.push({ x: cx, y: 0.02, z: cz });
    pads.push({ x: cx, y: 0.1, z: cz });

    const gangnamSide = cx < 0 && cz > 40, r = rnd();
    if (r < (gangnamSide ? 0.4 : 0.08)) {
      const w = 8 + rnd() * 4, h = 18 + rnd() * 16;
      glass.push({ x: cx, y: 0.2, z: cz + (rnd() - 0.5) * 6, sx: w, sy: h, sz: w * (0.8 + rnd() * 0.4), c: pick(['#ffffff', '#dde9f2', '#cfe0e6', '#e6ecef']) });
    } else if (r < 0.5) {
      const rotated = rnd() < 0.5 ? 0 : Math.PI / 2;
      for (const o of [-6.5, 6.5]) {
        const h = 0.34 + rnd() * 0.16, variant = Math.floor(rnd() * 3);
        const ox = rotated ? o : 0, oz = rotated ? 0 : o;
        apartments[variant].push({ x: cx + ox, y: 0.2, z: cz + oz, sx: 0.85, sy: h, sz: 1, ry: rotated });
        roofs.push({ x: cx + ox, y: 0.2 + 36 * h, z: cz + oz, sx: 2.4, sy: 1.6, sz: 2.4 });
      }
    } else if (r < 0.9) {
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
        if (rnd() < 0.2) continue;
        const w = 5 + rnd() * 2.5;
        houses.push({ x: cx + i * 8.6, z: cz + j * 8.6, sx: w, sy: 3 + rnd() * 6, sz: 5 + rnd() * 2.5, ry: 0, c: pick(CITY_HOUSE_COLORS) });
      }
    } else {
      for (let i = 0; i < 5; i++) plant(pick(['street', 'streetCherry']), cx + (rnd() - 0.5) * 24, cz + (rnd() - 0.5) * 24, 0.8 + rnd() * 0.3);
    }
    for (let i = 0; i < 2; i++) plant(rnd() < 0.3 ? 'streetCherry' : 'street', cx + (i % 2 ? 1 : -1) * 13, cz + (rnd() - 0.5) * 20, 0.7);
    for (let i = 0; i < 2; i++) {
      const alongX = rnd() < 0.5, offset = (rnd() < 0.5 ? -1 : 1) * (BLOCK / 2 - 1.8);
      cars.push({ x: cx + (alongX ? (rnd() - 0.5) * 26 : offset), y: 0, z: cz + (alongX ? offset : (rnd() - 0.5) * 26), ry: alongX ? Math.PI / 2 : 0, c: pick(CAR_COLORS) });
    }
  }
  return { apartments, glass, pads, tiles, cars };
}

function drawBuildings(houses, roofs, { apartments, glass, pads, tiles }) {
  const unit = new THREE.BoxGeometry(1, 1, 1);
  unit.translate(0, 0.5, 0);
  const roofMaterial = mat('#9a9790');

  const houseWall = std({ map: TEX.lowRise });
  for (const h of houses) { h.y = 0; roofs.push({ x: h.x, y: h.sy, z: h.z, sx: h.sx * 0.4, sy: 0.6, sz: h.sz * 0.4 }); }
  instanced(unit, [houseWall, houseWall, roofMaterial, roofMaterial, houseWall, houseWall], houses);

  // Chung cư kiểu Hàn: đầu hồi đánh số toà 101, 102, 103.
  const slab = new THREE.BoxGeometry(22, 36, 4.6);
  slab.translate(0, 18, 0);
  const side = std({ map: apartmentSideTexture() });
  ['101', '102', '103'].forEach((label, i) => {
    const end = std({ map: apartmentEndTexture(label, ['#7fa3c4', '#c98a6b', '#8fb07a'][i]) });
    instanced(slab, [end, end, roofMaterial, roofMaterial, side, side], apartments[i]);
  });

  const glassMaterial = std({ map: TEX.glass, roughness: 0.3, metalness: 0.1 });
  instanced(unit, [glassMaterial, glassMaterial, roofMaterial, roofMaterial, glassMaterial, glassMaterial], glass);
  instanced(unit, roofMaterial, roofs);
  instanced(new THREE.PlaneGeometry(BLOCK, BLOCK).rotateX(-Math.PI / 2), std({ map: TEX.asphaltTile }), tiles, { shadow: false });
  instanced(new THREE.BoxGeometry(BLOCK - 8, 0.2, BLOCK - 8), std({ map: TEX.paving, color: '#e3ded5' }), pads, { shadow: false });
}

/** Xe đỗ, xe trên cầu và dòng xe chạy thật trên các trục đường chính. */
function buildTraffic(cars) {
  const carGeometry = mergeColored([
    { geometry: new THREE.BoxGeometry(2, 0.75, 4.2), color: '#ffffff', matrix: matrix(0, 0.7, 0), flat: true },
    { geometry: new THREE.BoxGeometry(1.8, 0.65, 2.2), color: '#2a333d', matrix: matrix(0, 1.35, -0.2), flat: true },
    { geometry: new THREE.BoxGeometry(1.84, 0.1, 2.1), color: '#ffffff', matrix: matrix(0, 1.72, -0.2), flat: true },
    ...[[-1, -1.35], [1, -1.35], [-1, 1.35], [1, 1.35]].map(([x, z]) => ({
      geometry: new THREE.CylinderGeometry(0.42, 0.42, 0.35, 10), color: '#18191c', matrix: matrix(x, 0.42, z, 0, 0, Math.PI / 2), flat: true,
    })),
  ]);
  const carMaterial = std({ vertexColors: true, roughness: 0.45 });

  const movers = [];
  for (let k = 0; k < 30; k++) {
    movers.push({ road: ROADS[k % ROADS.length], t: rnd(), speed: (rnd() < 0.5 ? 1 : -1) * (0.03 + rnd() * 0.03), c: pick(['#f4f4f2', '#1d1f23', '#b9bdc2', '#3b4d63', '#f4f4f2']) });
  }
  for (const b of [-BRIDGE_X, BRIDGE_X, ...FAR_BRIDGES]) for (let k = 0; k < 3; k++) {
    cars.push({ x: b + (k % 2 ? 1.8 : -1.8), y: 1.2, z: RIVER.north - 5 + rnd() * 26, ry: 0, c: pick(['#f4f4f2', '#1d1f23', '#b9bdc2']) });
  }
  instanced(carGeometry, carMaterial, cars.concat(parkedCars));

  const moving = instanced(carGeometry, carMaterial, movers.map((m) => ({ x: 0, z: 0, c: m.c })), { dynamic: true });
  const dummy = new THREE.Object3D();
  const LANE = 1.9;
  onFrame((dt) => {
    movers.forEach((m, i) => {
      const [ax, az, bx, bz] = m.road, len = Math.hypot(bx - ax, bz - az);
      m.t = (m.t + m.speed * dt * 30 / len + 1) % 1;
      const heading = Math.atan2(bx - ax, bz - az), dir = m.speed > 0 ? 1 : -1;
      dummy.position.set(ax + (bx - ax) * m.t + Math.cos(heading) * LANE * dir, 0, az + (bz - az) * m.t - Math.sin(heading) * LANE * dir);
      dummy.rotation.set(0, heading + (dir < 0 ? Math.PI : 0), 0);
      dummy.updateMatrix();
      moving.setMatrixAt(i, dummy.matrix);
    });
    moving.instanceMatrix.needsUpdate = true;
  });
}

/** Vòng núi xa, xen đồi phủ anh đào hồng. */
function buildDistantMountains() {
  for (let k = 0; k < 24; k++) {
    const a = k / 24 * 6.28 + rnd() * 0.2, d = 640 + rnd() * 120;
    const colors = k % 3 === 0 ? ['#e59ab3', '#6c8a55', null] : ['#5c7f4b', '#50703f', '#8f9384'];
    hill(Math.cos(a) * d, Math.sin(a) * d, 80 + rnd() * 70, 45 + rnd() * 55, colors, k);
  }
}
