/**
 * Vài cánh hoa đào rơi lơ lửng trước camera, vẽ trên một lớp canvas 2D
 * nằm giữa cảnh 3D và các nút giao diện. Cánh tập trung quanh giữa màn hình.
 */
const COLORS = [['#ffd9e4', '#f59ab8'], ['#ffe6ee', '#f7b3c8'], ['#fff0f4', '#ee8fb0']];

export function createPetalOverlay(canvas) {
  const g = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = 1;
  let petals = [];

  // Hai số ngẫu nhiên cộng lại cho phân bố dày ở giữa, thưa ở hai mép.
  const centered = () => 0.5 + (Math.random() + Math.random() - 1) * 0.5;

  function spawn(petal, fromTop) {
    petal.x = width * centered();
    petal.y = fromTop ? -20 - Math.random() * height * 0.3 : Math.random() * height;
    petal.size = 7 + Math.random() * 7;
    petal.fall = 16 + Math.random() * 22;
    petal.drift = 8 + Math.random() * 14;
    petal.swayAmp = 18 + Math.random() * 30;
    petal.swaySpeed = 0.5 + Math.random() * 0.7;
    petal.phase = Math.random() * Math.PI * 2;
    petal.spin = (Math.random() - 0.5) * 1.6;
    petal.flipSpeed = 1 + Math.random() * 1.8;
    petal.angle = Math.random() * Math.PI * 2;
    petal.colors = COLORS[Math.floor(Math.random() * COLORS.length)];
    petal.alpha = 0.75 + Math.random() * 0.25;
    return petal;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const count = reduced ? 0 : Math.round(Math.min(18, Math.max(9, width / 80)));
    while (petals.length < count) petals.push(spawn({}, false));
    petals.length = count;
  }

  function drawPetal(p, time) {
    const flip = Math.cos(time * p.flipSpeed + p.phase); // lật mặt cánh: co dẹt theo chiều ngang
    g.save();
    g.translate(p.x + Math.sin(time * p.swaySpeed + p.phase) * p.swayAmp, p.y);
    g.rotate(p.angle);
    g.scale(Math.max(0.18, Math.abs(flip)), 1);
    const s = p.size;
    const gradient = g.createLinearGradient(0, -s, 0, s);
    gradient.addColorStop(0, p.colors[0]);
    gradient.addColorStop(1, p.colors[1]);
    g.fillStyle = gradient;
    g.globalAlpha = p.alpha * (flip < 0 ? 0.85 : 1);
    // Cánh hoa anh đào: tròn ở gốc, có khía nhỏ ở đầu cánh.
    g.beginPath();
    g.moveTo(0, s);
    g.bezierCurveTo(-s * 0.95, s * 0.35, -s * 0.8, -s * 0.8, -s * 0.18, -s);
    g.lineTo(0, -s * 0.72);
    g.lineTo(s * 0.18, -s);
    g.bezierCurveTo(s * 0.8, -s * 0.8, s * 0.95, s * 0.35, 0, s);
    g.fill();
    g.restore();
  }

  function update(dt, time) {
    if (!petals.length) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, width, height);
    for (const p of petals) {
      p.y += p.fall * dt;
      p.x += p.drift * dt;
      p.angle += p.spin * dt;
      if (p.y > height + 24 || p.x > width + 40) spawn(p, true);
      drawPetal(p, time);
    }
  }

  new ResizeObserver(resize).observe(canvas);
  resize();
  return { update };
}
