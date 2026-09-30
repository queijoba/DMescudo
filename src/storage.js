import LZString from 'lz-string';

export const STORAGE_KEY = 'dmlite_shields_v2';
export const LAST_KEY = 'dmlite_last_shield_v2';
export const LEGACY_STORAGE_KEY = 'dmlite_shields_v1';
export const LEGACY_LAST_KEY = 'dmlite_current_shield_v1';
export const LEGACY_LAYOUT_KEY = 'dmlite_v030_layout';
export const LEGACY_SETTINGS_KEY = 'dmlite_v030_settings';
export const MIGRATION_KEY = 'dmlite_migration_v4_done';
export const SCHEMA_VERSION = 4;

export const uid = (prefix = 'id') => `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
export const clone = value => globalThis.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const defaults = {
  theme: 'dark',
  fontScale: 1,
  background: '',
  backgroundOpacity: 0.2,
};

const THEME_ALIASES = {
  amber: 'dark',
  ember: 'dark',
  pjlite: 'dark',
  default: 'dark',
  classic: 'dragonbane',
  emerald: 'dragonbane',
  blue: '3det',
  purple: 'dark',
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === '') return clone(fallback);
    return JSON.parse(raw);
  } catch {
    return clone(fallback);
  }
}

function normalizeLegacySettings(input = {}) {
  const incoming = { ...(input || {}) };
  const theme = THEME_ALIASES[incoming.theme] || incoming.theme || defaults.theme;

  let fontScale = Number(incoming.fontScale);
  if (!Number.isFinite(fontScale) && Number.isFinite(Number(incoming.fontSize))) {
    fontScale = Number(incoming.fontSize) / 16;
  }
  if (!Number.isFinite(fontScale)) fontScale = defaults.fontScale;
  fontScale = Math.max(0.75, Math.min(1.5, fontScale));

  let backgroundOpacity = Number(incoming.backgroundOpacity);
  if (!Number.isFinite(backgroundOpacity) && Number.isFinite(Number(incoming.opacity))) {
    backgroundOpacity = Number(incoming.opacity) / 100;
  }
  if (!Number.isFinite(backgroundOpacity)) backgroundOpacity = defaults.backgroundOpacity;
  backgroundOpacity = Math.max(0, Math.min(1, backgroundOpacity));

  let background = typeof incoming.background === 'string' ? incoming.background : '';
  if (!background) {
    if (incoming.bgType === 'image' && incoming.bgValue) background = String(incoming.bgValue);
    else if (incoming.bgType === 'custom' && incoming.customBgColor) background = String(incoming.customBgColor);
  }

  return {
    ...incoming,
    theme,
    fontScale,
    background,
    backgroundOpacity,
  };
}

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
    w.pages = Array.isArray(w.pages) && w.pages.length ? w.pages.map(page => ({
      id: String(page?.id || uid('page')),
      title: String(page?.title || 'Página'),
      content: typeof page?.content === 'string' ? page.content : '',
    })) : [{ id: uid('page'), title: 'Página 1', content: '' }];
    w.activePageId = String(w.activePageId || w.pages[0].id);
    if (!w.pages.some(page => page.id === w.activePageId)) w.activePageId = w.pages[0].id;
    w.toolsHidden = !!w.toolsHidden || !!w.noteToolsHidden;
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
    w.combatants = Array.isArray(w.combatants) ? w.combatants.map(c => ({
      id: String(c?.id || uid('c')),
      name: c?.name || 'Combatente',
      init: c?.init ?? '',
      hp: c?.hp ?? '',
      cond: c?.cond ?? '',
    })) : [];
    w.activeId = w.activeId ? String(w.activeId) : w.combatants[0]?.id || null;
    if (w.activeId && !w.combatants.some(c => c.id === w.activeId)) w.activeId = w.combatants[0]?.id || null;
  }
  if (w.type === 'table') {
    w.rows = Array.isArray(w.rows) && w.rows.length ? w.rows.map(row => Array.isArray(row) ? row.map(cell => String(cell ?? '')) : ['']) : [['', ''], ['', '']];
    w.cellStyles = w.cellStyles && typeof w.cellStyles === 'object' ? w.cellStyles : {};
    w.selectedCell = null;
    w.struct = !!w.struct;
  }
  if (w.type === 'npc') w.npc = { name: 'Novo NPC', hp: 10, hpMax: 10, def: '', init: '', attack: '', damage: '', cond: '', notes: '', ...(w.npc || {}) };
  if (w.type === 'clock') {
    w.clock = { name: 'Relógio', value: 0, max: 6, ...(w.clock || {}) };
    w.clock.max = Math.max(1, Number(w.clock.max) || 6);
    w.clock.value = Math.max(0, Math.min(w.clock.max, Number(w.clock.value) || 0));
  }
  if (w.type === 'links') w.links = Array.isArray(w.links) ? w.links.map(link => ({ ...link, id: String(link?.id || uid('link')) })) : [];
  if (w.type === 'image') {
    w.imageData = w.imageData || w.src || '';
    w.zoom = Math.min(260, Math.max(40, Number(w.zoom) || 100));
  }
  if (w.type === 'pj' && !w.quick && w.pjData) w.quick = null;
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
  s.settings = { ...defaults, ...normalizeLegacySettings(s.settings || {}) };
  s.createdAt = s.createdAt || now;
  s.updatedAt = s.updatedAt || now;
  s.schemaVersion = SCHEMA_VERSION;
  return s;
}

function parseList(key) {
  const raw = readJson(key, []);
  return Array.isArray(raw) ? raw : [];
}

function legacyLastId() {
  const raw = localStorage.getItem(LEGACY_LAST_KEY);
  if (!raw) return '';
  try {
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? '' : String(parsed);
  } catch {
    return String(raw).replace(/^"|"$/g, '');
  }
}

function shieldFingerprint(shield) {
  return `${String(shield.id)}::${String(shield.name)}::${String(shield.createdAt || '')}`;
}

function migrateAllLegacyData() {
  const current = parseList(STORAGE_KEY).map(normalizeShield);
  const legacy = parseList(LEGACY_STORAGE_KEY).map(normalizeShield);
  const byId = new Map(current.map(s => [String(s.id), s]));

  for (const shield of legacy) {
    if (!byId.has(String(shield.id))) byId.set(String(shield.id), shield);
  }

  let merged = [...byId.values()];

  // Algumas versões 0.3.x salvavam a mesa aberta também em chaves soltas.
  // Se não houver nenhum escudo estruturado, recuperamos essa mesa em vez de perder dados.
  if (!merged.length) {
    const looseWidgets = parseList(LEGACY_LAYOUT_KEY);
    if (looseWidgets.length) {
      const looseSettings = readJson(LEGACY_SETTINGS_KEY, {});
      const recovered = normalizeShield({
        id: `recovered-${Date.now()}`,
        name: 'Mesa Recuperada 0.3.x',
        genre: 'Genérico',
        system: 'generic',
        widgets: looseWidgets,
        settings: looseSettings,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      merged = [recovered];
    }
  }

  // Evita duplicações caso o usuário já tenha passado por uma migração parcial.
  const seen = new Set();
  merged = merged.filter(shield => {
    const key = shieldFingerprint(shield);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    const oldLast = legacyLastId();
    const chosenLast = oldLast && merged.some(s => String(s.id) === oldLast)
      ? oldLast
      : merged[0]?.id || '';
    if (!localStorage.getItem(LAST_KEY) && chosenLast) localStorage.setItem(LAST_KEY, String(chosenLast));
    localStorage.setItem(MIGRATION_KEY, JSON.stringify({
      done: true,
      schema: SCHEMA_VERSION,
      migratedAt: new Date().toISOString(),
      legacyShields: legacy.length,
      totalShields: merged.length,
    }));
  } catch {
    // Não apagamos nenhuma chave antiga: se o navegador estiver sem espaço,
    // o app ainda consegue reler o formato legado na próxima abertura.
  }

  return merged;
}

export function loadShields() {
  const current = parseList(STORAGE_KEY);
  const migrationDone = readJson(MIGRATION_KEY, null);

  // Mesmo se já existir v2, fazemos uma única passagem de reconciliação com v1.
  // Isso cobre usuários que abriram builds intermediárias durante a homologação.
  if (!migrationDone || Number(migrationDone.schema) < SCHEMA_VERSION) {
    return migrateAllLegacyData().map(normalizeShield);
  }

  if (current.length) return current.map(normalizeShield);

  const legacy = parseList(LEGACY_STORAGE_KEY);
  if (legacy.length) return migrateAllLegacyData().map(normalizeShield);

  const loose = parseList(LEGACY_LAYOUT_KEY);
  if (loose.length) return migrateAllLegacyData().map(normalizeShield);

  return [];
}

export function saveShields(list) {
  const normalized = Array.isArray(list) ? list.map(normalizeShield) : [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export function loadLastId() {
  const current = localStorage.getItem(LAST_KEY);
  if (current) return String(current);
  return legacyLastId();
}

export function saveLastId(id) {
  if (id) localStorage.setItem(LAST_KEY, String(id));
  else localStorage.removeItem(LAST_KEY);
}

export function shieldCode(shield) {
  const payload = {
    app: 'DM Lite',
    format: 'shield',
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    shield: { ...clone(normalizeShield(shield)), id: undefined },
  };
  return `DMLITE3:${LZString.compressToBase64(JSON.stringify(payload))}`;
}

function decodeBase64Utf8(s) {
  try {
    const bin = atob(s.replace(/\s/g, ''));
    return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  } catch {
    return '';
  }
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
  let name = base;
  let n = 2;
  while (existing.some(x => x.name === name)) name = `${base} (${n++})`;
  s.name = name;
  s.createdAt = s.updatedAt = new Date().toISOString();
  return s;
}

export function downloadJson(shield) {
  const payload = {
    app: 'DM Lite',
    format: 'shield',
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    shield: normalizeShield(shield),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `DM_Lite_${String(shield.name || 'Escudo').replace(/[^a-z0-9_-]+/gi, '_')}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
