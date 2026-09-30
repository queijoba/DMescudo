const PDF_RECENTS_KEY = 'dmlite_pdf_recents_v1';
const HOME_THEME_KEY = 'dmlite_home_theme_v1';
const HOME_VIEW_KEY = 'dmlite_home_view_v1';

const SYSTEM_MATCHERS = [
  { id: 'dragonbane', label: 'Dragonbane', icon: '🐉', test: text => /dragonbane/i.test(text) },
  { id: 'dnd5e', label: 'D&D 5.5e', icon: '🐲', test: text => /d&d|dnd/i.test(text) },
  { id: 'fabula', label: 'Fabula Ultima', icon: '✨', test: text => /fabula/i.test(text) },
  { id: 'somdas6', label: 'O Som das Seis', icon: '🤠', test: text => /som das seis/i.test(text) },
  { id: '3det', label: '3DeT Victory', icon: '⭐', test: text => /3det|3de?t victory/i.test(text) },
  { id: 'tormenta20', label: 'Tormenta20', icon: '⚡', test: text => /tormenta/i.test(text) },
  { id: 'ordem', label: 'Ordem Paranormal', icon: '◉', test: text => /ordem paranormal|ordem/i.test(text) },
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
  } catch { return value; }
  return value;
}

function loadRecents() {
  try {
    const data = JSON.parse(localStorage.getItem(PDF_RECENTS_KEY) || '[]');
    return Array.isArray(data) ? data.slice(0, 8) : [];
  } catch { return []; }
}
function saveRecent(entry) {
  if (!entry?.url || entry.url.startsWith('blob:')) return;
  const rows = loadRecents().filter(row => row.url !== entry.url);
  rows.unshift({ name: entry.name || 'Material PDF', url: entry.url, at: Date.now() });
  localStorage.setItem(PDF_RECENTS_KEY, JSON.stringify(rows.slice(0, 8)));
}

function createPdfConsult() {
  if (document.getElementById('dmlite-pdf-consult')) return;
  const parking = document.createElement('div');
  parking.id = 'dmlite-global-tools';
  parking.hidden = true;

  const button = document.createElement('button');
  button.id = 'dmlite-pdf-fab';
  button.className = 'ui-btn dmlite-pdf-nav';
  button.type = 'button';
  button.innerHTML = '<span>📚</span><b>PDFs</b>';
  button.title = 'Consultar materiais em PDF';
  button.hidden = true;

  const layer = document.createElement('div');
  layer.id = 'dmlite-pdf-consult';
  layer.className = 'dmlite-pdf-layer';
  layer.hidden = true;
  layer.innerHTML = `
    <section class="dmlite-pdf-modal" role="dialog" aria-modal="true" aria-label="Consulta de materiais PDF">
      <header class="dmlite-pdf-head">
        <div><small>DM Lite · Consulta rápida</small><h2>Materiais em PDF</h2></div>
        <button type="button" data-pdf-close aria-label="Fechar">×</button>
      </header>
      <div class="dmlite-pdf-toolbar">
        <button type="button" class="pdf-action pdf-action--primary" data-pdf-file>📄 Abrir PDF do dispositivo</button>
        <input type="file" accept="application/pdf,.pdf" data-pdf-input hidden>
        <div class="dmlite-pdf-urlrow"><input type="text" data-pdf-url placeholder="URL direta ou link do Google Drive..."><button type="button" class="pdf-action" data-pdf-open-url>Abrir URL</button></div>
        <button type="button" class="pdf-action" data-pdf-newtab disabled>Abrir em nova aba ↗</button>
      </div>
      <div class="dmlite-pdf-content">
        <aside class="dmlite-pdf-recents">
          <div class="dmlite-pdf-recents-head"><strong>Recentes</strong><button type="button" data-pdf-clear>Limpar</button></div>
          <div data-pdf-recents></div>
          <p>Links ficam salvos neste navegador. PDFs locais ficam somente nesta sessão.</p>
        </aside>
        <main class="dmlite-pdf-viewer" data-pdf-drop>
          <div class="dmlite-pdf-empty" data-pdf-empty><span>📚</span><h3>Consulte sem sair do escudo</h3><p>Abra um PDF do dispositivo ou cole um link direto/Google Drive.</p><small>Se o navegador não mostrar o PDF dentro do DM Lite, use “Abrir em nova aba”.</small></div>
          <iframe data-pdf-frame title="Visualizador de PDF" hidden></iframe>
        </main>
      </div>
      <footer class="dmlite-pdf-foot"><span data-pdf-name>Nenhum material aberto</span><span>O arquivo não é enviado para servidor próprio do DM Lite.</span></footer>
    </section>`;

  parking.appendChild(button);
  document.body.append(parking, layer);

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
  let currentUrl = '', objectUrl = '';

  const renderRecents = () => {
    const rows = loadRecents(); recentsBox.innerHTML = '';
    if (!rows.length) { const none = document.createElement('div'); none.className = 'pdf-recent-empty'; none.textContent = 'Nenhum link recente.'; recentsBox.appendChild(none); return; }
    rows.forEach(row => { const item = document.createElement('button'); item.type = 'button'; item.className = 'pdf-recent-item'; const strong = document.createElement('strong'); strong.textContent = row.name || 'Material PDF'; const small = document.createElement('small'); small.textContent = row.url; item.append(strong, small); item.addEventListener('click', () => openPdf(row.url, row.name, false)); recentsBox.appendChild(item); });
  };
  const openPdf = (url, name = 'Material PDF', remember = true) => {
    const normalized = normalizePdfUrl(url); if (!normalized) return;
    if (objectUrl && objectUrl !== normalized) { URL.revokeObjectURL(objectUrl); objectUrl = ''; }
    currentUrl = normalized; frame.src = normalized; frame.hidden = false; empty.hidden = true; nameLabel.textContent = name; newTabButton.disabled = false;
    if (remember) { saveRecent({ name, url: normalized }); renderRecents(); }
  };
  const openFile = file => { if (!file || (!/\.pdf$/i.test(file.name || '') && file.type !== 'application/pdf')) return; if (objectUrl) URL.revokeObjectURL(objectUrl); objectUrl = URL.createObjectURL(file); openPdf(objectUrl, file.name || 'PDF local', false); };
  const show = () => { layer.hidden = false; renderRecents(); setTimeout(() => urlInput.focus(), 0); };
  const hide = () => { layer.hidden = true; };
  button.addEventListener('click', show); closeButton.addEventListener('click', hide); layer.addEventListener('pointerdown', e => { if (e.target === layer) hide(); });
  fileButton.addEventListener('click', () => fileInput.click()); fileInput.addEventListener('change', () => { openFile(fileInput.files?.[0]); fileInput.value = ''; });
  urlButton.addEventListener('click', () => { const url = normalizePdfUrl(urlInput.value); if (!url) return; let name = 'Material PDF'; try { const parsed = new URL(url); name = parsed.hostname === 'drive.google.com' ? 'PDF do Google Drive' : decodeURIComponent(parsed.pathname.split('/').pop() || 'Material PDF'); } catch {} openPdf(url, name, true); });
  urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') urlButton.click(); }); newTabButton.addEventListener('click', () => { if (currentUrl) window.open(currentUrl, '_blank', 'noopener,noreferrer'); });
  clearButton.addEventListener('click', () => { localStorage.removeItem(PDF_RECENTS_KEY); renderRecents(); });
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('is-dragging'); }); drop.addEventListener('dragleave', () => drop.classList.remove('is-dragging')); drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('is-dragging'); openFile(e.dataTransfer?.files?.[0]); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !layer.hidden) hide(); }); window.addEventListener('beforeunload', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); });
  renderRecents();
}

function createGuide() {
  if (document.getElementById('dmlite-guide-layer')) return;
  const layer = document.createElement('div');
  layer.id = 'dmlite-guide-layer'; layer.className = 'dmlite-guide-layer'; layer.hidden = true;
  layer.innerHTML = `
    <section class="dmlite-guide-modal" role="dialog" aria-modal="true" aria-label="Guias e Tutoriais">
      <header><div><small>DM Lite · Ajuda</small><h2>Guias e Tutoriais</h2></div><button type="button" data-guide-close>×</button></header>
      <div class="dmlite-guide-layout">
        <nav class="dmlite-guide-nav">
          <button class="is-active" data-guide-tab="start">Começando</button>
          <button data-guide-tab="shield">Escudos</button>
          <button data-guide-tab="windows">Janelas</button>
          <button data-guide-tab="pj">PJ Lite</button>
          <button data-guide-tab="pdf">PDFs</button>
          <button data-guide-tab="mobile">Celular</button>
          <button data-guide-tab="save">Saves</button>
        </nav>
        <div class="dmlite-guide-content">
          <article data-guide-panel="start"><h3>O que é o DM Lite?</h3><p>É um escudo digital para o Mestre. Ele organiza informações rápidas da sessão sem tentar virar um VTT completo.</p><ol><li>Crie ou abra um escudo.</li><li>Adicione apenas as janelas que usa na mesa.</li><li>Importe fichas do PJ Lite quando precisar acompanhar personagens.</li><li>Use PDFs como consulta sem misturar o livro com o save.</li></ol></article>
          <article data-guide-panel="shield" hidden><h3>Criar e abrir um escudo</h3><p>Em <b>Novo Escudo</b>, você pode começar em branco ou escolher um escudo pronto. Escolha o modelo, ajuste nome e gênero se quiser e clique em <b>Criar e abrir</b>.</p><p>Na Home, o cartão inteiro do escudo também pode ser clicado para abrir a mesa.</p></article>
          <article data-guide-panel="windows" hidden><h3>Janelas do Mestre</h3><p>Notas, Iniciativa, Dados, Tabela, NPC, Relógio, Links e Imagens podem ser adicionados pela barra de ferramentas. No desktop, arraste pelo cabeçalho e redimensione pelo canto. No celular, as janelas viram uma pilha.</p></article>
          <article data-guide-panel="pj" hidden><h3>Fichas do PJ Lite</h3><p>Use <b>PJ Lite</b> dentro do escudo. O DM Lite aceita o Código da Ficha e arquivos ZIP/JSON exportados pelo PJ Lite atual. A mini ficha muda de visual conforme o sistema.</p></article>
          <article data-guide-panel="pdf" hidden><h3>Consultar PDFs</h3><p>O botão <b>📚 PDFs</b> fica na barra superior do escudo. Ele abre PDFs locais ou links, inclusive Google Drive. PDFs locais não entram no save para evitar arquivos gigantes no navegador.</p></article>
          <article data-guide-panel="mobile" hidden><h3>Uso no celular</h3><p>No celular, o DM Lite organiza as janelas verticalmente. Use ↑ e ↓ para mudar a ordem e □ para focar uma janela em quase toda a tela.</p></article>
          <article data-guide-panel="save" hidden><h3>Salvar, importar e compartilhar</h3><p>O DM Lite salva automaticamente no navegador. Para backup ou transferência, use JSON ou Código DM Lite. Excluir escudos e itens importantes oferece Desfazer quando aplicável.</p></article>
        </div>
      </div>
    </section>`;
  document.body.appendChild(layer);
  const close = () => { layer.hidden = true; };
  layer.querySelector('[data-guide-close]').addEventListener('click', close); layer.addEventListener('pointerdown', e => { if (e.target === layer) close(); });
  layer.querySelectorAll('[data-guide-tab]').forEach(btn => btn.addEventListener('click', () => { layer.querySelectorAll('[data-guide-tab]').forEach(x => x.classList.toggle('is-active', x === btn)); layer.querySelectorAll('[data-guide-panel]').forEach(panel => { panel.hidden = panel.dataset.guidePanel !== btn.dataset.guideTab; }); }));
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !layer.hidden) close(); });
}

function openGuide() { const layer = document.getElementById('dmlite-guide-layer'); if (layer) layer.hidden = false; }

function enhanceHome() {
  const home = document.querySelector('.home.page-theme'); if (!home) return;
  const shell = home.querySelector('.home-shell'); if (!shell) return;
  const savedTheme = localStorage.getItem(HOME_THEME_KEY) || 'default'; home.dataset.homeTheme = savedTheme;

  if (!shell.querySelector('.dmlite-home-tools')) {
    const tools = document.createElement('section'); tools.className = 'dmlite-home-tools';
    tools.innerHTML = `<label class="dmlite-home-theme"><span>🎨</span><select><option value="default">Tema: Padrão</option><option value="dark">Tema: Escuro</option><option value="dragonbane">Tema: Dragonbane</option><option value="dnd">Tema: D&D</option></select></label><button type="button" class="dmlite-guide-button">❔ Guias e Tutoriais</button>`;
    shell.prepend(tools);
    const select = tools.querySelector('select'); select.value = savedTheme;
    select.addEventListener('change', () => { home.dataset.homeTheme = select.value; localStorage.setItem(HOME_THEME_KEY, select.value); });
    tools.querySelector('.dmlite-guide-button').addEventListener('click', openGuide);
  }

  const notice = shell.querySelector('.notice');
  if (notice && !notice.querySelector('.dmlite-update-toggle')) {
    const toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'dmlite-update-toggle'; toggle.textContent = '+'; toggle.title = 'Mostrar detalhes';
    const extra = document.createElement('div'); extra.className = 'dmlite-update-extra'; extra.hidden = true; extra.innerHTML = `<p><b>Projeto:</b> Home aproximada do PJ Lite, guia integrado, fichas em miniatura por sistema e consulta de PDFs na barra do escudo.</p><p><b>Uso:</b> os escudos prontos continuam sendo resumos de consulta; livros e PDFs completos ficam separados como material de apoio.</p>`;
    toggle.addEventListener('click', () => { extra.hidden = !extra.hidden; toggle.textContent = extra.hidden ? '+' : '−'; toggle.title = extra.hidden ? 'Mostrar detalhes' : 'Ocultar detalhes'; });
    notice.append(toggle, extra);
  }

  const bar = shell.querySelector('.library-bar');
  if (bar && !bar.querySelector('.dmlite-library-actions')) {
    const search = bar.querySelector('.search');
    const actions = document.createElement('div'); actions.className = 'dmlite-library-actions';
    actions.innerHTML = `<button type="button" data-home-filter>⚙ Filtros</button><button type="button" data-view="grid" class="is-active" title="Grade">▦</button><button type="button" data-view="list" title="Lista">☰</button>`;
    if (search) search.after(actions); else bar.appendChild(actions);
    const filterPanel = document.createElement('div'); filterPanel.className = 'dmlite-filter-panel'; filterPanel.hidden = true; filterPanel.innerHTML = `<label>Sistema<select><option value="">Todos</option><option>Dragonbane</option><option>D&D 5.5e</option><option>Fabula Ultima</option><option>Tormenta20</option><option>Ordem Paranormal</option><option>3DeT Victory</option><option>3D&T Alpha</option></select></label>`;
    bar.after(filterPanel);
    actions.querySelector('[data-home-filter]').addEventListener('click', () => { filterPanel.hidden = !filterPanel.hidden; });
    const applyFilter = () => { const term = filterPanel.querySelector('select').value.toLowerCase(); shell.querySelectorAll('.shield-card').forEach(card => { card.hidden = !!term && !(card.textContent || '').toLowerCase().includes(term); }); };
    filterPanel.querySelector('select').addEventListener('change', applyFilter);
    const setView = view => { const grid = shell.querySelector('.shield-grid'); if (!grid) return; grid.dataset.view = view; localStorage.setItem(HOME_VIEW_KEY, view); actions.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('is-active', b.dataset.view === view)); };
    actions.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view))); setView(localStorage.getItem(HOME_VIEW_KEY) || 'grid');
  }

  shell.querySelectorAll('.shield-card').forEach(card => {
    if (card.dataset.cardOpenReady) return; card.dataset.cardOpenReady = '1'; card.tabIndex = 0; card.setAttribute('role', 'button');
    const open = () => card.querySelector('footer .ui-btn--primary')?.click();
    card.addEventListener('click', e => { if (e.target.closest('button,a,input,select,textarea')) return; open(); });
    card.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button,a,input,select,textarea')) { e.preventDefault(); open(); } });
  });

  const createModal = document.querySelector('.modal--xl .preset-grid');
  if (createModal && !createModal.parentElement.querySelector('.dmlite-preset-help')) {
    const help = document.createElement('div'); help.className = 'dmlite-preset-help'; help.innerHTML = '<b>Escudos prontos:</b> selecione um modelo e depois clique em “Criar e abrir”. O escudo será criado com as janelas de referência já prontas.'; createModal.after(help);
  }
}

function syncPdfButton() {
  const button = document.getElementById('dmlite-pdf-fab'); if (!button) return;
  const top = document.querySelector('.editor.page-theme .top-actions');
  const parking = document.getElementById('dmlite-global-tools');
  if (top) { if (button.parentElement !== top) top.insertBefore(button, top.children[1] || null); button.hidden = false; }
  else { if (parking && button.parentElement !== parking) parking.appendChild(button); button.hidden = true; }
}

function syncEnhancements() { classifyPJCards(document); enhanceHome(); syncPdfButton(); }

export function installEnhancements() {
  createPdfConsult(); createGuide(); syncEnhancements();
  let scheduled = false;
  const observer = new MutationObserver(() => { if (scheduled) return; scheduled = true; queueMicrotask(() => { scheduled = false; syncEnhancements(); }); });
  observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
}
