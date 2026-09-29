import * as THREE from 'three';
import { std, mat } from '../lib/materials.js';
import { mesh, box, cyl, repeatedTexture } from '../lib/scene-helpers.js';
import { TEX } from '../lib/textures.js';
import { HUB } from '../data/zones.js';
import { RIVER, BRIDGE_X, FAR_BRIDGES, ROADS, inExclusion, inRiver, inCore } from './layout.js';
import { plant } from './trees.js';
import { waterMaterial, animateWater } from './water.js';
import { onFrame } from '../engine/animator.js';

/** Mặt đất hai bờ, sông Hàn, đường sá, vành đai Namsan và các cây cầu. */
export function buildTerrain() {
  const grass = std({ map: TEX.grass });
  mesh(new THREE.PlaneGeometry(3000, 1500).rotateX(-Math.PI / 2), grass, 0, 0, RIVER.north - 1 - 750).castShadow = false;
  mesh(new THREE.PlaneGeometry(3000, 1500).rotateX(-Math.PI / 2), grass, 0, 0, RIVER.south + 1 + 750).castShadow = false;

  const river = mesh(new THREE.PlaneGeometry(3000, RIVER.south - RIVER.north + 4).rotateX(-Math.PI / 2), waterMaterial(), 0, -1.1, (RIVER.north + RIVER.south) / 2);
  river.castShadow = false;
  onFrame((dt) => animateWater(dt));

  // Kè sông và đường xe đạp ven sông.
  for (const [z, side] of [[RIVER.north, 1], [RIVER.south, -1]]) {
    const bank = box(3000, 1.6, 2.4, '#b9b4aa', 0, -1.4, z - side * 0.2);
    bank.rotation.x = side * 0.35;
    bank.castShadow = false;
    box(3000, 0.06, 2.2, '#a8574a', 0, 0, z - side * 5.5).castShadow = false;
    box(3000, 0.05, 0.12, '#f1efe7', 0, 0.07, z - side * 5.5).castShadow = false;
  }

  buildRoads();
  buildNamsanRing();
  bridge(-BRIDGE_X, 10);
  bridge(BRIDGE_X, 10);
  for (const x of FAR_BRIDGES) bridge(x, 14, Math.abs(x) === 380);
  buildRainbowFountain();
}

function buildRoads() {
  const sidewalk = std({ map: TEX.paving });
  for (const [ax, az, bx, bz] of ROADS) {
    const dx = bx - ax, dz = bz - az, len = Math.hypot(dx, dz), angle = -Math.atan2(dz, dx);
    const road = mesh(new THREE.PlaneGeometry(8, len).rotateX(-Math.PI / 2), std({ map: repeatedTexture(TEX.road, 1, len / 16) }), (ax + bx) / 2, 0.04, (az + bz) / 2);
    road.rotation.y = angle + Math.PI / 2;
    road.castShadow = false;
    for (const s of [-1, 1]) {
      const walk = box(len, 0.2, 2.2, sidewalk, (ax + bx) / 2 - Math.sin(angle) * s * 5.1, 0, (az + bz) / 2 - Math.cos(angle) * s * 5.1);
      walk.rotation.y = angle;
      walk.castShadow = false;
    }
    // Hàng ngân hạnh dọc đường trong vùng lõi.
    for (let k = 12; k < len - 6; k += 18) {
      const px = ax + dx * k / len, pz = az + dz * k / len;
      for (const s of [-1, 1]) {
        const x = px - Math.sin(angle) * s * 5.3, z = pz - Math.cos(angle) * s * 5.3;
        if (inExclusion(x, z, -2) || inRiver(x, z, 3) || !inCore(x, z)) continue;
        plant('ginkgo', x, z, 0.75);
      }
    }
  }
}

function buildNamsanRing() {
  mesh(new THREE.RingGeometry(30, 42, 96).rotateX(-Math.PI / 2), mat('#57595d'), HUB.x, 0.035, HUB.z).castShadow = false;
  for (const r of [29, 43]) mesh(new THREE.RingGeometry(r - 1.1, r + 1.1, 96).rotateX(-Math.PI / 2), std({ map: TEX.paving }), HUB.x, 0.12, HUB.z).castShadow = false;
  mesh(new THREE.RingGeometry(35.85, 36.15, 96).rotateX(-Math.PI / 2), mat('#e0b53a'), HUB.x, 0.06, HUB.z).castShadow = false;
}

function bridge(x, width, arched = false) {
  const len = RIVER.south - RIVER.north + 18, zc = (RIVER.north + RIVER.south) / 2;
  box(width, 0.9, len, '#c9c3b6', x, 0.25, zc);
  box(width - 1.6, 0.06, len, std({ map: repeatedTexture(TEX.road, 1, len / 16) }), x, 1.15, zc).castShadow = false;
  box(width * 0.8, 0.9, len, '#8f8a80', x, -0.6, zc);
  for (const s of [-1, 1]) box(0.3, 0.9, len, '#e6e2d8', x + s * (width / 2 - 0.15), 1.1, zc);
  for (let z = RIVER.north + 2; z < RIVER.south; z += 6) cyl(1, 1.2, 3, '#b3ad9f', x, -2.4, z, undefined, 10);
  for (let z = RIVER.north - 6; z < RIVER.south + 8; z += 8) for (const s of [-1, 1]) {
    cyl(0.08, 0.1, 4, '#5d6470', x + s * (width / 2 - 0.3), 1.2, z, undefined, 6);
    box(0.9, 0.18, 0.3, '#f5f0dc', x + s * (width / 2 - 0.7), 5.1, z);
  }
  if (arched) {
    for (const s of [-1, 1]) {
      const arch = mesh(new THREE.TorusGeometry((RIVER.south - RIVER.north) / 2 + 3, 0.35, 6, 40, Math.PI), mat('#e7e3da'), x + s * (width / 2 - 0.3), 1.1, zc);
      arch.rotation.y = Math.PI / 2;
    }
  }
}

/** Cầu vồng nước kiểu cầu Banpo, nhấp nháy nhẹ. */
function buildRainbowFountain() {
  const colors = ['#e24b4a', '#ef9f27', '#f2c14e', '#5dca8a', '#378add', '#7f77dd'];
  const arcs = [];
  for (let i = 0; i < 9; i++) for (const s of [-1, 1]) {
    const arc = mesh(
      new THREE.TorusGeometry(3.2, 0.1, 5, 24, Math.PI),
      new THREE.MeshBasicMaterial({ color: colors[(i + (s > 0 ? 3 : 0)) % 6], transparent: true, opacity: 0.55, depthWrite: false }),
      BRIDGE_X + s * 8.2, -0.9, RIVER.north + 0.5 + i * 1.9,
    );
    arc.castShadow = false;
    arc.receiveShadow = false;
    arcs.push(arc);
  }
  onFrame((dt, time) => arcs.forEach((a, i) => { a.material.opacity = 0.4 + 0.2 * Math.sin(time * 3 + i); }));
}
