import * as THREE from 'three';
import { std, mat } from '../../lib/materials.js';
import { mesh, box, getRoot } from '../../lib/scene-helpers.js';
import { instanced } from '../../lib/instancing.js';
import { canvasTexture, CANVAS_FONT } from '../../lib/textures.js';
import { rnd, pick } from '../../lib/random.js';
import { valueNoise } from '../../lib/noise.js';
import { ZONE_SCALE } from '../layout.js';

/** Bảng LED có chữ (tên thương hiệu, vai trò, thời gian). */
export function ledBoard(parent, x, y, z, w, h, [title, subtitle, date], accent, rotationY = 0) {
  const texture = canvasTexture(512, Math.round(512 * h / w), (g, W, H) => {
    g.fillStyle = '#161923'; g.fillRect(0, 0, W, H);
    g.fillStyle = accent; g.fillRect(0, 0, W, 8);
    g.textAlign = 'center';
    g.font = `700 ${Math.round(H * 0.3)}px ${CANVAS_FONT}`; g.fillText(title, W / 2, H * 0.44);
    g.fillStyle = '#f3efe6'; g.font = `500 ${Math.round(H * 0.13)}px ${CANVAS_FONT}`; g.fillText(subtitle, W / 2, H * 0.66);
    g.fillStyle = '#b8b3c2'; g.fillText(date, W / 2, H * 0.86);
  });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
  panel.position.set(x, y, z);
  panel.rotation.y = rotationY;
  parent.add(panel);
  box(w + 0.4, h + 0.4, 0.3, '#22252c', x, y - h / 2 - 0.2, z - 0.2, parent);
  return panel;
}

/** Màn hình quảng cáo trừu tượng (dải màu). */
export function artScreen(parent, x, y, z, w, h, rotationY, colors) {
  const texture = canvasTexture(256, Math.round(256 * h / w), (g, W, H) => {
    const gr = g.createLinearGradient(0, 0, W, H);
    colors.forEach((c, i) => gr.addColorStop(i / (colors.length - 1), c));
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(255,255,255,${0.08 + rnd() * 0.15})`; g.beginPath(); g.arc(rnd() * W, rnd() * H, 20 + rnd() * 60, 0, 7); g.fill(); }
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
  m.position.set(x, y, z);
  m.rotation.y = rotationY || 0;
  parent.add(m);
}

/** Biển chữ in trên nền màu (banner, bảng hiệu). */
export function signTexture(text, background, color, fontSize, width = 512, height = 96) {
  return canvasTexture(width, height, (g, w, h) => {
    g.fillStyle = background; g.fillRect(0, 0, w, h);
    g.fillStyle = color; g.textAlign = 'center';
    g.font = `700 ${fontSize}px ${CANVAS_FONT}`;
    g.fillText(text, w / 2, h / 2 + fontSize * 0.36);
  });
}

const BODY_COLORS = ['#2f6db5', '#c8413a', '#f2c14e', '#3aa57a', '#2d2f3a', '#e58aa8', '#f7f4ec', '#8c6e5a'];
const SKIN = ['#f1d2b6', '#e8c3a0', '#d9ab87'];

/** Đám đông người tí hon (giữ kích thước thật dù nằm trong khu được phóng to). */
export function crowd(count, cx, cz, width, depth, parent) {
  const scale = 1 / ZONE_SCALE, bodies = [], heads = [];
  for (let k = 0; k < count; k++) {
    const x = cx + (rnd() - 0.5) * width, z = cz + (rnd() - 0.5) * depth;
    bodies.push({ x, y: 0, z, s: scale, c: pick(BODY_COLORS) });
    heads.push({ x, y: 1.65 * scale, z, s: scale, c: pick(SKIN) });
  }
  const body = new THREE.CylinderGeometry(0.28, 0.34, 1.4, 7);
  body.translate(0, 0.7, 0);
  instanced(body, mat('#ffffff'), bodies, { parent });
  instanced(new THREE.SphereGeometry(0.26, 8, 6), mat('#ffffff'), heads, { parent });
}

const raycaster = new THREE.Raycaster();
const DOWN = new THREE.Vector3(0, -1, 0);
/** Độ cao mặt đất tại (x, z) trên các vật thể cho trước (đồi, gò đất). */
export function surfaceY(objects, x, z) {
  raycaster.set(new THREE.Vector3(x, 300, z), DOWN);
  const hit = raycaster.intersectObjects(objects, true)[0];
  return hit ? hit.point.y : 0;
}

/**
 * Đồi / núi: nửa cầu méo theo nhiễu, tô màu theo đỉnh.
 * colors: [màu 1, màu 2, màu đỉnh núi | null]
 */
export function hill(x, z, radius, height, colors, seed) {
  const geo = new THREE.SphereGeometry(1, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2);
  const p = geo.attributes.position, v = new THREE.Vector3(), rgb = [], c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = valueNoise(v.x * 3 + seed, v.y * 3, v.z * 3 - seed) * 0.6 + valueNoise(v.x * 7 + seed, v.y * 7, v.z * 7) * 0.4;
    const k = 1 + (n - 0.5) * 0.35 * (v.y > 0.02 ? 1 : 0);
    p.setXYZ(i, v.x * radius * k, v.y * height * k, v.z * radius * k);
    const peak = v.y + (n - 0.5) * 0.4;
    c.set(peak > 0.85 && colors[2] ? colors[2] : (n > 0.5 ? colors[0] : colors[1]));
    rgb.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(rgb, 3));
  geo.computeVertexNormals();
  const m = mesh(geo, std({ vertexColors: true, roughness: 1 }), x, -0.2, z, getRoot());
  m.updateMatrixWorld();
  return m;
}
