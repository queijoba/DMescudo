const PDF_RECENTS_KEY = 'dmlite_pdf_recents_v1';

const SYSTEM_MATCHERS = [
  { id: 'dragonbane', label: 'Dragonbane', icon: '🐉', test: text => /dragonbane/i.test(text) },
  { id: 'dnd5e', label: 'D&D 5.5e', icon: '🐲', test: text => /d&d|dnd/i.test(text) },
  { id: 'fabula', label: 'Fabula Ultima', icon: '✨', test: text => /fabula/i.test(text) },
  { id: 'somdas6', label: 'O Som das Seis', icon: '🤠', test: text => /som das seis/i.test(text) },
  { id: '3det', label: '3DeT Victory', icon: '⭐', test: text => /3det|3de?t victory/i.test(text) },
];

function classifyPJCards(root = document) {
  root.querySelectorAll?.('.pj-card').forEach(card => {
    const text = card.textContent || '';
    const meta = SYSTEM_MATCHERS.find(item => item.test(text)) || { id: 'generic', label: 'PJ Lite', icon: '👤' };
    card.dataset.pjSystem = meta.id;
    card.dataset.pjLabel = meta.label;
    card.dataset.pjIcon = meta.icon;
  });
}

function normalizePdfUrl(input) {
  let value = String(input || '').trim();
  if (!value) return '';
  if (!/^[a-z]+:/i.test(value)) value = `https://${value}`;

  try {
    const url = new URL(value);
    if (url.hostname === 'drive.google.com') {
      const byPath = url.pathname.match(/\/file\/d\/([^/]+)/);
      const byQuery = url.searchParams.get('id');
      const id = byPath?.[1] || byQuery;
      if (id) return `https://drive.google.com/file/d/${id}/preview`;
    }
  } catch {
    return value;
  }

  return value;
}

function loadRecents() {
  try {
    const data = JSON.parse(localStorage.getItem(PDF_RECENTS_KEY) || '[]');
    return Array.isArray(data) ? data.slice(0, 8) : [];
  } catch {
    return [];
  }
}

function saveRecent(entry) {
  if (!entry?.url || entry.url.startsWith('blob:')) return;
  const rows = loadRecents().filter(row => row.url !== entry.url);
  rows.unshift({ name: entry.name || 'Material PDF', url: entry.url, at: Date.now() });
  localStorage.setItem(PDF_RECENTS_KEY, JSON.stringify(rows.slice(0, 8)));
}

function createPdfConsult() {
  if (document.getElementById('dmlite-pdf-consult')) return;

  const fab = document.createElement('button');
  fab.id = 'dmlite-pdf-fab';
  fab.className = 'dmlite-pdf-fab';
  fab.type = 'button';
  fab.innerHTML = '<span>📚</span><b>Materiais PDF</b>';
  fab.title = 'Abrir materiais em PDF';
  fab.hidden = true;

  const layer = document.createElement('div');
  layer.id = 'dmlite-pdf-consult';
  layer.className = 'dmlite-pdf-layer';
  layer.hidden = true;
  layer.innerHTML = `
    <section class="dmlite-pdf-modal" role="dialog" aria-modal="true" aria-label="Consulta de materiais PDF">
      <header class="dmlite-pdf-head">
        <div>
          <small>DM Lite · Consulta rápida</small>
          <h2>Materiais em PDF</h2>
        </div>
        <button type="button" data-pdf-close aria-label="Fechar">×</button>
      </header>
      <div class="dmlite-pdf-toolbar">
        <button type="button" class="pdf-action pdf-action--primary" data-pdf-file>📄 Abrir PDF do dispositivo</button>
        <input type="file" accept="application/pdf,.pdf" data-pdf-input hidden>
        <div class="dmlite-pdf-urlrow">
          <input type="text" data-pdf-url placeholder="URL direta ou link do Google Drive...">
          <button type="button" class="pdf-action" data-pdf-open-url>Abrir URL</button>
        </div>
        <button type="button" class="pdf-action" data-pdf-newtab disabled>Abrir em nova aba ↗</button>
      </div>
      <div class="dmlite-pdf-content">
        <aside class="dmlite-pdf-recents">
          <div class="dmlite-pdf-recents-head">
            <strong>Recentes</strong>
            <button type="button" data-pdf-clear>Limpar</button>
          </div>
          <div data-pdf-recents></div>
          <p>Links ficam salvos neste navegador. Arquivos locais valem apenas enquanto esta página estiver aberta.</p>
        </aside>
        <main class="dmlite-pdf-viewer" data-pdf-drop>
          <div class="dmlite-pdf-empty" data-pdf-empty>
            <span>📚</span>
            <h3>Consulte o material sem sair da mesa</h3>
            <p>Abra um PDF do dispositivo, cole uma URL ou um link de arquivo do Google Drive.</p>
            <small>No celular, se o navegador não renderizar o PDF dentro do DM Lite, use “Abrir em nova aba”.</small>
          </div>
          <iframe data-pdf-frame title="Visualizador de PDF" hidden></iframe>
        </main>
      </div>
      <footer class="dmlite-pdf-foot">
        <span data-pdf-name>Nenhum material aberto</span>
        <span>O DM Lite não envia o PDF para servidor próprio.</span>
      </footer>
    </section>`;

  document.body.append(fab, layer);

  const fileButton = layer.querySelector('[data-pdf-file]');
  const fileInput = layer.querySelector('[data-pdf-input]');
  const urlInput = layer.querySelector('[data-pdf-url]');
  const urlButton = layer.querySelector('[data-pdf-open-url]');
  const closeButton = layer.querySelector('[data-pdf-close]');
  const newTabButton = layer.querySelector('[data-pdf-newtab]');
  const clearButton = layer.querySelector('[data-pdf-clear]');
  const recentsBox = layer.querySelector('[data-pdf-recents]');
  const frame = layer.querySelector('[data-pdf-frame]');
  const empty = layer.querySelector('[data-pdf-empty]');
  const nameLabel = layer.querySelector('[data-pdf-name]');
  const drop = layer.querySelector('[data-pdf-drop]');

  let currentUrl = '';
  let objectUrl = '';

  const renderRecents = () => {
    const rows = loadRecents();
    recentsBox.innerHTML = '';
    if (!rows.length) {
      const none = document.createElement('div');
      none.className = 'pdf-recent-empty';
      none.textContent = 'Nenhum link recente.';
      recentsBox.appendChild(none);
      return;
    }
    rows.forEach(row => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pdf-recent-item';
      const strong = document.createElement('strong');
      strong.textContent = row.name || 'Material PDF';
      const small = document.createElement('small');
      small.textContent = row.url;
      button.append(strong, small);
      button.addEventListener('click', () => openPdf(row.url, row.name || 'Material PDF', false));
      recentsBox.appendChild(button);
    });
  };

  const openPdf = (url, name = 'Material PDF', remember = true) => {
    const normalized = normalizePdfUrl(url);
    if (!normalized) return;
    if (objectUrl && objectUrl !== normalized) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = '';
    }
    currentUrl = normalized;
    frame.src = normalized;
    frame.hidden = false;
    empty.hidden = true;
    nameLabel.textContent = name;
    newTabButton.disabled = false;
    if (remember) {
      saveRecent({ name, url: normalized });
      renderRecents();
    }
  };

  const openFile = file => {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name || '') && file.type !== 'application/pdf') return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    openPdf(objectUrl, file.name || 'PDF local', false);
  };

  const show = () => {
    layer.hidden = false;
    renderRecents();
    setTimeout(() => urlInput.focus(), 0);
  };
  const hide = () => { layer.hidden = true; };

  fab.addEventListener('click', show);
  closeButton.addEventListener('click', hide);
  layer.addEventListener('pointerdown', event => { if (event.target === layer) hide(); });
  fileButton.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => { openFile(fileInput.files?.[0]); fileInput.value = ''; });
  urlButton.addEventListener('click', () => {
    const url = normalizePdfUrl(urlInput.value);
    if (!url) return;
    let name = 'Material PDF';
    try {
      const parsed = new URL(url);
      name = parsed.hostname === 'drive.google.com' ? 'PDF do Google Drive' : decodeURIComponent(parsed.pathname.split('/').pop() || 'Material PDF');
    } catch {}
    openPdf(url, name, true);
  });
  urlInput.addEventListener('keydown', event => { if (event.key === 'Enter') urlButton.click(); });
  newTabButton.addEventListener('click', () => { if (currentUrl) window.open(currentUrl, '_blank', 'noopener,noreferrer'); });
  clearButton.addEventListener('click', () => { localStorage.removeItem(PDF_RECENTS_KEY); renderRecents(); });
  drop.addEventListener('dragover', event => { event.preventDefault(); drop.classList.add('is-dragging'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('is-dragging'));
  drop.addEventListener('drop', event => {
    event.preventDefault();
    drop.classList.remove('is-dragging');
    const file = event.dataTransfer?.files?.[0];
    if (file) openFile(file);
  });
  window.addEventListener('keydown', event => { if (event.key === 'Escape' && !layer.hidden) hide(); });
  window.addEventListener('beforeunload', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); });

  renderRecents();
}

function syncEnhancements() {
  classifyPJCards(document);
  const fab = document.getElementById('dmlite-pdf-fab');
  if (fab) fab.hidden = !document.querySelector('.editor.page-theme');
}

export function installEnhancements() {
  createPdfConsult();
  syncEnhancements();
  const observer = new MutationObserver(() => syncEnhancements());
  observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
}
