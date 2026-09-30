const PJ_LITE_URL = 'https://pjlite.vercel.app/';
const MINI_PDF_KEY = 'dmlite_mini_pdf_v1';
const THEME_KEY = 'dmlite_theme_pref_v2';
const VERSION = '0.5.2 Alpha';

const UPDATE_LOG = [
  ['0.5.2 Alpha', 'Correções de contraste e consistência dos temas; PDF Mini dentro da mesa; Guia ampliado; painel Sobre & Atualizações no estilo do PJ Lite; acesso rápido ao PJ Lite oficial e central de Fichas do Grupo.'],
  ['0.5.1 Alpha', 'Arraste estabilizado, Home aproximada do PJ Lite, temas sincronizados, fichas importadas em miniatura por sistema, consulta de PDFs e biblioteca de escudos prontos ampliada.'],
  ['0.5.0 Alpha', 'Migração do protótipo para React/Vite, saves independentes, importação/exportação, integração por Código da Ficha/ZIP/JSON e modo mobile próprio do DM Lite.'],
  ['0.3.6', 'Linha de protótipos anterior: janelas livres, notas, dados, iniciativa, tabelas e primeiros escudos prontos.'],
];

let miniObjectUrl = '';
let miniDragCleanup = null;
let resizeObserver = null;

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function currentEditor() { return qs('.editor.page-theme'); }

function syncVersionLabels() {
  qsa('.home .brand-block small').forEach(el => { el.textContent = VERSION; });
  const notice = qs('.home .notice');
  if (notice) {
    const b = qs('b', notice); if (b) b.textContent = VERSION;
    const span = qs('span', notice); if (span) span.textContent = 'Temas revisados, PDF Mini, guia ampliado e integração prática com o PJ Lite.';
  }
}

function syncPJLiteLinks() {
  qsa('a').forEach(a => {
    if (/PJ Lite/i.test(a.textContent || '')) {
      a.href = PJ_LITE_URL;
      a.target = '_blank';
      a.rel = 'noreferrer noopener';
    }
  });
  const homeNav = qs('.home .pjlite-top nav');
  if (homeNav && !qs('[data-dm54-pjlite]', homeNav)) {
    const a = document.createElement('a');
    a.className = 'ui-btn dm54-pjlite-link';
    a.dataset.dm54Pjlite = '1';
    a.href = PJ_LITE_URL; a.target = '_blank'; a.rel = 'noreferrer noopener';
    a.textContent = '👤 Conferir PJ Lite ↗';
    homeNav.prepend(a);
  }
}

function copyThemeVarsToBody() {
  const root = qs('.editor.page-theme') || qs('.home.page-theme');
  if (!root) return;
  const cs = getComputedStyle(root);
  const map = {
    '--dm-bg': '--bg', '--dm-panel': '--panel', '--dm-panel2': '--panel2', '--dm-header': '--header',
    '--dm-border': '--border', '--dm-text': '--text', '--dm-muted': '--muted', '--dm-accent': '--accent',
    '--dm-input': '--input', '--dm-paper': '--paper',
  };
  Object.entries(map).forEach(([to, from]) => {
    const value = cs.getPropertyValue(from).trim() || cs.getPropertyValue(from.replace('--', '--home-')).trim();
    if (value) document.body.style.setProperty(to, value);
  });
  document.body.dataset.dmTheme = localStorage.getItem(THEME_KEY) || root.dataset.dmTheme || 'default';
}

function hideOldAboutAndInstallNewButton() {
  const nav = qs('.home .pjlite-top nav');
  if (!nav) return;
  qsa('button', nav).forEach(btn => {
    if ((btn.textContent || '').trim() === 'Sobre') {
      btn.dataset.dm54OldAbout = '1';
      btn.style.display = 'none';
    }
  });
  if (!qs('[data-dm54-about]', nav)) {
    const btn = document.createElement('button');
    btn.className = 'ui-btn';
    btn.dataset.dm54About = '1';
    btn.textContent = 'Sobre & Atualizações';
    btn.addEventListener('click', openAboutLog);
    nav.appendChild(btn);
  }
}

function createAboutLog() {
  if (qs('#dm54-about')) return;
  const layer = document.createElement('div');
  layer.id = 'dm54-about'; layer.className = 'dm54-layer'; layer.hidden = true;
  layer.innerHTML = `
    <section class="dm54-about-modal" role="dialog" aria-modal="true" aria-label="Sobre o projeto e atualizações">
      <header class="dm54-about-head">
        <h2>SOBRE O PROJETO & ATUALIZAÇÕES</h2>
        <div><span>${VERSION.toUpperCase()}</span><button type="button" data-close>×</button></div>
      </header>
      <div class="dm54-about-grid">
        <section class="dm54-log-col">
          <h3>LOG DE ATUALIZAÇÕES</h3>
          <div class="dm54-log-list">
            ${UPDATE_LOG.map(([v,d]) => `<p><b>${v}:</b> ${d}</p>`).join('')}
          </div>
          <div class="dm54-credits">
            <h4>CRÉDITOS DE DESENVOLVIMENTO</h4>
            <p>Desenvolvido como parte do ecossistema Lite para facilitar fichas e organização de mesas de RPG.</p>
            <p>Projeto comunitário, gratuito e de código aberto.</p>
            <a href="https://t.me/boost/Baianoviado" target="_blank" rel="noreferrer noopener">✈ Canal de anúncios e novidades no Telegram ↗</a>
          </div>
        </section>
        <aside class="dm54-project-col">
          <small>DM LITE</small>
          <h3>ESCUDO DIGITAL DO MESTRE</h3>
          <p class="dm54-project-sub">organização rápida sem substituir seus livros ou VTT</p>
          <div class="dm54-open-source">
            <h4>PROJETO DE CÓDIGO ABERTO 🔓</h4>
            <p>O DM Lite é gratuito e mantém os dados localmente no navegador. Escudos, notas e fichas importadas ficam sob seu controle.</p>
            <p>A proposta é ser simples: abrir a mesa, consultar o que importa e continuar jogando.</p>
          </div>
          <a class="dm54-pjlite-card" href="${PJ_LITE_URL}" target="_blank" rel="noreferrer noopener">
            <strong>CONFIRA O PJ LITE 👤</strong>
            <span>Abra as fichas dos jogadores e use Código da Ficha, ZIP ou JSON para trazê-las ao DM Lite.</span>
          </a>
        </aside>
      </div>
    </section>`;
  document.body.appendChild(layer);
  const close = () => { layer.hidden = true; };
  qs('[data-close]', layer).addEventListener('click', close);
  layer.addEventListener('pointerdown', e => { if (e.target === layer) close(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !layer.hidden) close(); });
}
function openAboutLog() { createAboutLog(); qs('#dm54-about').hidden = false; }

function upgradeGuide() {
  const layer = qs('#dm53-guide');
  if (!layer || layer.dataset.dm54Upgraded) return;
  layer.dataset.dm54Upgraded = '1';
  const box = qs('.dm53-guide', layer); if (!box) return;
  box.innerHTML = `
    <nav>
      <button class="active" data-tab="inicio">Começando</button>
      <button data-tab="escudos">Escudos prontos</button>
      <button data-tab="janelas">Janelas</button>
      <button data-tab="fichas">Fichas / PJ Lite</button>
      <button data-tab="pdf">PDFs</button>
      <button data-tab="mobile">Celular</button>
      <button data-tab="saves">Saves & Backup</button>
      <button data-tab="atalhos">Fluxo sugerido</button>
    </nav>
    <main>
      <article data-panel="inicio"><h3>O que é o DM Lite?</h3><p>O DM Lite é um escudo digital para o Mestre. Ele não tenta ser um VTT: a ideia é reunir consulta rápida, fichas resumidas, iniciativa, notas e materiais durante a sessão.</p><h4>Primeiros passos</h4><ol><li>Na Home, clique em <b>Novo Escudo</b>.</li><li>Comece em branco ou escolha um sistema pronto.</li><li>Abra as janelas que realmente usa.</li><li>Importe fichas dos jogadores quando precisar acompanhar PV, defesa, perícias e recursos.</li><li>Use PDF Mini para deixar um escudo ou suplemento curto ao lado das outras janelas.</li></ol></article>
      <article data-panel="escudos" hidden><h3>Escudos prontos</h3><p>Dragonbane, D&D 5.5e, Fabula Ultima, Tormenta20, Ordem Paranormal, 3DeT Victory e 3D&T Alpha já podem nascer com referências resumidas e ferramentas adequadas ao sistema.</p><p>Esses painéis são atalhos de mesa. Para exceções, detalhes e texto completo, consulte o livro ou PDF correspondente.</p><p>Depois de criado, um escudo é um save independente: você pode mudar nome, organizar janelas, duplicar, exportar e importar.</p></article>
      <article data-panel="janelas" hidden><h3>Janelas do Mestre</h3><ul><li><b>Nota:</b> páginas e formatação por seleção.</li><li><b>Iniciativa:</b> rodada, ordem, PV e condições.</li><li><b>Dados:</b> botões rápidos e fórmulas como 2d6+3.</li><li><b>Tabela:</b> células editáveis, formatação e linha aleatória.</li><li><b>NPC:</b> bloco rápido com PV, defesa, iniciativa e ataques.</li><li><b>Relógio:</b> progresso em 4, 6, 8, 10 ou 12 segmentos.</li><li><b>Links / Imagem:</b> referências externas e visuais.</li><li><b>PDF Mini:</b> leitor compacto que fica junto das outras janelas.</li></ul><p>No desktop, arraste pelo cabeçalho. No celular, as janelas são organizadas em pilha para evitar conflito com o gesto de rolagem.</p></article>
      <article data-panel="fichas" hidden><h3>Fichas e PJ Lite</h3><p>O PJ Lite continua sendo o lugar principal das fichas. No DM Lite, a ficha vira uma mini ficha de consulta para o Mestre.</p><p>Use <b>Importar ficha</b> para trazer Código da Ficha, ZIP ou JSON. A aparência da mini ficha muda conforme o sistema.</p><p>O botão <b>👥 Fichas do Grupo</b> mostra o que já está importado no escudo e oferece acesso direto ao PJ Lite.</p><p><a href="${PJ_LITE_URL}" target="_blank" rel="noreferrer noopener">Abrir PJ Lite oficial ↗</a></p><p><b>Importante:</b> como PJ Lite e DM Lite estão em domínios separados, o navegador não permite que um leia automaticamente o localStorage do outro. Por isso a integração segura usa Código da Ficha, ZIP ou JSON.</p></article>
      <article data-panel="pdf" hidden><h3>Consulta de PDFs</h3><p><b>📚 PDFs</b> abre o leitor grande para livros, aventuras e materiais extensos. Ele aceita PDF local, URL e link do Google Drive.</p><p><b>📄 PDF Mini</b> cria um leitor compacto sobre a área da mesa. Ele é ideal para escudos, handouts, tabelas, resumos e suplementos pequenos que você quer manter visíveis ao lado da iniciativa e das notas.</p><p>Arquivos locais usam uma URL temporária do navegador e não entram no save. Isso evita inflar o armazenamento.</p></article>
      <article data-panel="mobile" hidden><h3>Uso no celular</h3><p>No celular, o DM Lite troca automaticamente para uma pilha vertical. Use ↑ e ↓ para mudar a ordem e □ para focar uma janela.</p><p>O PDF Mini ocupa uma área maior no celular para continuar legível. Para livros grandes, prefira o leitor completo ou “Abrir em nova aba”.</p></article>
      <article data-panel="saves" hidden><h3>Saves, backup e compartilhamento</h3><p>O escudo é salvo automaticamente no navegador. Para proteger uma campanha, exporte periodicamente por JSON.</p><ul><li><b>JSON:</b> melhor para backup completo.</li><li><b>Código DM Lite:</b> prático para compartilhar um escudo.</li><li><b>Código da Ficha PJ Lite:</b> usado para trazer uma ficha de jogador.</li></ul><p>Os formatos antigos DMLITE1/DMLITE2 continuam sendo lidos pela linha atual.</p></article>
      <article data-panel="atalhos" hidden><h3>Fluxo sugerido para uma sessão</h3><ol><li>Abra o escudo da campanha.</li><li>Importe ou confira as fichas do grupo.</li><li>Abra Iniciativa, Dados e uma Nota.</li><li>Se precisar de consulta constante, use PDF Mini.</li><li>Se precisar pesquisar um livro inteiro, use 📚 PDFs.</li><li>Ao final, volte à Home: o escudo já foi salvo automaticamente.</li></ol></article>
    </main>`;
  qsa('[data-tab]', box).forEach(btn => btn.addEventListener('click', () => {
    qsa('[data-tab]', box).forEach(x => x.classList.toggle('active', x === btn));
    qsa('[data-panel]', box).forEach(p => { p.hidden = p.dataset.panel !== btn.dataset.tab; });
  }));
}

function getMiniState() {
  try { return { x: 22, y: 22, w: 370, h: 440, url: '', name: 'PDF Mini', ...JSON.parse(localStorage.getItem(MINI_PDF_KEY) || '{}') }; }
  catch { return { x: 22, y: 22, w: 370, h: 440, url: '', name: 'PDF Mini' }; }
}
function saveMiniState(panel) {
  if (!panel) return;
  const rect = panel.getBoundingClientRect();
  const parent = panel.parentElement?.getBoundingClientRect();
  const data = {
    x: Number.parseFloat(panel.style.left) || Math.max(0, rect.left - (parent?.left || 0)),
    y: Number.parseFloat(panel.style.top) || Math.max(0, rect.top - (parent?.top || 0)),
    w: rect.width, h: rect.height,
    url: panel.dataset.persistUrl || '',
    name: qs('[data-mini-name]', panel)?.textContent || 'PDF Mini',
  };
  localStorage.setItem(MINI_PDF_KEY, JSON.stringify(data));
}
function normalizePdfUrl(input) {
  let value = String(input || '').trim(); if (!value) return '';
  if (!/^[a-z]+:/i.test(value)) value = `https://${value}`;
  try {
    const url = new URL(value);
    if (url.hostname === 'drive.google.com') {
      const id = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || url.searchParams.get('id');
      if (id) return `https://drive.google.com/file/d/${id}/preview`;
    }
  } catch {}
  return value;
}
function removeMiniPdf() {
  miniDragCleanup?.(); miniDragCleanup = null;
  resizeObserver?.disconnect(); resizeObserver = null;
  qs('#dm54-mini-pdf')?.remove();
  if (miniObjectUrl) { URL.revokeObjectURL(miniObjectUrl); miniObjectUrl = ''; }
}
function createMiniPdf() {
  const board = qs('.editor .board-wrap'); if (!board) return;
  let panel = qs('#dm54-mini-pdf');
  if (panel) { panel.hidden = false; return; }
  const state = getMiniState();
  panel = document.createElement('section'); panel.id = 'dm54-mini-pdf'; panel.className = 'dm54-mini-pdf';
  panel.style.left = `${state.x}px`; panel.style.top = `${state.y}px`; panel.style.width = `${state.w}px`; panel.style.height = `${state.h}px`;
  panel.innerHTML = `
    <header data-mini-drag><span>⠿</span><strong data-mini-name>${state.name || 'PDF Mini'}</strong><div><button data-mini-tab title="Abrir em nova aba">↗</button><button data-mini-min title="Minimizar">—</button><button data-mini-close title="Fechar">×</button></div></header>
    <div class="dm54-mini-controls">
      <button data-mini-file>📄 Arquivo</button><input hidden type="file" accept="application/pdf,.pdf" data-mini-input>
      <input data-mini-url placeholder="URL ou Google Drive..."><button data-mini-open>Abrir</button>
    </div>
    <div class="dm54-mini-view"><div class="dm54-mini-empty"><b>PDF Mini</b><span>Ideal para escudos e materiais curtos.</span></div><iframe hidden title="PDF Mini"></iframe></div>`;
  board.appendChild(panel);
  const frame = qs('iframe', panel), empty = qs('.dm54-mini-empty', panel), urlInput = qs('[data-mini-url]', panel), name = qs('[data-mini-name]', panel);
  const openUrl = (url, label = 'PDF Mini', persist = true) => {
    const normalized = normalizePdfUrl(url); if (!normalized) return;
    frame.src = normalized; frame.hidden = false; empty.hidden = true; name.textContent = label;
    panel.dataset.currentUrl = normalized;
    panel.dataset.persistUrl = persist && !normalized.startsWith('blob:') ? normalized : '';
    if (persist) saveMiniState(panel);
  };
  if (state.url) openUrl(state.url, state.name || 'PDF Mini', true);
  qs('[data-mini-file]', panel).onclick = () => qs('[data-mini-input]', panel).click();
  qs('[data-mini-input]', panel).onchange = e => {
    const file = e.target.files?.[0]; if (!file) return;
    if (miniObjectUrl) URL.revokeObjectURL(miniObjectUrl);
    miniObjectUrl = URL.createObjectURL(file); openUrl(miniObjectUrl, file.name || 'PDF local', false); e.target.value = '';
  };
  qs('[data-mini-open]', panel).onclick = () => openUrl(urlInput.value, 'PDF por link', true);
  urlInput.onkeydown = e => { if (e.key === 'Enter') qs('[data-mini-open]', panel).click(); };
  qs('[data-mini-tab]', panel).onclick = () => { const url = panel.dataset.currentUrl; if (url) window.open(url, '_blank', 'noopener,noreferrer'); };
  qs('[data-mini-close]', panel).onclick = () => removeMiniPdf();
  qs('[data-mini-min]', panel).onclick = () => panel.classList.toggle('is-minimized');

  const head = qs('[data-mini-drag]', panel);
  head.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.target.closest('button,input')) return;
    e.preventDefault();
    miniDragCleanup?.();
    const parent = board.getBoundingClientRect(), start = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY, ox = start.left - parent.left, oy = start.top - parent.top, pid = e.pointerId;
    const move = ev => {
      if (ev.pointerId !== pid) return;
      if (ev.pointerType === 'mouse' && ev.buttons === 0) { end(ev); return; }
      const x = Math.max(0, Math.min(ox + ev.clientX - sx, Math.max(0, parent.width - panel.offsetWidth)));
      const y = Math.max(0, Math.min(oy + ev.clientY - sy, Math.max(0, parent.height - 48)));
      panel.style.left = `${x}px`; panel.style.top = `${y}px`;
    };
    const cleanup = () => { window.removeEventListener('pointermove', move, true); window.removeEventListener('pointerup', end, true); window.removeEventListener('pointercancel', end, true); window.removeEventListener('blur', end, true); miniDragCleanup = null; };
    const end = ev => { if (ev?.pointerId != null && ev.pointerId !== pid) return; cleanup(); saveMiniState(panel); };
    miniDragCleanup = cleanup;
    window.addEventListener('pointermove', move, true); window.addEventListener('pointerup', end, true); window.addEventListener('pointercancel', end, true); window.addEventListener('blur', end, true);
  });
  resizeObserver = new ResizeObserver(() => saveMiniState(panel)); resizeObserver.observe(panel);
}

function installMiniPdfButton() {
  const editor = currentEditor(); if (!editor) { removeMiniPdf(); return; }
  const rail = qs('.tool-rail', editor); if (rail && !qs('[data-dm54-mini-pdf]', rail)) {
    const btn = document.createElement('button'); btn.dataset.dm54MiniPdf = '1'; btn.title = 'PDF Mini';
    btn.innerHTML = '<span>📄</span><small>PDF Mini</small>'; btn.onclick = createMiniPdf; rail.appendChild(btn);
  }
  const top = qs('.top-actions', editor); if (top && !qs('[data-dm54-mini-pdf-top]', top)) {
    const btn = document.createElement('button'); btn.className = 'ui-btn dm54-mini-top'; btn.dataset.dm54MiniPdfTop = '1'; btn.textContent = '📄 PDF Mini'; btn.onclick = createMiniPdf;
    const pdfFull = qs('#dm53-pdf-button', top); if (pdfFull) pdfFull.after(btn); else top.prepend(btn);
  }
}

function focusSheetWidget(name) {
  const widgets = qsa('.widget');
  const target = widgets.find(w => /pj-card/.test(qs('.pj-card', w)?.className || '') && (!name || (qs('.pj-card h3', w)?.textContent || '') === name));
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  target.classList.add('dm54-flash'); setTimeout(() => target.classList.remove('dm54-flash'), 1200);
}
function createSheetsHub() {
  if (qs('#dm54-sheets')) return;
  const layer = document.createElement('div'); layer.id = 'dm54-sheets'; layer.className = 'dm54-layer'; layer.hidden = true;
  layer.innerHTML = `<section class="dm54-sheets-modal"><header><div><small>DM Lite · Integração</small><h2>Fichas do Grupo</h2></div><button data-close>×</button></header><div data-list></div><footer><button data-import>＋ Importar ficha</button><a href="${PJ_LITE_URL}" target="_blank" rel="noreferrer noopener">👤 Conferir PJ Lite ↗</a></footer></section>`;
  document.body.appendChild(layer);
  const close = () => layer.hidden = true; qs('[data-close]', layer).onclick = close; layer.addEventListener('pointerdown', e => e.target === layer && close());
  qs('[data-import]', layer).onclick = () => { close(); const btn = qsa('.editor .top-actions button').find(b => /PJ Lite|Importar ficha/i.test(b.textContent || '')); btn?.click(); };
}
function refreshSheetsHub() {
  const layer = qs('#dm54-sheets'); if (!layer) return;
  const list = qs('[data-list]', layer); list.innerHTML = '';
  const cards = qsa('.editor .pj-card');
  if (!cards.length) {
    list.innerHTML = `<div class="dm54-no-sheets"><span>👥</span><h3>Nenhuma ficha importada neste escudo</h3><p>Use “Importar ficha” ou abra o PJ Lite para copiar o Código da Ficha.</p></div>`;
    return;
  }
  cards.forEach(card => {
    const name = qs('h3', card)?.textContent || 'Personagem'; const system = qs('small', card)?.textContent || 'PJ Lite';
    const row = document.createElement('button'); row.className = 'dm54-sheet-row'; row.innerHTML = '<span>👤</span><div><b></b><small></small></div><em>Ver</em>';
    qs('b', row).textContent = name; qs('small', row).textContent = system; row.onclick = () => { layer.hidden = true; focusSheetWidget(name); }; list.appendChild(row);
  });
}
function installSheetsButton() {
  const editor = currentEditor(); if (!editor) return;
  const top = qs('.top-actions', editor); if (!top) return;
  let btn = qs('[data-dm54-sheets]', top);
  const count = qsa('.editor .pj-card').length;
  if (!btn) {
    btn = document.createElement('button'); btn.className = 'ui-btn dm54-sheets-button'; btn.dataset.dm54Sheets = '1'; btn.onclick = () => { createSheetsHub(); refreshSheetsHub(); qs('#dm54-sheets').hidden = false; };
    const importBtn = qsa('button', top).find(b => /PJ Lite/i.test(b.textContent || '')); if (importBtn) { importBtn.textContent = '＋ Importar ficha'; importBtn.after(btn); } else top.prepend(btn);
  }
  btn.textContent = `👥 Fichas (${count})`;
  if (!qs('[data-dm54-pjlite-editor]', top)) {
    const a = document.createElement('a'); a.className = 'ui-btn dm54-pjlite-editor'; a.dataset.dm54PjliteEditor = '1'; a.href = PJ_LITE_URL; a.target = '_blank'; a.rel = 'noreferrer noopener'; a.textContent = '👤 PJ Lite ↗'; top.appendChild(a);
  }
}

function syncAll() {
  syncVersionLabels(); syncPJLiteLinks(); hideOldAboutAndInstallNewButton(); upgradeGuide(); installMiniPdfButton(); installSheetsButton(); copyThemeVarsToBody();
  const custom = qs('#dmlite-custom-theme'); if (custom) custom.dataset.dm54Theme = document.body.dataset.dmTheme || 'default';
}

export function installEnhancementsV054() {
  createAboutLog(); createSheetsHub(); syncAll();
  window.addEventListener('dmlite-theme-change', () => setTimeout(() => { copyThemeVarsToBody(); syncAll(); }, 0));
  window.addEventListener('storage', e => { if (e.key === THEME_KEY) setTimeout(syncAll, 0); });
  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return; queued = true;
    queueMicrotask(() => { queued = false; syncAll(); refreshSheetsHub(); });
  });
  observer.observe(qs('#root') || document.body, { childList: true, subtree: true });
  window.addEventListener('beforeunload', () => { if (miniObjectUrl) URL.revokeObjectURL(miniObjectUrl); });
}
