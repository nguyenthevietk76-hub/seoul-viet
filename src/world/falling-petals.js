import * as THREE from 'three';
import { rnd } from '../lib/random.js';
import { getRoot } from '../lib/scene-helpers.js';
import { onFrame } from '../engine/animator.js';

const COUNT = 700;
const SPAWN_RADIUS = 110;
const SPAWN_HEIGHT = 40;

/** Cánh hoa anh đào rơi quanh chỗ camera đang nhìn. */
export function buildFallingPetals() {
  const positions = new Float32Array(COUNT * 3);
  for (let k = 0; k < COUNT; k++) {
    positions[k * 3] = (rnd() * 2 - 1) * SPAWN_RADIUS;
    positions[k * 3 + 1] = rnd() * SPAWN_HEIGHT;
    positions[k * 3 + 2] = (rnd() * 2 - 1) * SPAWN_RADIUS;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: '#f7b4c7', size: 0.5 }));
  points.frustumCulled = false;
  getRoot().add(points);

  onFrame((dt, time, { target }) => {
    for (let q = 0; q < COUNT; q++) {
      const i = q * 3;
      positions[i + 1] -= dt * (1 + (q % 5) * 0.3);
      positions[i] += Math.sin(time + q) * dt * 0.8;
      if (positions[i + 1] < 0) {
        positions[i + 1] = SPAWN_HEIGHT;
        positions[i] = target.x + (Math.random() * 2 - 1) * SPAWN_RADIUS;
        positions[i + 2] = target.z + (Math.random() * 2 - 1) * SPAWN_RADIUS;
      }
    }
    geometry.attributes.position.needsUpdate = true;
  });
}
