import * as THREE from 'three';

/**
 * Nút tệp hồ sơ nổi ngay dưới nhãn tên khu khi camera đã dừng.
 * Nếu nhãn nằm ngoài khung hình, nút được kéo vào trong màn hình.
 */
export function createFileButton(button, onOpen) {
  const label = button.querySelector('.file-button__label');
  const projected = new THREE.Vector3();
  let visible = false;
  let zoneIndex = -1;

  button.addEventListener('click', () => onOpen(zoneIndex));

  function hide() {
    if (!visible) return;
    visible = false;
    button.classList.remove('is-visible');
  }

  function showAt(zone, index, camera, width, height) {
    zoneIndex = index;
    projected.set(zone.x, zone.labelY, zone.z).project(camera);
    const inFront = projected.z < 1;
    const x = inFront ? (projected.x + 1) / 2 * width : width / 2;
    const y = inFront ? (1 - projected.y) / 2 * height + 34 : height * 0.3;
    button.style.left = `${Math.min(width - 90, Math.max(90, x))}px`;
    button.style.top = `${Math.min(height - 190, Math.max(78, y))}px`;
    if (!visible) {
      visible = true;
      label.textContent = `Mở hồ sơ · ${zone.name}`;
      button.classList.add('is-visible');
    }
  }

  return { hide, showAt, get visible() { return visible; } };
}
