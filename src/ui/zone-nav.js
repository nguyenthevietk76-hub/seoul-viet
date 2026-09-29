/** Thanh chọn khu ở cuối màn hình: "Toàn cảnh" + 6 khu. Chỉ số -1 là toàn cảnh. */
export function createZoneNav(container, zones, onSelect) {
  const items = [{ name: 'Toàn cảnh', index: -1 }, ...zones.map((z, index) => ({ name: z.name, index }))];
  const buttons = items.map(({ name, index }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'zone-nav__item';
    button.textContent = name;
    button.addEventListener('click', () => onSelect(index));
    container.appendChild(button);
    return button;
  });

  return {
    setActive(index) {
      buttons.forEach((b, i) => {
        const active = i === index + 1;
        b.classList.toggle('is-active', active);
        if (active) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
    },
  };
}
