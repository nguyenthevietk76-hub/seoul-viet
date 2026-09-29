import * as THREE from 'three';
import { canvasTexture } from '../lib/textures.js';
import { rnd } from '../lib/random.js';

export const FOG_COLOR = '#efe6dc';
const SUN_OFFSET = new THREE.Vector3(-160, 150, 120);

/** Bầu trời, mây, nắng ấm và ánh sáng môi trường. */
export function buildEnvironment(scene) {
  scene.fog = new THREE.FogExp2(FOG_COLOR, 0.0013);
  scene.background = new THREE.Color(FOG_COLOR);

  // Vòm trời: chuyển từ màu sương ở chân trời lên xanh, có quầng nắng quanh mặt trời.
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1400, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        zenith: { value: new THREE.Color('#6f9fd8') },
        horizon: { value: new THREE.Color(FOG_COLOR) },
        sunDir: { value: SUN_OFFSET.clone().normalize() },
      },
      vertexShader: /* glsl */`
        varying vec3 vDir;
        void main() {
          vDir = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */`
        uniform vec3 zenith;
        uniform vec3 horizon;
        uniform vec3 sunDir;
        varying vec3 vDir;
        void main() {
          vec3 n = normalize(vDir);
          float t = clamp(n.y * 2.2, 0.0, 1.0);
          float d = max(dot(n, sunDir), 0.0);
          vec3 c = mix(horizon, zenith, pow(t, 0.8));
          c += vec3(1.0, 0.8, 0.52) * (pow(d, 400.0) * 2.2 + pow(d, 40.0) * 0.45 + pow(d, 5.0) * 0.18);
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  scene.add(sky);

  // Cường độ đèn tính theo đơn vị vật lý của Three.js mới (nhân π).
  scene.add(new THREE.HemisphereLight('#fff2e0', '#8f8f62', 0.7 * Math.PI));

  const cloud = canvasTexture(256, 128, (g, w, h) => {
    for (let i = 0; i < 14; i++) {
      const x = 40 + rnd() * 176, y = 50 + rnd() * 40, r = 24 + rnd() * 30;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,.95)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }
  });
  cloud.wrapS = cloud.wrapT = THREE.ClampToEdgeWrapping;
  for (let k = 0; k < 12; k++) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloud, fog: false, transparent: true, opacity: 0.8, depthWrite: false }));
    const a = k / 12 * 6.28 + rnd() * 0.3;
    sprite.position.set(Math.cos(a) * 1150, 300 + rnd() * 220, Math.sin(a) * 1150);
    sprite.scale.set(620, 300, 1);
    scene.add(sprite);
  }

  const sun = new THREE.DirectionalLight('#ffdcaa', 3.5 * Math.PI);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.5;
  scene.add(sun, sun.target);

  let shadowExtent = 0;
  /** Bóng đổ chỉ tính quanh chỗ camera đang nhìn, rộng/hẹp theo độ zoom. */
  function followCamera(target, radius) {
    sun.position.copy(target).add(SUN_OFFSET);
    sun.target.position.copy(target);
    const extent = Math.min(260, Math.max(55, radius * 0.6));
    if (Math.abs(extent - shadowExtent) > 4) {
      shadowExtent = extent;
      const cam = sun.shadow.camera;
      cam.left = cam.bottom = -extent;
      cam.right = cam.top = extent;
      cam.near = 20;
      cam.far = 700;
      cam.updateProjectionMatrix();
    }
  }

  return { sun, followCamera };
}
