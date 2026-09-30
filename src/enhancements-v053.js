const THEME_KEY='dmlite_theme_pref_v2';
const VIEW_KEY='dmlite_home_view_v2';
const CUSTOM_KEY='dmlite_custom_theme_v1';
const PDF_RECENTS_KEY='dmlite_pdf_recents_v1';

const THEMES={
 default:{label:'Tema: Padrão',bg:'#e5e7eb',panel:'#ffffff',panel2:'#f3f4f6',header:'#1f2937',border:'#cbd5e1',text:'#1f2937',muted:'#64748b',accent:'#b52222',input:'#ffffff',paper:'#ffffff'},
 classic:{label:'Tema: Clássico DB',bg:'#dcd4be',panel:'#f7f3e8',panel2:'#f2ece1',header:'#1b3b34',border:'#5c4a3d',text:'#2d2925',muted:'#756b61',accent:'#1b3b34',input:'#fffdf7',paper:'#fffdf7'},
 dnd:{label:'Tema: Dungeons & Dragons',bg:'#d8c7a6',panel:'#fdf1dc',panel2:'#fff7e9',header:'#922610',border:'#a56c55',text:'#3f281e',muted:'#80685c',accent:'#922610',input:'#fffaf2',paper:'#fffaf2'},
 fabula:{label:'Tema: Fabula Ultima',bg:'#d8efeb',panel:'#f9fffd',panel2:'#eaf5f2',header:'#245f61',border:'#79aaa5',text:'#18383b',muted:'#527174',accent:'#2f7f7b',input:'#fbfffe',paper:'#fbfffe'},
 som6:{label:'Tema: O Som das Seis',bg:'#d8c29b',panel:'#f5ebd3',panel2:'#fbf3e4',header:'#6f261e',border:'#b89b73',text:'#3f2b1d',muted:'#6d5742',accent:'#7b241c',input:'#fff9ed',paper:'#fbf3e4'},
 '3det':{label:'Tema: 3DeT Victory',bg:'#d7e2ee',panel:'#f7fbff',panel2:'#e7eff8',header:'#284b75',border:'#6f8eae',text:'#20344a',muted:'#61758a',accent:'#315f94',input:'#ffffff',paper:'#ffffff'},
 dark:{label:'Tema: Modo Escuro',bg:'#0b1120',panel:'#18212f',panel2:'#243044',header:'#09151f',border:'#475569',text:'#e5e7eb',muted:'#aeb9c8',accent:'#d59b47',input:'#0f172a',paper:'#18212f'},
 custom:{label:'Tema: Personalizado...',bg:'#e5e7eb',panel:'#ffffff',panel2:'#f3f4f6',header:'#1f2937',border:'#cbd5e1',text:'#1f2937',muted:'#64748b',accent:'#b52222',input:'#ffffff',paper:'#ffffff'},
 tormenta20:{label:'Extra DM: Tormenta20',bg:'#ded4bd',panel:'#fff7e5',panel2:'#f4ead5',header:'#7c3f12',border:'#9c7959',text:'#3d2b1d',muted:'#796453',accent:'#a85b16',input:'#fffdf6',paper:'#fffdf6'},
 ordem:{label:'Extra DM: Ordem Paranormal',bg:'#cfd3d8',panel:'#f0f1f2',panel2:'#e1e4e7',header:'#18181b',border:'#62666b',text:'#202124',muted:'#676b70',accent:'#991b1b',input:'#fafafa',paper:'#f8f8f8'}
};

const SYSTEM_MATCHERS=[
 {id:'dragonbane',label:'Dragonbane',icon:'🐉',test:t=>/dragonbane/i.test(t)},
 {id:'dnd5e',label:'D&D 5.5e',icon:'🐲',test:t=>/d&d|dnd/i.test(t)},
 {id:'fabula',label:'Fabula Ultima',icon:'✨',test:t=>/fabula/i.test(t)},
 {id:'somdas6',label:'O Som das Seis',icon:'🤠',test:t=>/som das seis/i.test(t)},
 {id:'3det',label:'3DeT Victory',icon:'⭐',test:t=>/3det|3de?t victory/i.test(t)},
 {id:'tormenta20',label:'Tormenta20',icon:'⚡',test:t=>/tormenta/i.test(t)},
 {id:'ordem',label:'Ordem Paranormal',icon:'◉',test:t=>/ordem/i.test(t)}
];

const getTheme=()=>localStorage.getItem(THEME_KEY)||'default';
const getCustom=()=>{try{return {...THEMES.custom,...JSON.parse(localStorage.getItem(CUSTOM_KEY)||'{}')}}catch{return {...THEMES.custom}}};
const themeData=id=>id==='custom'?getCustom():(THEMES[id]||THEMES.default);
function setVar(el,name,value){el?.style?.setProperty(name,value,'important')}
function applyThemeToRoot(root,id=getTheme()){
 if(!root)return; const t=themeData(id); root.dataset.dmTheme=id;
 [['--bg',t.bg],['--panel',t.panel],['--panel2',t.panel2],['--header',t.header],['--border',t.border],['--text',t.text],['--muted',t.muted],['--accent',t.accent],['--input',t.input],['--paper',t.paper],['--home-bg',t.bg],['--home-paper',t.panel],['--home-line',t.border],['--home-ink',t.text],['--home-muted',t.muted],['--home-top',t.header],['--home-accent',t.accent]].forEach(([k,v])=>setVar(root,k,v));
 if(id==='custom'&&t.background){root.style.backgroundImage=`linear-gradient(rgba(0,0,0,${1-(Number(t.opacity)||.92)}),rgba(0,0,0,${1-(Number(t.opacity)||.92)})),url(${t.background})`;root.style.backgroundSize='cover';root.style.backgroundPosition='center';root.style.backgroundAttachment='fixed'}else root.style.removeProperty('background-image');
}
function applyTheme(id,openCustom=true){
 if(!THEMES[id])id='default'; localStorage.setItem(THEME_KEY,id);
 document.querySelectorAll('.home.page-theme,.editor.page-theme').forEach(el=>applyThemeToRoot(el,id));
 document.querySelectorAll('[data-dm-theme-select]').forEach(sel=>{if(sel.value!==id)sel.value=id});
 if(id==='custom'&&openCustom)showCustomTheme();
 window.dispatchEvent(new CustomEvent('dmlite-theme-change',{detail:{theme:id}}));
}
function themeOptions(){return `<optgroup label="Temas do PJ Lite">${['default','classic','dnd','fabula','som6','3det','dark','custom'].map(k=>`<option value="${k}">${THEMES[k].label}</option>`).join('')}</optgroup><optgroup label="Extras do DM Lite"><option value="tormenta20">${THEMES.tormenta20.label}</option><option value="ordem">${THEMES.ordem.label}</option></optgroup>`}

function createCustomTheme(){
 if(document.getElementById('dmlite-custom-theme'))return;
 const layer=document.createElement('div');layer.id='dmlite-custom-theme';layer.className='dm53-layer';layer.hidden=true;
 layer.innerHTML=`<section class="dm53-modal dm53-modal--small"><header><div><small>DM Lite</small><h2>Tema Personalizado</h2></div><button data-close>×</button></header><div class="dm53-form"><label>Fundo <input type="color" data-k="bg"></label><label>Janela <input type="color" data-k="panel"></label><label>Barra <input type="color" data-k="header"></label><label>Destaque <input type="color" data-k="accent"></label><label>Texto <input type="color" data-k="text"></label><label class="wide">Imagem de fundo (URL)<input type="text" data-k="background" placeholder="Opcional"></label><label class="wide">Opacidade das janelas <input type="range" min="0.55" max="1" step="0.01" data-k="opacity"></label></div><footer><button data-reset>Restaurar</button><button class="primary" data-save>Salvar tema</button></footer></section>`;
 document.body.appendChild(layer);
 const close=()=>layer.hidden=true;layer.querySelector('[data-close]').onclick=close;layer.addEventListener('pointerdown',e=>e.target===layer&&close());
 layer.querySelector('[data-reset]').onclick=()=>{localStorage.removeItem(CUSTOM_KEY);fillCustom(layer);applyTheme('custom',false)};
 layer.querySelector('[data-save]').onclick=()=>{const data={};layer.querySelectorAll('[data-k]').forEach(i=>data[i.dataset.k]=i.value);data.panel2=data.panel;data.input=data.panel;data.paper=data.panel;data.border=data.accent;data.muted=data.text;localStorage.setItem(CUSTOM_KEY,JSON.stringify(data));applyTheme('custom',false);close()};
}
function fillCustom(layer=document.getElementById('dmlite-custom-theme')){if(!layer)return;const t=getCustom();layer.querySelectorAll('[data-k]').forEach(i=>{if(t[i.dataset.k]!=null)i.value=t[i.dataset.k]})}
function showCustomTheme(){createCustomTheme();const layer=document.getElementById('dmlite-custom-theme');fillCustom(layer);layer.hidden=false}

function classifyPJCards(){document.querySelectorAll('.pj-card').forEach(card=>{const text=card.textContent||'';const m=SYSTEM_MATCHERS.find(x=>x.test(text))||{id:'generic',label:'PJ Lite',icon:'👤'};card.dataset.pjSystem=m.id;card.dataset.pjLabel=m.label;card.dataset.pjIcon=m.icon})}

function createGuide(){
 if(document.getElementById('dm53-guide'))return;
 const layer=document.createElement('div');layer.id='dm53-guide';layer.className='dm53-layer';layer.hidden=true;
 layer.innerHTML=`<section class="dm53-modal dm53-modal--guide"><header><div><small>DM Lite · Ajuda</small><h2>Guias e Tutoriais</h2></div><button data-close>×</button></header><div class="dm53-guide"><nav>${[['inicio','Começando'],['escudos','Escudos'],['janelas','Janelas'],['pj','PJ Lite'],['pdf','PDFs'],['mobile','Celular'],['saves','Saves']].map(([id,l],i)=>`<button data-tab="${id}" class="${i?'':'active'}">${l}</button>`).join('')}</nav><main><article data-panel="inicio"><h3>O que é o DM Lite?</h3><p>Um escudo digital para organizar a mesa do Mestre sem tentar virar um VTT completo.</p><ol><li>Crie um escudo em branco ou pegue um pronto.</li><li>Abra apenas as janelas úteis para a sessão.</li><li>Importe personagens do PJ Lite por Código da Ficha, ZIP ou JSON.</li><li>Consulte PDFs sem colocar livros pesados dentro do save.</li></ol></article><article data-panel="escudos" hidden><h3>Escudos</h3><p>Os escudos são saves independentes. Você pode nomear, duplicar, exportar, importar e apagar. Os modelos prontos já trazem referências resumidas, iniciativa, dados e ferramentas adequadas ao sistema.</p></article><article data-panel="janelas" hidden><h3>Janelas</h3><p>No desktop, mova pelo cabeçalho e redimensione pelo canto. Nota, Iniciativa, Dados, Tabela, NPC, Relógio, Links e Imagem podem ser adicionados pela barra lateral.</p></article><article data-panel="pj" hidden><h3>PJ Lite</h3><p>O DM Lite aceita os formatos atuais do PJ Lite. A ficha importada vira uma mini ficha de consulta com identidade visual do sistema e pode ser adicionada à iniciativa.</p></article><article data-panel="pdf" hidden><h3>Materiais PDF</h3><p>Use o botão 📚 PDFs na barra superior. Abra arquivo local, URL direta ou link do Google Drive. PDFs locais não são salvos no escudo.</p></article><article data-panel="mobile" hidden><h3>Celular</h3><p>No celular as janelas viram uma pilha vertical. Use ↑/↓ para organizar e □ para focar uma janela.</p></article><article data-panel="saves" hidden><h3>Saves</h3><p>O salvamento é automático no navegador. Para backup ou troca de dispositivo, exporte JSON ou Código DM Lite.</p></article></main></div></section>`;
 document.body.appendChild(layer);const close=()=>layer.hidden=true;layer.querySelector('[data-close]').onclick=close;layer.addEventListener('pointerdown',e=>e.target===layer&&close());layer.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{layer.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));layer.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==b.dataset.tab)})
}
function openGuide(){createGuide();document.getElementById('dm53-guide').hidden=false}

function normalizePdfUrl(input){let v=String(input||'').trim();if(!v)return'';if(!/^[a-z]+:/i.test(v))v=`https://${v}`;try{const u=new URL(v);if(u.hostname==='drive.google.com'){const id=u.pathname.match(/\/file\/d\/([^/]+)/)?.[1]||u.searchParams.get('id');if(id)return`https://drive.google.com/file/d/${id}/preview`}}catch{}return v}
function pdfRecents(){try{const r=JSON.parse(localStorage.getItem(PDF_RECENTS_KEY)||'[]');return Array.isArray(r)?r.slice(0,8):[]}catch{return[]}}
function savePdfRecent(row){if(!row.url||row.url.startsWith('blob:'))return;localStorage.setItem(PDF_RECENTS_KEY,JSON.stringify([row,...pdfRecents().filter(x=>x.url!==row.url)].slice(0,8)))}
function createPdf(){
 if(document.getElementById('dm53-pdf'))return;
 const btn=document.createElement('button');btn.id='dm53-pdf-button';btn.className='ui-btn dm53-pdf-button';btn.innerHTML='📚 <span>PDFs</span>';btn.hidden=true;
 const layer=document.createElement('div');layer.id='dm53-pdf';layer.className='dm53-layer';layer.hidden=true;layer.innerHTML=`<section class="dm53-modal dm53-modal--pdf"><header><div><small>DM Lite · Consulta</small><h2>Materiais PDF</h2></div><button data-close>×</button></header><div class="dm53-pdfbar"><button data-file>📄 Abrir PDF</button><input hidden type="file" accept="application/pdf,.pdf" data-input><input data-url placeholder="URL ou link do Google Drive..."><button data-open>Abrir URL</button><button data-new disabled>Abrir em nova aba ↗</button></div><div class="dm53-pdfbody"><aside><strong>Recentes</strong><div data-recents></div><button data-clear>Limpar recentes</button></aside><main><div data-empty><span>📚</span><h3>Consulta rápida</h3><p>Abra um PDF local ou por link sem sair da mesa.</p></div><iframe hidden data-frame title="Visualizador PDF"></iframe></main></div><footer><span data-name>Nenhum material aberto</span><small>PDF local fica somente nesta sessão.</small></footer></section>`;
 document.body.append(btn,layer);let current='',objectUrl='';const frame=layer.querySelector('[data-frame]'),empty=layer.querySelector('[data-empty]'),name=layer.querySelector('[data-name]'),rec=layer.querySelector('[data-recents]');
 const render=()=>{rec.innerHTML='';const rows=pdfRecents();if(!rows.length){rec.innerHTML='<small>Nenhum link recente.</small>';return}rows.forEach(r=>{const b=document.createElement('button');b.innerHTML=`<b></b><small></small>`;b.querySelector('b').textContent=r.name;b.querySelector('small').textContent=r.url;b.onclick=()=>openPdf(r.url,r.name,false);rec.appendChild(b)})};
 const openPdf=(url,label='Material PDF',remember=true)=>{const v=normalizePdfUrl(url);if(!v)return;current=v;frame.src=v;frame.hidden=false;empty.hidden=true;name.textContent=label;layer.querySelector('[data-new]').disabled=false;if(remember){savePdfRecent({name:label,url:v});render()}};
 btn.onclick=()=>{layer.hidden=false;render()};layer.querySelector('[data-close]').onclick=()=>layer.hidden=true;layer.addEventListener('pointerdown',e=>e.target===layer&&(layer.hidden=true));layer.querySelector('[data-file]').onclick=()=>layer.querySelector('[data-input]').click();layer.querySelector('[data-input]').onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(f);openPdf(objectUrl,f.name,false);e.target.value=''};layer.querySelector('[data-open]').onclick=()=>{const i=layer.querySelector('[data-url]');openPdf(i.value,'Material por URL',true)};layer.querySelector('[data-new]').onclick=()=>current&&window.open(current,'_blank','noopener,noreferrer');layer.querySelector('[data-clear]').onclick=()=>{localStorage.removeItem(PDF_RECENTS_KEY);render()};window.addEventListener('beforeunload',()=>objectUrl&&URL.revokeObjectURL(objectUrl));
}

function enhanceHome(){
 const home=document.querySelector('.home.page-theme');if(!home)return;applyThemeToRoot(home);const shell=home.querySelector('.home-shell');if(!shell)return;
 if(!shell.querySelector('.dm53-home-tools')){const bar=document.createElement('section');bar.className='dm53-home-tools';bar.innerHTML=`<label>🎨 <select data-dm-theme-select>${themeOptions()}</select></label><button data-guide>❔ Guias e Tutoriais</button>`;shell.prepend(bar);const sel=bar.querySelector('select');sel.value=getTheme();sel.onchange=()=>applyTheme(sel.value);bar.querySelector('[data-guide]').onclick=openGuide}
 const notice=shell.querySelector('.notice');if(notice&&!notice.querySelector('.dm53-update-toggle')){const t=document.createElement('button');t.className='dm53-update-toggle';t.textContent='+';const extra=document.createElement('div');extra.className='dm53-update-extra';extra.hidden=true;extra.innerHTML='<p><b>Temas sincronizados:</b> a Home e o escudo agora usam a mesma preferência visual.</p><p>Todos os temas atuais do PJ Lite estão disponíveis, além de extras do DM Lite.</p>';t.onclick=()=>{extra.hidden=!extra.hidden;t.textContent=extra.hidden?'+':'−'};notice.append(t,extra)}
 const lib=shell.querySelector('.library-bar');if(lib&&!lib.querySelector('.dm53-library-actions')){const actions=document.createElement('div');actions.className='dm53-library-actions';actions.innerHTML='<button data-filter>⚙ Filtros</button><button data-grid class="active">▦</button><button data-list>☰</button>';lib.appendChild(actions);const panel=document.createElement('div');panel.className='dm53-filter';panel.hidden=true;panel.innerHTML='<label>Sistema <select><option value="">Todos</option><option>Dragonbane</option><option>D&D 5.5e</option><option>Fabula Ultima</option><option>Tormenta20</option><option>Ordem Paranormal</option><option>3DeT Victory</option><option>3D&T Alpha</option></select></label>';lib.after(panel);actions.querySelector('[data-filter]').onclick=()=>panel.hidden=!panel.hidden;const setView=v=>{localStorage.setItem(VIEW_KEY,v);shell.querySelector('.shield-grid')?.setAttribute('data-view',v);actions.querySelector('[data-grid]').classList.toggle('active',v==='grid');actions.querySelector('[data-list]').classList.toggle('active',v==='list')};actions.querySelector('[data-grid]').onclick=()=>setView('grid');actions.querySelector('[data-list]').onclick=()=>setView('list');setView(localStorage.getItem(VIEW_KEY)||'grid');panel.querySelector('select').onchange=e=>{const q=e.target.value.toLowerCase();shell.querySelectorAll('.shield-card').forEach(c=>c.hidden=!!q&&!c.textContent.toLowerCase().includes(q))}}
 shell.querySelectorAll('.shield-card').forEach(card=>{if(card.dataset.dm53Wired)return;card.dataset.dm53Wired='1';card.tabIndex=0;const open=()=>card.querySelector('footer .ui-btn--primary')?.click();card.addEventListener('click',e=>{if(e.target.closest('button,a,input,select,textarea'))return;open()});card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
}

function enhanceEditor(){
 const ed=document.querySelector('.editor.page-theme');if(!ed)return;applyThemeToRoot(ed);const top=ed.querySelector('.top-actions');if(!top)return;
 if(!top.querySelector('.dm53-editor-theme')){const wrap=document.createElement('label');wrap.className='dm53-editor-theme';wrap.innerHTML=`🎨 <select data-dm-theme-select>${themeOptions()}</select>`;const sel=wrap.querySelector('select');sel.value=getTheme();sel.onchange=()=>applyTheme(sel.value);top.prepend(wrap)}
 const pdf=document.getElementById('dm53-pdf-button');if(pdf){pdf.hidden=false;if(pdf.parentElement!==top)top.insertBefore(pdf,top.firstChild)}
 const modal=document.querySelector('.modal');if(modal){modal.querySelectorAll('label').forEach(label=>{if(label.dataset.dm53Theme)return;const s=label.querySelector('select');if(!s||!/^Tema/i.test(label.textContent.trim()))return;label.dataset.dm53Theme='1';s.innerHTML=themeOptions();s.dataset.dmThemeSelect='1';s.value=getTheme();s.addEventListener('change',()=>applyTheme(s.value),true)})}
}
function sync(){classifyPJCards();enhanceHome();enhanceEditor();const pdf=document.getElementById('dm53-pdf-button');if(pdf&&!document.querySelector('.editor.page-theme'))pdf.hidden=true}
export function installEnhancements(){createCustomTheme();createGuide();createPdf();sync();let queued=false;const obs=new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;sync()})});obs.observe(document.getElementById('root')||document.body,{childList:true,subtree:true});window.addEventListener('storage',e=>{if(e.key===THEME_KEY)applyTheme(e.newValue||'default',false)})}
