import * as THREE from 'three';
import { ZONES } from '../data/zones.js';
import { canvasTexture, roundRect, CANVAS_FONT } from '../lib/textures.js';
import { getRoot } from '../lib/scene-helpers.js';

/** Nhãn nổi trên mỗi khu: tên khu + địa danh, luôn hiện trên cùng. */
export function buildZoneLabels() {
  for (const zone of ZONES) {
    const texture = canvasTexture(512, 150, (g, w, h) => {
      g.font = `700 52px ${CANVAS_FONT}`;
      const nameWidth = g.measureText(zone.name).width;
      g.font = `500 34px ${CANVAS_FONT}`;
      const placeWidth = g.measureText(zone.place).width;
      const width = Math.max(nameWidth, placeWidth) + 120, x0 = (w - width) / 2;
      roundRect(g, x0, 8, width, h - 16, (h - 16) / 2);
      g.fillStyle = 'rgba(255,255,255,.9)'; g.fill();
      g.fillStyle = zone.labelDot; g.beginPath(); g.arc(x0 + 44, h / 2, 13, 0, 7); g.fill();
      g.textAlign = 'left';
      g.fillStyle = '#23262f'; g.font = `700 52px ${CANVAS_FONT}`; g.fillText(zone.name, x0 + 74, 66);
      g.fillStyle = '#6b6570'; g.font = `500 34px ${CANVAS_FONT}`; g.fillText(zone.place, x0 + 74, 112);
    });
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, fog: false }));
    sprite.scale.set(30, 8.8, 1);
    sprite.position.set(zone.x, zone.labelY, zone.z);
    sprite.renderOrder = 10;
    getRoot().add(sprite);
  }
}
