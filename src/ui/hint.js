/** Ô mẹo điều khiển: tự ẩn sau 12 giây, hoặc 2,5 giây sau lần kéo đầu tiên. */
export function createHint(element, canvas) {
  const hide = () => element.classList.add('is-hidden');
  let timer = setTimeout(hide, 12000);
  canvas.addEventListener('pointerdown', () => {
    clearTimeout(timer);
    timer = setTimeout(hide, 2500);
  }, { once: true });
}
