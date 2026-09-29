import * as THREE from 'three';
import './styles/base.css';
import './styles/hud.css';
import './styles/dossier.css';

import { ZONES } from './data/zones.js';
import { buildWorld } from './world/index.js';
import { CameraRig } from './engine/camera-rig.js';
import { runFrame } from './engine/animator.js';
import { setAnisotropy } from './lib/textures.js';
import { createZoneNav } from './ui/zone-nav.js';
import { createFileButton } from './ui/file-button.js';
import { createDossier } from './ui/dossier.js';
import { createHint } from './ui/hint.js';
import { createMusic } from './ui/music.js';
import { createPetalOverlay } from './ui/petal-overlay.js';

const $ = (id) => document.getElementById(id);
const app = $('app');
const canvas = $('scene');
const loader = $('loader');

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.24;
  return renderer;
}

/** Chờ font tải xong (tối đa 2 giây) để chữ vẽ lên texture không bị lệch font. */
function waitForFonts() {
  const timeout = new Promise((resolve) => setTimeout(resolve, 2000));
  return Promise.race([document.fonts?.ready ?? Promise.resolve(), timeout]);
}

async function start() {
  let renderer;
  try {
    renderer = createRenderer();
  } catch (error) {
    console.error(error);
    $('loader-text').textContent = 'Trình duyệt này chưa hỗ trợ WebGL nên không hiển thị được cảnh 3D.';
    loader.querySelector('.loader__spin')?.remove();
    return;
  }
  setAnisotropy(Math.min(8, renderer.capabilities.getMaxAnisotropy()));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 1, 3000);
  const rig = new CameraRig(camera, canvas);

  await waitForFonts();
  const environment = buildWorld(scene);

  let current = -1;
  const nav = createZoneNav($('zone-nav'), ZONES, (index) => show(index));
  const fileButton = createFileButton($('file-button'), (index) => openDossier(index));
  const dossier = createDossier($('dossier'), ZONES, {
    onClose: () => { rig.enabled = true; },
    onNavigate: (index) => show(index),
  });
  createHint($('hint'), canvas);
  createMusic($('music'), 'audio/co-hen-voi-thanh-xuan.mp3');
  const petals = createPetalOverlay($('petals'));

  // Màn hình dọc có khung ngang hẹp nên camera lùi xa hơn để thấy trọn khuôn viên.
  function frame(index) {
    if (index < 0) { rig.flyToOverview(); return; }
    const zone = ZONES[index];
    const portrait = Math.min(1.8, Math.max(1, 1 / camera.aspect));
    rig.flyTo({ x: zone.x, y: zone.camY ?? 6, z: zone.z, radius: zone.camRadius * portrait });
  }

  function show(index) {
    current = index;
    nav.setActive(index);
    fileButton.hide();
    frame(index);
  }

  function openDossier(index) {
    if (index < 0 || dossier.isOpen) return;
    rig.enabled = false;
    fileButton.hide();
    dossier.open(index);
  }

  const brand = $('brand');
  brand.addEventListener('click', () => show(-1));
  brand.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(-1); }
  });

  // Phím tắt: 0 toàn cảnh, 1–6 chọn khu, mũi tên xoay/nghiêng, +/- phóng to, Enter mở hồ sơ.
  window.addEventListener('keydown', (e) => {
    if (dossier.isOpen || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target instanceof HTMLElement && e.target.closest('input, textarea, button, a, [role="button"]') && e.key === 'Enter') return;
    const digit = Number(e.key);
    if (e.key.length === 1 && digit >= 0 && digit <= ZONES.length) { show(digit - 1); return; }
    switch (e.key) {
      case 'ArrowLeft': rig.rotate(0.12); break;
      case 'ArrowRight': rig.rotate(-0.12); break;
      case 'ArrowUp': rig.tilt(-0.06); break;
      case 'ArrowDown': rig.tilt(0.06); break;
      case '+': case '=': rig.zoom(0.88); break;
      case '-': case '_': rig.zoom(1.14); break;
      case 'Enter': if (fileButton.visible) openDossier(current); break;
      default: return;
    }
    e.preventDefault();
  });

  let width = 0, height = 0, framedAspect = 0;
  function resize() {
    width = app.clientWidth;
    height = app.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Chỉ căn lại khung khi tỉ lệ đổi rõ rệt (xoay máy), không phải khi thanh địa chỉ co giãn.
    if (Math.abs(camera.aspect - framedAspect) > 0.15) { framedAspect = camera.aspect; frame(current); }
    if (dossier.isOpen) renderer.render(scene, camera);
  }
  new ResizeObserver(resize).observe(app);
  resize();

  show(-1);
  rig.radius = rig.goalRadius; // khung hình đầu tiên đã ở đúng khoảng cách toàn cảnh

  let last = performance.now();
  const context = { target: rig.target };
  renderer.setAnimationLoop((now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (dossier.isOpen) return; // cảnh phía sau bị làm mờ, không cần vẽ lại

    rig.update(dt);
    runFrame(dt, now / 1000, context);
    environment.followCamera(rig.target, rig.radius);
    petals.update(dt, now / 1000);

    if (current >= 0 && rig.isSettled()) fileButton.showAt(ZONES[current], current, camera, width, height);
    else fileButton.hide();

    renderer.render(scene, camera);
  });

  requestAnimationFrame(() => loader.classList.add('is-done'));
}

start();
