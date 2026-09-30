import LZString from 'lz-string';

export const STORAGE_KEY = 'dmlite_shields_v2';
export const LAST_KEY = 'dmlite_last_shield_v2';
export const SCHEMA_VERSION = 3;

export const uid = (prefix = 'id') => `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
export const clone = value => globalThis.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const defaults = {
  theme: 'ember',
  fontScale: 1,
  background: '',
  backgroundOpacity: 0.2,
};

export function normalizeWidget(input = {}) {
  const w = { ...input };
  w.id = String(w.id || uid('widget'));
  w.type = w.type || 'note';
  w.title = w.title || 'Janela';
  w.x = Number.isFinite(Number(w.x)) ? Number(w.x) : 24;
  w.y = Number.isFinite(Number(w.y)) ? Number(w.y) : 24;
  w.w = Math.max(280, Number(w.w) || 380);
  w.h = Math.max(210, Number(w.h) || 320);
  w.z = Math.max(1, Number(w.z) || 1);
  w.minimized = !!w.minimized;
  w.locked = !!w.locked;

  if (w.type === 'note') {
    w.pages = Array.isArray(w.pages) && w.pages.length ? w.pages : [{ id: uid('page'), title: 'Página 1', content: '' }];
    w.activePageId = w.activePageId || w.pages[0].id;
    w.toolsHidden = !!w.toolsHidden;
  }
  if (w.type === 'dice') {
    w.result = w.result ?? '—';
    w.qty = Math.max(1, Number(w.qty) || 1);
    w.mod = Number(w.mod) || 0;
    w.formula = w.formula || '';
    w.history = Array.isArray(w.history) ? w.history.slice(0, 12) : [];
  }
  if (w.type === 'initiative') {
    w.round = Math.max(1, Number(w.round) || 1);
    w.combatants = Array.isArray(w.combatants) ? w.combatants.map(c => ({ id: c.id || uid('c'), name: c.name || 'Combatente', init: c.init ?? '', hp: c.hp ?? '', cond: c.cond ?? '' })) : [];
    w.activeId = w.activeId || w.combatants[0]?.id || null;
  }
  if (w.type === 'table') {
    w.rows = Array.isArray(w.rows) && w.rows.length ? w.rows : [['', ''], ['', '']];
    w.cellStyles = w.cellStyles && typeof w.cellStyles === 'object' ? w.cellStyles : {};
    w.selectedCell = null;
    w.struct = !!w.struct;
  }
  if (w.type === 'npc') w.npc = { name: 'Novo NPC', hp: 10, hpMax: 10, def: '', init: '', attack: '', damage: '', cond: '', notes: '', ...(w.npc || {}) };
  if (w.type === 'clock') w.clock = { name: 'Relógio', value: 0, max: 6, ...(w.clock || {}) };
  if (w.type === 'links') w.links = Array.isArray(w.links) ? w.links : [];
  if (w.type === 'image') { w.imageData = w.imageData || ''; w.zoom = Math.min(260, Math.max(40, Number(w.zoom) || 100)); }
  return w;
}

export function normalizeShield(input = {}) {
  const now = new Date().toISOString();
  const s = { ...input };
  s.id = String(s.id || uid('shield'));
  s.name = String(s.name || 'Novo Escudo');
  s.genre = String(s.genre || 'Genérico');
  s.system = s.system || 'generic';
  s.widgets = Array.isArray(s.widgets) ? s.widgets.map(normalizeWidget) : [];
  s.settings = { ...defaults, ...(s.settings || {}) };
  s.createdAt = s.createdAt || now;
  s.updatedAt = s.updatedAt || now;
  s.schemaVersion = SCHEMA_VERSION;
  return s;
}

export function loadShields() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(raw) ? raw.map(normalizeShield) : [];
  } catch { return []; }
}

export function saveShields(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function loadLastId() { return localStorage.getItem(LAST_KEY) || ''; }
export function saveLastId(id) { id ? localStorage.setItem(LAST_KEY, id) : localStorage.removeItem(LAST_KEY); }

export function shieldCode(shield) {
  const payload = { app: 'DM Lite', format: 'shield', version: 3, exportedAt: new Date().toISOString(), shield: { ...clone(normalizeShield(shield)), id: undefined } };
  return `DMLITE3:${LZString.compressToBase64(JSON.stringify(payload))}`;
}

function decodeBase64Utf8(s) {
  try {
    const bin = atob(s.replace(/\s/g, ''));
    return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  } catch { return ''; }
}

export function decodeShieldCode(code) {
  const raw = String(code || '').trim();
  let json = '';
  if (raw.startsWith('DMLITE3:')) json = LZString.decompressFromBase64(raw.slice(8)) || '';
  else if (raw.startsWith('DMLITE2:')) json = LZString.decompressFromBase64(raw.slice(8)) || '';
  else if (raw.startsWith('DMLITE1:')) json = decodeBase64Utf8(raw.slice(8));
  else if (raw.startsWith('{')) json = raw;
  if (!json) throw new Error('Código de escudo inválido.');
  return JSON.parse(json);
}

export function importShield(payload, existing = []) {
  const source = payload?.shield || payload;
  if (!source || typeof source !== 'object' || !Array.isArray(source.widgets)) throw new Error('Arquivo de escudo inválido.');
  const s = normalizeShield(source);
  s.id = uid('shield');
  const base = s.name || 'Escudo Importado';
  let name = base, n = 2;
  while (existing.some(x => x.name === name)) name = `${base} (${n++})`;
  s.name = name;
  s.createdAt = s.updatedAt = new Date().toISOString();
  return s;
}

export function downloadJson(shield) {
  const payload = { app: 'DM Lite', format: 'shield', version: 3, exportedAt: new Date().toISOString(), shield: normalizeShield(shield) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `DM_Lite_${String(shield.name || 'Escudo').replace(/[^a-z0-9_-]+/gi, '_')}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
