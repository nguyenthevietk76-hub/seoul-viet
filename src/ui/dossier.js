import { esc } from './escape.js';
import { DOSSIERS, CONTACT, SOCIALS, TOOLS, HIGHLIGHTS } from '../data/profile.js';
import { AVATARS, GALLERY } from '../data/gallery.js';

/** Biểu tượng thay ảnh khi khu chưa có ảnh đại diện. */
const ZONE_ICONS = [
  '<svg viewBox="0 0 100 120"><circle cx="50" cy="42" r="22" fill="#fff" opacity=".92"/><path d="M8 120c4-30 22-44 42-44s38 14 42 44z" fill="#fff" opacity=".92"/></svg>',
  '<svg viewBox="0 0 100 100"><path d="M8 44q42-26 84 0l-8 4q-34-18-68 0z" fill="#2b3350"/><rect x="20" y="48" width="60" height="30" fill="#fff"/><rect x="22" y="48" width="5" height="30" fill="#8a3b2a"/><rect x="47" y="48" width="5" height="30" fill="#8a3b2a"/><rect x="73" y="48" width="5" height="30" fill="#8a3b2a"/><rect x="14" y="78" width="72" height="8" fill="#d8d0c0"/></svg>',
  '<svg viewBox="0 0 100 100"><rect x="14" y="30" width="18" height="60" fill="#dff3ef"/><rect x="36" y="10" width="20" height="80" fill="#fff"/><rect x="60" y="24" width="24" height="66" fill="#cdebe5"/></svg>',
  '<svg viewBox="0 0 100 100"><rect x="38" y="12" width="24" height="42" rx="12" fill="#fff"/><path d="M28 44a22 22 0 0 0 44 0" fill="none" stroke="#fff" stroke-width="6"/><rect x="47" y="66" width="6" height="16" fill="#fff"/><rect x="34" y="82" width="32" height="6" rx="3" fill="#fff"/></svg>',
  '<svg viewBox="0 0 100 100"><path d="M30 14h40v22a20 20 0 0 1-40 0z" fill="#fff"/><path d="M30 20H16q0 20 16 22M70 20h14q0 20-16 22" fill="none" stroke="#fff" stroke-width="5"/><rect x="46" y="56" width="8" height="14" fill="#fff"/><rect x="32" y="70" width="36" height="10" rx="2" fill="#fff"/></svg>',
  '<svg viewBox="0 0 100 100"><path d="M50 78C18 58 14 38 26 28c9-8 20-4 24 6 4-10 15-14 24-6 12 10 8 30-24 50z" fill="#fff"/><path d="M8 88q10-8 21 0t21 0 21 0 21 0" fill="none" stroke="#fff" stroke-width="5"/></svg>',
];

const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.2];
const external = 'target="_blank" rel="noopener noreferrer"';

/** Tô màu các từ khoá trong đoạn văn (sau khi đã escape). */
function highlight(text) {
  let html = esc(text);
  for (const word of HIGHLIGHTS) html = html.split(esc(word)).join(`<span class="hl">${esc(word)}</span>`);
  return html;
}

const paragraphs = (list) => list.map((p) => `<p class="txt">${highlight(p)}</p>`).join('');

function contactRows() {
  const rows = [
    ['Điện thoại', `<a href="tel:${CONTACT.phone}">${esc(CONTACT.phoneDisplay)}</a>`],
    ['Email', `<a href="mailto:${CONTACT.email}">${esc(CONTACT.email)}</a>`],
    ...SOCIALS.map((s) => [s.label, `<a href="${s.href}" ${external}>${esc(s.handle)}</a>`]),
    ['Nơi ở', esc(CONTACT.location)],
  ];
  return rows.map(([k, v]) => `<div class="nr nr--stack"><b>${esc(k)}</b><span>${v}</span></div>`).join('');
}

function statRows(note) {
  return note.map(([k, v]) => `<div class="nr"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('');
}

function entryCard(e) {
  const points = e.points.length ? `<ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : '';
  const link = e.link ? `<a class="vid" href="${e.link.href}" ${external}><span aria-hidden="true">▶</span>${esc(e.link.label)}</a>` : '';
  return `<article class="en${e.featured ? ' hi' : ''}">
    <div class="enh"><h4>${e.featured ? '<em aria-label="Nổi bật">★</em>' : ''}${esc(e.title)}</h4>${e.date ? `<span class="date">${esc(e.date)}</span>` : ''}</div>
    ${e.org ? `<div class="org">${esc(e.org)}</div>` : ''}${points}${link}
  </article>`;
}

function gallery(index) {
  const shots = GALLERY[index];
  if (!shots.length) return '';
  return `<section class="gal" aria-label="Khoảnh khắc">
    <h3 class="tag">Khoảnh khắc</h3>
    <div class="gcols">${shots.map((s, k) => `<figure class="gf" style="--r:${TILTS[k % TILTS.length]}deg">
      <img src="${s.src}" alt="${esc(s.caption)}" loading="lazy" decoding="async">
      <figcaption class="gc">${esc(s.caption)}<small>${esc(s.note)}</small></figcaption>
    </figure>`).join('')}</div>
  </section>`;
}

function render(index, zones) {
  const zone = zones[index], d = DOSSIERS[index], avatar = AVATARS[index];
  const [accent, light, dark] = zone.accent;
  const isIntro = index === 0;
  const prev = zones[(index + zones.length - 1) % zones.length], next = zones[(index + 1) % zones.length];

  const photo = avatar
    ? `<img src="${avatar.src}" alt="Ảnh của Nguyễn Thế Việt · ${esc(zone.name)}" style="object-position:${avatar.position}">`
    : ZONE_ICONS[index];

  const top = `<section class="sheet top">
    <div class="holes" aria-hidden="true"></div>
    <div class="left">
      <div class="idc"><div class="strap" aria-hidden="true"></div>
        <div class="card"><div class="ph${avatar ? ' photo' : ''}">${photo}</div><div class="cap">${esc(isIntro ? 'Nguyễn Thế Việt' : zone.place)}</div></div>
      </div>
      <div class="note"><h3>${isIntro ? 'Liên hệ' : 'Con số'}</h3>${isIntro ? contactRows() : statRows(d.note)}</div>
    </div>
    <div class="hello">
      <p class="script">${esc(d.script)}</p>
      <h2 class="big" id="dossier-title">${esc(d.title)}</h2>
      ${d.subtitle ? `<p class="sub">${esc(d.subtitle)}</p>` : ''}
      ${d.roles ? `<div class="roles">${d.roles.map((r) => `<span>${esc(r)}</span>`).join('')}</div>` : ''}
      ${paragraphs(d.lead)}
      ${isIntro ? `<div class="soc">${SOCIALS.map((s) => `<a href="${s.href}" ${external}><b aria-hidden="true">${esc(s.short)}</b>${esc(s.label)}</a>`).join('')}</div>` : ''}
      ${isIntro ? `<div class="stats">${d.stats.map(([v, l]) => `<div class="st"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>` : ''}
    </div>
  </section>`;

  const low = isIntro
    ? `<section class="sheet low"><div class="bclip" aria-hidden="true"></div>
        <div class="duo">
          <div class="box2"><h4>Điểm mạnh</h4><p>${highlight(d.strength)}</p></div>
          <div class="box2"><h4>Định hướng</h4>${d.goals.map(([k, v]) => `<p><b>${esc(k)}:</b> ${highlight(v)}</p>`).join('')}</div>
        </div>
        <h3 class="tag tools-title">Công cụ</h3>
        <ul class="tools">${TOOLS.map((t) => `<li class="tl"><i class="lg"><img src="logos/${t.id}.svg" alt="" width="36" height="36"></i>${esc(t.label)}</li>`).join('')}</ul>
        <p class="foot">${esc(d.updated)}</p>
      </section>`
    : `<section class="sheet low"><div class="bclip" aria-hidden="true"></div>
        <div class="lst">${d.groups.map(([title, entries]) => `${title ? `<h3 class="grh">${esc(title)}</h3>` : ''}${entries.map(entryCard).join('')}`).join('')}</div>
        ${gallery(index)}
      </section>`;

  return `<div class="dxw"><button class="dx" type="button" aria-label="Đóng hồ sơ">✕</button></div>
    <article class="board" style="--ac:${accent};--al:${light};--ad:${dark}" aria-labelledby="dossier-title">
      <div class="clip" aria-hidden="true"></div>${top}${low}
    </article>
    <nav class="docnav" aria-label="Chuyển khu">
      <button type="button" data-step="-1">← ${esc(prev.name)}</button>
      <button type="button" class="pri" data-step="1">Khu tiếp theo: ${esc(next.name)} →</button>
    </nav>`;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Hồ sơ dạng bìa kẹp phủ lên cảnh 3D (cảnh phía sau được làm mờ).
 * Chỉ cuộn lên xuống; chỉ đóng bằng nút ✕.
 */
export function createDossier(root, zones, { onClose, onNavigate }) {
  const inner = root.querySelector('#dossier-inner');
  let openIndex = -1;
  let returnFocus = null;

  function open(index) {
    openIndex = index;
    returnFocus = document.activeElement;
    inner.innerHTML = render(index, zones);
    root.hidden = false;
    root.scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-open')));
    setTimeout(() => root.querySelector('.dx')?.focus({ preventScroll: true }), 60);
  }

  function close() {
    if (openIndex < 0) return;
    openIndex = -1;
    root.classList.remove('is-open');
    setTimeout(() => { if (openIndex < 0) { root.hidden = true; inner.innerHTML = ''; } }, 380);
    returnFocus?.focus?.({ preventScroll: true });
    onClose();
  }

  root.addEventListener('click', (e) => {
    if (e.target.closest('.dx')) { close(); return; }
    const step = e.target.closest('[data-step]');
    if (step) {
      const target = (openIndex + Number(step.dataset.step) + zones.length) % zones.length;
      close();
      onNavigate(target);
    }
  });

  // Giữ tiêu điểm bàn phím bên trong hồ sơ khi đang mở.
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const items = [...root.querySelectorAll(FOCUSABLE)];
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  return { open, close, get isOpen() { return openIndex >= 0; } };
}
