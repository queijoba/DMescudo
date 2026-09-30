const MINI_ZOOM_KEY = 'dmlite_mini_pdf_zoom_v2';
const THEME_KEY = 'dmlite_theme_pref_v2';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function hexToRgb(value) {
  const raw = String(value || '').trim();
  const short = raw.match(/^#([0-9a-f]{3})$/i);
  const full = raw.match(/^#([0-9a-f]{6})$/i);
  if (short) {
    const h = short[1];
    return [0, 1, 2].map(i => parseInt(h[i] + h[i], 16));
  }
  if (full) {
    const h = full[1];
    return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  }
  const rgb = raw.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : null;
}

function luminance(value) {
  const rgb = hexToRgb(value);
  if (!rgb) return .5;
  const channels = rgb.map(v => {
    const n = v / 255;
    return n <= .03928 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
  });
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
}

function contrastText(value) {
  return luminance(value) > .42 ? '#16181d' : '#ffffff';
}

function readVar(style, name, fallback = '') {
  return style.getPropertyValue(name).trim() || fallback;
}

function syncThemeAudit() {
  const root = $('.editor.page-theme') || $('.home.page-theme');
  if (!root) return;
  const cs = getComputedStyle(root);
  const values = {
    bg: readVar(cs, '--bg', readVar(cs, '--home-bg', '#e5e7eb')),
    panel: readVar(cs, '--panel', readVar(cs, '--home-paper', '#ffffff')),
    panel2: readVar(cs, '--panel2', '#f3f4f6'),
    header: readVar(cs, '--header', readVar(cs, '--home-top', '#1f2937')),
    border: readVar(cs, '--border', readVar(cs, '--home-line', '#cbd5e1')),
    text: readVar(cs, '--text', readVar(cs, '--home-ink', '#1f2937')),
    muted: readVar(cs, '--muted', readVar(cs, '--home-muted', '#64748b')),
    accent: readVar(cs, '--accent', readVar(cs, '--home-accent', '#b52222')),
    input: readVar(cs, '--input', '#ffffff'),
    paper: readVar(cs, '--paper', '#ffffff'),
  };
  const tone = luminance(values.bg) < .28 || luminance(values.panel) < .24 ? 'dark' : 'light';
  const onHeader = contrastText(values.header);
  const onAccent = contrastText(values.accent);
  root.dataset.dmTone = tone;
  document.body.dataset.dmTone = tone;
  document.body.dataset.dmTheme = localStorage.getItem(THEME_KEY) || root.dataset.dmTheme || 'default';
  document.documentElement.style.colorScheme = tone;

  const targets = [root, document.body];
  targets.forEach(el => {
    el.style.setProperty('--dm-bg', values.bg);
    el.style.setProperty('--dm-panel', values.panel);
    el.style.setProperty('--dm-panel2', values.panel2);
    el.style.setProperty('--dm-header', values.header);
    el.style.setProperty('--dm-border', values.border);
    el.style.setProperty('--dm-text', values.text);
    el.style.setProperty('--dm-muted', values.muted);
    el.style.setProperty('--dm-accent', values.accent);
    el.style.setProperty('--dm-input', values.input);
    el.style.setProperty('--dm-paper', values.paper);
    el.style.setProperty('--dm-on-header', onHeader);
    el.style.setProperty('--dm-on-accent', onAccent);
    el.style.setProperty('--on-header', onHeader);
    el.style.setProperty('--on-accent', onAccent);
  });
}

function getZoom() {
  const value = Number(localStorage.getItem(MINI_ZOOM_KEY));
  return Number.isFinite(value) ? Math.max(50, Math.min(200, value)) : 100;
}

function stripPdfZoom(url) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  const hashIndex = raw.indexOf('#');
  if (hashIndex < 0) return raw;
  const base = raw.slice(0, hashIndex);
  const hash = raw.slice(hashIndex + 1);
  const parts = hash.split('&').filter(Boolean).filter(part => !/^zoom=/i.test(part));
  return parts.length ? `${base}#${parts.join('&')}` : base;
}

function withNativePdfZoom(url, zoom) {
  const source = stripPdfZoom(url);
  if (!source) return '';
  const hashIndex = source.indexOf('#');
  if (hashIndex < 0) return `${source}#zoom=${zoom}`;
  const base = source.slice(0, hashIndex);
  const hash = source.slice(hashIndex + 1);
  return `${base}#${hash}${hash ? '&' : ''}zoom=${zoom}`;
}

function setZoom(panel, value) {
  const zoom = Math.max(50, Math.min(200, Math.round(Number(value) || 100)));
  panel.dataset.pdfZoom = String(zoom);
  localStorage.setItem(MINI_ZOOM_KEY, String(zoom));
  const frame = $('iframe', panel);
  const label = $('[data-dm56-zoom-label]', panel);
  const slider = $('[data-dm56-zoom-range]', panel);
  if (label) label.textContent = `${zoom}%`;
  if (slider) slider.value = String(zoom);
  if (!frame) return;

  // Não ampliamos o iframe por CSS: isso rasterizava a visualização já pronta e
  // deixava letras e linhas borradas. O zoom é enviado ao visualizador PDF do
  // navegador pelo fragmento #zoom=, que rerenderiza o documento na escala nova.
  frame.style.transform = 'none';
  frame.style.transformOrigin = '';
  frame.style.width = '100%';
  frame.style.height = '100%';

  const current = frame.getAttribute('src') || '';
  const panelSource = panel.dataset.currentUrl || '';
  const source = stripPdfZoom(frame.dataset.pdfSource || panelSource || current);
  if (!source) return;
  frame.dataset.pdfSource = source;
  const next = withNativePdfZoom(source, zoom);
  if (current !== next) frame.setAttribute('src', next);
}

function enhanceMiniPdf() {
  const panel = $('#dm55-mini') || $('#dm54-mini-pdf');
  if (!panel) return;
  const frame = $('iframe', panel);
  if (frame) {
    const current = frame.getAttribute('src') || '';
    if (current && !frame.dataset.pdfSource) frame.dataset.pdfSource = stripPdfZoom(current);
  }
  if (!panel.dataset.dm56ZoomReady) {
    panel.dataset.dm56ZoomReady = '1';
    const controls = $('.dm54-mini-controls', panel);
    const view = $('.dm54-mini-view', panel);
    const bar = document.createElement('div');
    bar.className = 'dm56-mini-zoom';
    bar.innerHTML = `
      <span>Zoom</span>
      <button type="button" data-dm56-zoom-out title="Diminuir zoom">−</button>
      <input data-dm56-zoom-range type="range" min="50" max="200" step="10" aria-label="Zoom do PDF Mini">
      <button type="button" data-dm56-zoom-in title="Aumentar zoom">＋</button>
      <button type="button" data-dm56-zoom-label title="Restaurar 100%">100%</button>`;
    if (controls) controls.after(bar); else panel.querySelector('header')?.after(bar);
    $('[data-dm56-zoom-out]', bar).onclick = () => setZoom(panel, Number(panel.dataset.pdfZoom || getZoom()) - 10);
    $('[data-dm56-zoom-in]', bar).onclick = () => setZoom(panel, Number(panel.dataset.pdfZoom || getZoom()) + 10);
    $('[data-dm56-zoom-label]', bar).onclick = () => setZoom(panel, 100);
    $('[data-dm56-zoom-range]', bar).oninput = e => setZoom(panel, e.currentTarget.value);
    if (view) {
      view.addEventListener('wheel', e => {
        if (!e.ctrlKey) return;
        e.preventDefault();
        setZoom(panel, Number(panel.dataset.pdfZoom || getZoom()) + (e.deltaY < 0 ? 10 : -10));
      }, { passive: false });
    }
  }
  setZoom(panel, Number(panel.dataset.pdfZoom || getZoom()));
}

function cleanupDuplicateControls() {
  const homeNav = $('.home .pjlite-top nav');
  if (homeNav) {
    const pjLinks = $$('a', homeNav).filter(a => /Conferir PJ Lite/i.test(a.textContent || ''));
    pjLinks.slice(1).forEach(el => el.remove());
    const about = $$('button', homeNav).filter(b => /Sobre & Atualizações/i.test(b.textContent || ''));
    about.slice(1).forEach(el => el.remove());
  }
  const top = $('.editor .top-actions');
  if (top) {
    const mini = $$('button', top).filter(b => /PDF Mini/i.test(b.textContent || ''));
    mini.slice(1).forEach(el => el.remove());
    const pj = $$('a', top).filter(a => /PJ Lite/i.test(a.textContent || ''));
    pj.slice(1).forEach(el => el.remove());
  }
}

function reviewLayout() {
  const editor = $('.editor.page-theme');
  if (editor) {
    const board = $('.board-wrap', editor);
    if (board) board.setAttribute('aria-label', 'Área do escudo do mestre');
    $$('.widget', editor).forEach(widget => {
      if (!widget.hasAttribute('role')) widget.setAttribute('role', 'region');
      const title = $('.widget-head input', widget)?.value || 'Janela do mestre';
      widget.setAttribute('aria-label', title);
    });
  }
}

function syncAll() {
  syncThemeAudit();
  enhanceMiniPdf();
  cleanupDuplicateControls();
  reviewLayout();
}

export function installEnhancementsV056() {
  syncAll();
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; syncAll(); });
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document.getElementById('root') || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'data-dm-theme', 'src'],
  });
  window.addEventListener('dmlite-theme-change', schedule);
  window.addEventListener('storage', e => { if (e.key === THEME_KEY || e.key === MINI_ZOOM_KEY) schedule(); });
  window.addEventListener('resize', schedule, { passive: true });
}
