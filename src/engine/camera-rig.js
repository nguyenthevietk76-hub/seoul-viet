import * as THREE from 'three';

const MIN_RADIUS = 25;
const MAX_RADIUS = 760;
const MIN_PHI = 0.22;
const MAX_PHI = 1.36;
const PAN_LIMIT = 620;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * Camera quỹ đạo quanh một điểm nhìn, chuyển động mượt về trạng thái đích.
 * - Kéo chuột trái: xoay · chuột phải / Shift / Ctrl + kéo: di chuyển ngang
 * - Cuộn: phóng to thu nhỏ · hai ngón tay: phóng to và di chuyển
 */
export class CameraRig {
  constructor(camera, element) {
    this.camera = camera;
    this.element = element;
    this.enabled = true;
    this.idle = 0;

    this.target = new THREE.Vector3(0, 0, 6);
    this.goalTarget = this.target.clone();
    this.theta = 0.62; this.goalTheta = this.theta;
    this.phi = 0.98; this.goalPhi = this.phi;
    this.radius = 430; this.goalRadius = this.radius;

    this.pointers = new Map();
    this.pinchDistance = null;
    this.pinchMid = null;
    this.panMode = false;
    this.#bindInput();
  }

  get overviewRadius() {
    return this.camera.aspect < 1 ? 620 : 430;
  }

  /** Bay tới một điểm nhìn mới. */
  flyTo({ x, y = 6, z, radius, phi = 1.0 }) {
    this.goalTarget.set(x, y, z);
    this.goalRadius = radius;
    this.goalPhi = phi;
    this.idle = 0;
  }

  flyToOverview() {
    this.flyTo({ x: 0, y: 0, z: 6, radius: this.overviewRadius, phi: 0.98 });
  }

  /** Camera đã tới gần đích chưa (để hiện nút hồ sơ). */
  isSettled() {
    return this.target.distanceTo(this.goalTarget) < 3 && Math.abs(this.radius - this.goalRadius) < this.goalRadius * 0.06;
  }

  rotate(delta) { this.goalTheta += delta; this.idle = 0; }
  tilt(delta) { this.goalPhi = clamp(this.goalPhi + delta, MIN_PHI, MAX_PHI); this.idle = 0; }
  zoom(factor) { this.goalRadius = clamp(this.goalRadius * factor, MIN_RADIUS, MAX_RADIUS); this.idle = 0; }

  update(dt) {
    this.idle += dt;
    if (this.idle > 8 && !this.pointers.size) this.goalTheta += dt * 0.025; // tự xoay chậm khi để yên

    const k = 1 - Math.exp(-dt * 5.5);
    this.theta += (this.goalTheta - this.theta) * k;
    this.phi += (this.goalPhi - this.phi) * k;
    this.radius += (this.goalRadius - this.radius) * k;
    this.target.lerp(this.goalTarget, k);

    const { target: t, radius: r, phi, theta } = this;
    this.camera.position.set(
      t.x + r * Math.sin(phi) * Math.sin(theta),
      t.y + r * Math.cos(phi),
      t.z + r * Math.sin(phi) * Math.cos(theta),
    );
    this.camera.lookAt(t);
  }

  #pan(dx, dy) {
    const s = this.radius * 0.0017, c = Math.cos(this.theta), sn = Math.sin(this.theta);
    const g = this.goalTarget;
    g.x += (-c * dx - sn * dy) * s;
    g.z += (sn * dx - c * dy) * s;
    const len = Math.hypot(g.x, g.z);
    if (len > PAN_LIMIT) { g.x *= PAN_LIMIT / len; g.z *= PAN_LIMIT / len; }
  }

  #bindInput() {
    const el = this.element;
    el.addEventListener('contextmenu', (e) => e.preventDefault());

    el.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return;
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      el.setPointerCapture(e.pointerId);
      this.idle = 0;
      this.panMode = e.button === 2 || e.shiftKey || e.ctrlKey;
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        this.pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
        this.pinchMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      }
    });

    el.addEventListener('pointermove', (e) => {
      const p = this.pointers.get(e.pointerId);
      if (!p || !this.enabled) return;
      if (e.pointerType === 'mouse' && !e.buttons) { this.pointers.delete(e.pointerId); return; }
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      this.idle = 0;

      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        if (this.pinchDistance) this.goalRadius = clamp(this.goalRadius * this.pinchDistance / distance, MIN_RADIUS, MAX_RADIUS);
        if (this.pinchMid) this.#pan(mid.x - this.pinchMid.x, mid.y - this.pinchMid.y);
        this.pinchDistance = distance;
        this.pinchMid = mid;
        return;
      }
      if (this.panMode) this.#pan(dx, dy);
      else {
        this.goalTheta -= dx * 0.0045;
        this.goalPhi = clamp(this.goalPhi - dy * 0.0035, MIN_PHI, MAX_PHI);
      }
    });

    const release = (e) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) { this.pinchDistance = null; this.pinchMid = null; }
    };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => el.addEventListener(type, release));

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (!this.enabled) return;
      const dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      this.zoom(Math.exp(clamp(dy, -300, 300) * 0.0011));
    }, { passive: false });
  }
}
