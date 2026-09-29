import * as THREE from 'three';
import { mat, std } from './materials.js';

/** Node gốc mặc định cho mọi hàm dựng (được gán là scene lúc khởi tạo). */
let root = null;
export const setRoot = (object) => { root = object; };
export const getRoot = () => root;

/** Tạo mesh, bật đổ bóng và gắn vào parent. `material` có thể là mã màu, vật liệu hoặc mảng vật liệu. */
export function mesh(geometry, material, x = 0, y = 0, z = 0, parent = root) {
  const m = new THREE.Mesh(geometry, typeof material === 'string' ? mat(material) : material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

/** Hộp đặt đáy tại y. */
export const box = (w, h, d, material, x, y, z, parent) =>
  mesh(new THREE.BoxGeometry(w, h, d), material, x, y + h / 2, z, parent);

/** Trụ đặt đáy tại y. */
export const cyl = (radiusTop, radiusBottom, h, material, x, y, z, parent, segments = 14) =>
  mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, h, segments), material, x, y + h / 2, z, parent);

export function group(x = 0, z = 0, parent = root, rotationY = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotationY;
  parent.add(g);
  g.updateMatrixWorld(true);
  return g;
}

/** Nhóm được phóng to theo tỉ lệ khu (các khu chính to hơn nền thành phố). */
export function scaledGroup(x, z, scale) {
  const g = group(x, z);
  g.scale.setScalar(scale);
  g.updateMatrixWorld(true);
  return g;
}

/** Đổi toạ độ cục bộ (x, z) trong nhóm sang toạ độ thế giới. */
export function toWorld(g, x, z) {
  const v = new THREE.Vector3(x, 0, z);
  g.localToWorld(v);
  return v;
}

/** Vật liệu texture lặp (clone texture để mỗi mặt có độ lặp riêng). */
export function tiled(texture, repeatX, repeatY, color = '#ffffff') {
  const t = texture.clone();
  t.needsUpdate = true;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, repeatY);
  return std({ map: t, color });
}

export function repeatedTexture(texture, repeatX, repeatY) {
  const t = texture.clone();
  t.needsUpdate = true;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, repeatY);
  return t;
}
