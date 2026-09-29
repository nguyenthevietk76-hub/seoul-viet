import * as THREE from 'three';
import { rnd, pick } from './random.js';

export const CANVAS_FONT = "'Be Vietnam Pro', system-ui, sans-serif";

let anisotropy = 4;
export const setAnisotropy = (value) => { anisotropy = value; };

/** Vẽ texture bằng canvas 2D. */
export function canvasTexture(width, height, draw, repeatX, repeatY = repeatX) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  if (repeatX) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeatX, repeatY);
  }
  return t;
}

export function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

const grey = (v, dr = 0, dg = 0, db = 0) => `rgb(${v + dr | 0},${v + dg | 0},${v + db | 0})`;

/** Mọi texture vẽ tay của thành phố. Gọi createTextures() một lần sau khi có renderer. */
export const TEX = {};

export function createTextures() {
  TEX.grass = canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = '#7ea35a'; g.fillRect(0, 0, w, h);
    const tones = ['#6f9650', '#8bb062', '#779c55', '#93b86a', '#6a8f4c'];
    for (let i = 0; i < 5000; i++) { g.fillStyle = pick(tones); g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2); }
  }, 160);

  TEX.paving = canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = '#b9b1a2'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const v = 205 + rnd() * 22 | 0; g.fillStyle = grey(v, 0, -6, -16); g.fillRect(x * 32 + 1, y * 32 + 1, 30, 30);
    }
  }, 1);

  TEX.stone = canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = '#9d9483'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < 8; y++) for (let x = -1; x < 5; x++) {
      const v = 192 + rnd() * 28 | 0; g.fillStyle = grey(v, 0, -6, -18); g.fillRect(x * 64 + (y % 2) * 32 + 2, y * 32 + 2, 60, 28);
    }
  }, 1);

  TEX.asphaltTile = canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = '#5b5e62'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 3000; i++) { const v = 80 + rnd() * 30 | 0; g.fillStyle = grey(v, 0, 0, 3); g.fillRect(rnd() * w, rnd() * h, 1, 1); }
    g.fillStyle = '#e9e6dc';
    for (let i = 0; i < 256; i += 24) { g.fillRect(i, 0, 12, 2); g.fillRect(i, 254, 12, 2); g.fillRect(0, i, 2, 12); g.fillRect(254, i, 2, 12); }
    g.fillStyle = '#e0b53a';
    g.fillRect(0, 40, 256, 2); g.fillRect(0, 214, 256, 2); g.fillRect(40, 0, 2, 256); g.fillRect(214, 0, 2, 256);
  });

  TEX.road = canvasTexture(64, 256, (g, w, h) => {
    g.fillStyle = '#55585c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 600; i++) { const v = 78 + rnd() * 26 | 0; g.fillStyle = grey(v, 0, 0, 3); g.fillRect(rnd() * w, rnd() * h, 1, 1); }
    g.fillStyle = '#e0b53a'; g.fillRect(30, 0, 2, h); g.fillRect(34, 0, 2, h);
    g.fillStyle = '#ecebe4'; for (let y = 0; y < h; y += 64) { g.fillRect(14, y, 2, 32); g.fillRect(48, y, 2, 32); }
  });

  TEX.lowRise = canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = '#f3f0ea'; g.fillRect(0, 0, w, h);
    for (let f = 0; f < 3; f++) for (let u = 0; u < 4; u++) {
      g.fillStyle = rnd() < 0.2 ? '#a6b5bf' : '#5c6c78'; g.fillRect(u * 64 + 10, f * 64 + 14, 44, 34);
      g.fillStyle = '#d8d3ca'; g.fillRect(u * 64 + 8, f * 64 + 50, 48, 4);
    }
    g.fillStyle = '#39444d'; g.fillRect(0, 196, w, 60);
    const signs = ['#c8413a', '#2f6db5', '#e0a82e', '#3aa57a', '#e58aa8'];
    for (let u = 0; u < 4; u++) { g.fillStyle = pick(signs); g.fillRect(u * 64 + 4, 192, 56, 12); }
  });

  TEX.glass = canvasTexture(256, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, h, 0, 0); gr.addColorStop(0, '#6f8a9e'); gr.addColorStop(1, '#a9c0cf');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 16) { g.fillStyle = 'rgba(40,60,75,.35)'; g.fillRect(0, y, w, 2); }
    for (let x = 0; x < w; x += 32) { g.fillStyle = 'rgba(225,236,242,.45)'; g.fillRect(x, 0, 2, h); }
    for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect((rnd() * 8 | 0) * 32, (rnd() * 32 | 0) * 16, 32, 16); }
  });

  // Dải hoa văn dancheong dưới mái ngói.
  TEX.dancheong = canvasTexture(256, 64, (g, w, h) => {
    g.fillStyle = '#2f6f62'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#3f8f7c'; g.fillRect(0, 0, w, 10);
    for (let x = 0; x < w; x += 64) {
      g.fillStyle = '#b3362b'; g.beginPath(); g.ellipse(x + 32, 34, 20, 14, 0, 0, 7); g.fill();
      g.fillStyle = '#e0b04a'; g.beginPath(); g.ellipse(x + 32, 34, 10, 7, 0, 0, 7); g.fill();
      g.fillStyle = '#f3ead6'; g.beginPath(); g.arc(x + 32, 34, 3, 0, 7); g.fill();
      g.fillStyle = '#3f5f8f'; g.fillRect(x, 54, 64, 10);
      g.fillStyle = '#e8dfcc'; g.fillRect(x + 62, 0, 2, h);
    }
  }, 1, 1);

  // Ngói xanh tím có gờ.
  TEX.roofTile = canvasTexture(128, 128, (g, w, h) => {
    for (let x = 0; x < w; x += 16) {
      const gr = g.createLinearGradient(x, 0, x + 16, 0);
      gr.addColorStop(0, '#39426a'); gr.addColorStop(0.35, '#6c77a6'); gr.addColorStop(0.6, '#56608d'); gr.addColorStop(1, '#323a5e');
      g.fillStyle = gr; g.fillRect(x, 0, 16, h);
    }
    for (let y = 0; y < h; y += 32) { g.fillStyle = 'rgba(20,24,40,.25)'; g.fillRect(0, y, w, 2); }
  }, 1, 1);

  // Vách cung điện: cột đỏ, cửa song xanh lục.
  TEX.palaceWall = canvasTexture(256, 128, (g, w, h) => {
    g.fillStyle = '#9b3b2a'; g.fillRect(0, 0, w, h);
    for (let p = 0; p < 4; p++) {
      const x = p * 64 + 6;
      g.fillStyle = '#3f8a72'; g.fillRect(x, 8, 52, 112);
      g.strokeStyle = '#8fcfb8'; g.lineWidth = 1.5;
      for (let i = 1; i < 5; i++) { g.beginPath(); g.moveTo(x + i * 10.4, 8); g.lineTo(x + i * 10.4, 84); g.stroke(); }
      for (let j = 1; j < 8; j++) { g.beginPath(); g.moveTo(x, 8 + j * 10.5); g.lineTo(x + 52, 8 + j * 10.5); g.stroke(); }
      g.fillStyle = '#2d6c58'; g.fillRect(x, 88, 52, 32);
      g.fillStyle = '#e0b04a'; g.fillRect(x + 24, 94, 4, 4);
    }
  }, 1, 1);

  // Vách nhà hanok: tường vôi trắng khung gỗ, cửa sổ giấy hanji.
  TEX.houseWall = canvasTexture(256, 128, (g, w, h) => {
    g.fillStyle = '#b27a44'; g.fillRect(0, 0, w, h);
    for (let p = 0; p < 2; p++) {
      const x = p * 128 + 8;
      g.fillStyle = '#f4efe3'; g.fillRect(x, 8, 112, 112);
      g.fillStyle = '#b27a44'; g.fillRect(x, 60, 112, 5);
      if (p === 0) {
        g.fillStyle = '#8a5a33'; g.fillRect(x + 30, 20, 52, 34);
        g.fillStyle = '#f1e6cc'; g.fillRect(x + 33, 23, 46, 28);
        g.strokeStyle = '#a0703f'; g.lineWidth = 1.5;
        for (let i = 1; i < 5; i++) { g.beginPath(); g.moveTo(x + 33 + i * 9.2, 23); g.lineTo(x + 33 + i * 9.2, 51); g.stroke(); }
        for (let j = 1; j < 3; j++) { g.beginPath(); g.moveTo(x + 33, 23 + j * 9.3); g.lineTo(x + 79, 23 + j * 9.3); g.stroke(); }
      }
    }
  }, 1, 1);

  TEX.door = canvasTexture(128, 128, (g, w, h) => {
    g.fillStyle = '#8a5a33'; g.fillRect(0, 0, w, h);
    for (let p = 0; p < 2; p++) {
      const x = p * 64 + 5;
      g.fillStyle = '#f1e6cc'; g.fillRect(x, 6, 54, 116);
      g.strokeStyle = '#a0703f'; g.lineWidth = 2;
      for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(x + i * 13.5, 6); g.lineTo(x + i * 13.5, 122); g.stroke(); }
      for (let j = 1; j < 9; j++) { g.beginPath(); g.moveTo(x, 6 + j * 12.9); g.lineTo(x + 54, 6 + j * 12.9); g.stroke(); }
    }
  }, 1, 1);

  // Tường đá hộc.
  TEX.rubble = canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = '#8f8a82'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) {
      const v = 150 + rnd() * 60 | 0; g.fillStyle = grey(v, 0, -2, -6);
      g.beginPath();
      const x = rnd() * w, y = rnd() * h, r = 14 + rnd() * 16;
      for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28; g.lineTo(x + Math.cos(a) * r * (0.7 + rnd() * 0.4), y + Math.sin(a) * r * 0.7 * (0.7 + rnd() * 0.4)); }
      g.fill();
    }
  }, 1, 1);
}

/** Mặt dài của khối chung cư Hàn Quốc (15 tầng, ban công). */
export const apartmentSideTexture = () => canvasTexture(512, 512, (g, w, h) => {
  g.fillStyle = '#eeeae1'; g.fillRect(0, 0, w, h);
  const floors = 15, units = 8;
  for (let f = 0; f < floors; f++) {
    const y = h - (f + 1) * h / floors;
    for (let u = 0; u < units; u++) {
      const x = u * w / units;
      g.fillStyle = rnd() < 0.15 ? '#9fb0bb' : '#6a7c89'; g.fillRect(x + 6, y + 5, w / units - 12, h / floors * 0.62);
      g.fillStyle = '#f8f7f2'; g.fillRect(x + 4, y + h / floors * 0.62 + 4, w / units - 8, 3);
    }
    g.fillStyle = '#d9d4c9'; g.fillRect(0, y, w, 2);
  }
  g.fillStyle = '#d6d0c4'; for (let u = 0; u <= units; u++) g.fillRect(u * w / units - 2, 0, 4, h);
});

/** Đầu hồi chung cư có số toà (101, 102, 103). */
export const apartmentEndTexture = (label, accent) => canvasTexture(128, 512, (g, w, h) => {
  g.fillStyle = '#e7e2d7'; g.fillRect(0, 0, w, h);
  g.fillStyle = accent; g.fillRect(w * 0.62, 0, w * 0.16, h);
  g.fillStyle = '#6a7c8e'; g.textAlign = 'center'; g.font = '700 34px ' + CANVAS_FONT; g.fillText(label, w * 0.36, 52);
  for (let f = 2; f < 15; f++) { g.fillStyle = '#8391a0'; g.fillRect(20, f * 34 + 8, 22, 14); }
});
