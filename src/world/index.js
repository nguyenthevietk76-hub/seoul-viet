import { setRoot } from '../lib/scene-helpers.js';
import { createTextures } from '../lib/textures.js';
import { buildEnvironment } from '../engine/environment.js';
import { initTrees, flushTrees } from './trees.js';
import { flushScatter } from './scatter.js';
import { buildTerrain } from './terrain.js';
import { buildZoneLabels } from './labels.js';
import { buildNamsan } from './zones/namsan.js';
import { buildSungkyunkwan } from './zones/sungkyunkwan.js';
import { buildGwanghwamun } from './zones/gwanghwamun.js';
import { buildGangnam } from './zones/gangnam.js';
import { buildOlympicPark } from './zones/olympic.js';
import { buildHanRiverPark } from './zones/han-river.js';
import { buildCity } from './city.js';
import { buildFallingPetals } from './falling-petals.js';

/**
 * Dựng toàn bộ thành phố. Thứ tự các bước giữ cố định để bộ sinh ngẫu nhiên
 * cho ra cùng một bố cục mỗi lần tải trang.
 */
export function buildWorld(scene) {
  setRoot(scene);
  createTextures();
  initTrees();

  const environment = buildEnvironment(scene);
  buildTerrain();
  buildZoneLabels();

  buildNamsan();
  buildSungkyunkwan();
  buildGwanghwamun();
  buildGangnam();
  buildOlympicPark();
  buildHanRiverPark();

  buildCity();
  flushTrees();
  flushScatter();
  buildFallingPetals();

  return environment;
}
