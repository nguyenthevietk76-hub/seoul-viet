const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Chèn chữ vào HTML an toàn. */
export const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ENTITIES[ch]);
