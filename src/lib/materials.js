import * as THREE from 'three';

const cache = new Map();

/** Vật liệu màu trơn, dùng chung theo (màu + tuỳ chọn) để giảm số vật liệu phải biên dịch. */
export function mat(color, options) {
  const key = color + (options ? JSON.stringify(options) : '');
  let material = cache.get(key);
  if (!material) {
    material = new THREE.MeshStandardMaterial({ color, roughness: 0.88, metalness: 0, ...options });
    cache.set(key, material);
  }
  return material;
}

/** Vật liệu riêng (thường có texture). */
export const std = (options) => new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0, ...options });
