const STORAGE_KEY = 'seoul-viet:music-muted';
const VOLUME = 0.2;

const readMuted = () => { try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; } };
const saveMuted = (muted) => { try { localStorage.setItem(STORAGE_KEY, muted ? '1' : '0'); } catch { /* bỏ qua */ } };

/**
 * Nhạc nền phát lặp ở âm lượng nhỏ. Trình duyệt chặn tự phát nhạc,
 * nên nhạc bắt đầu ở lần chạm/nhấn phím đầu tiên (trừ khi người xem đã tắt trước đó).
 */
export function createMusic(button, src) {
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = VOLUME;
  audio.preload = 'none';

  let muted = readMuted();
  let resumeOnShow = false;

  function render() {
    const playing = !audio.paused;
    button.classList.toggle('is-playing', playing);
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'Tắt nhạc nền' : 'Bật nhạc nền');
    button.title = playing ? 'Tắt nhạc' : 'Bật nhạc';
  }

  const play = () => audio.play().catch(() => {}).finally(render);

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    muted = !audio.paused;
    saveMuted(muted);
    if (muted) { audio.pause(); render(); } else play();
  });

  const unlock = (e) => {
    if (button.contains(e.target)) return; // nút nhạc tự xử lý
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
    if (!muted) play();
  };
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);

  // Tạm dừng khi chuyển sang tab khác, phát tiếp khi quay lại.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { resumeOnShow = !audio.paused; audio.pause(); }
    else if (resumeOnShow) play();
  });

  audio.addEventListener('play', render);
  audio.addEventListener('pause', render);
  render();
}
