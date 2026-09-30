const THEME_KEY = 'dmlite_theme_pref_v2';
const LEGACY_SETTINGS_KEY = 'dmlite_v030_settings';
const ZOOM_V1 = 'dmlite_mini_pdf_zoom_v1';
const ZOOM_V2 = 'dmlite_mini_pdf_zoom_v2';
const PROD_MIGRATION_KEY = 'dmlite_prod_migration_054';
const PJ_LITE_URL = 'https://pjlite.vercel.app/';
const VERSION = '0.5.4 Alpha';

const THEME_MAP = {
  amber: 'dark',
  ember: 'dark',
  pjlite: 'default',
  default: 'default',
  dragonbane: 'classic',
  classic: 'classic',
  fabula: 'fabula',
  dnd: 'dnd',
  blue: '3det',
  '3det': '3det',
  purple: 'dark',
  emerald: 'classic',
  dark: 'dark',
  t20: 'tormenta20',
  tormenta20: 'tormenta20',
  ordem: 'ordem',
};

function readJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function migratePreferences() {
  if (!localStorage.getItem(THEME_KEY)) {
    const legacy = readJson(LEGACY_SETTINGS_KEY, {});
    const mapped = THEME_MAP[legacy?.theme] || 'default';
    localStorage.setItem(THEME_KEY, mapped);
  }

  if (!localStorage.getItem(ZOOM_V2) && localStorage.getItem(ZOOM_V1)) {
    const zoom = Math.max(50, Math.min(200, Number(localStorage.getItem(ZOOM_V1)) || 100));
    localStorage.setItem(ZOOM_V2, String(zoom));
  }

  if (!localStorage.getItem(PROD_MIGRATION_KEY)) {
    localStorage.setItem(PROD_MIGRATION_KEY, JSON.stringify({
      version: VERSION,
      migratedAt: new Date().toISOString(),
      keptSameOrigin: true,
    }));
  }
}

function syncOfficialLinks() {
  document.querySelectorAll('a[href]').forEach(anchor => {
    const href = anchor.getAttribute('href') || '';
    const text = anchor.textContent || '';
    if (/litetester1\.vercel\.app/i.test(href) || /PJ Lite/i.test(text)) {
      anchor.href = PJ_LITE_URL;
      anchor.target = '_blank';
      anchor.rel = 'noreferrer';
    }
  });
}

function syncVisibleVersion() {
  document.querySelectorAll('.brand-block small').forEach(el => {
    if (/alpha|0\.5\./i.test(el.textContent || '')) el.textContent = VERSION;
  });

  const notice = document.querySelector('.home .notice');
  if (notice) {
    const badge = notice.querySelector('b');
    const text = notice.querySelector('span');
    if (badge) badge.textContent = VERSION;
    if (text && !/migra/i.test(text.textContent || '')) {
      text.textContent = 'Nova base principal com migração automática dos saves antigos, integração oficial com o PJ Lite e compatibilidade preservada no mesmo domínio.';
    }
  }
}

function exposeMigrationStatus() {
  const marker = readJson('dmlite_migration_v4_done', null);
  window.DMLiteMigration = {
    version: VERSION,
    storageSchema: 4,
    migrated: !!marker?.done,
    marker,
    pjLite: PJ_LITE_URL,
  };
}

function syncAll() {
  syncOfficialLinks();
  syncVisibleVersion();
  exposeMigrationStatus();
}

export function installEnhancementsV058() {
  migratePreferences();
  syncAll();

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      syncAll();
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.getElementById('root') || document.body, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('dmlite-theme-change', schedule);
}
