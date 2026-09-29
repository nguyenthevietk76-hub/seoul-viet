/**
 * Bộ sinh số ngẫu nhiên có hạt giống (mulberry32) để thành phố luôn dựng giống nhau
 * mỗi lần tải trang.
 */
let seed = 11;

export const getSeed = () => seed;
export const setSeed = (value) => { seed = value; };

export function rnd() {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const pick = (list) => list[Math.floor(rnd() * list.length)];
