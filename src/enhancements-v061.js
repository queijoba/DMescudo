const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

function syncPageMode(){
  const home=!!$('.home.page-theme');
  const editor=!!$('.editor.page-theme');
  document.documentElement.classList.toggle('dm62-home-active',home);
  document.body.classList.toggle('dm62-home-active',home);
  document.documentElement.classList.toggle('dm62-editor-active',editor);
  document.body.classList.toggle('dm62-editor-active',editor);
}

function actionMeta(el){
  const text=(el.textContent||'').replace(/\s+/g,' ').trim();
  if(el.matches('.dm53-editor-theme')) return ['🎨',''];
  if(el.id==='dm53-pdf-button') return ['📚','PDF'];
  if(el.matches('[data-v55-mini-top],.dm54-mini-top')) return ['📄','Mini'];
  if(el.matches('[data-v55-sheets],.dm54-sheets-button')){
    const n=text.match(/\((\d+)\)/)?.[1]||'0';
    return ['👥',`Fichas ${n}`];
  }
  if(el.matches('[data-v55-pjeditor],.dm54-pjlite-editor')) return ['👤','PJ'];
  if(el.matches('.dm60-window-jump')) return ['🔎','Janelas'];
  if(/importar ficha|pj lite/i.test(text)) return ['➕','Ficha'];
  if(/organizar/i.test(text)) return ['↕️','Ordem'];
  if(/config|ajuste/i.test(text)) return ['⚙️','Ajustes'];
  if(/^\+|adicionar/i.test(text)) return ['＋','Adicionar'];
  if(/pdf/i.test(text)) return ['📚','PDF'];
  return null;
}

function decorateTopActions(){
  const top=$('.editor.page-theme .top-actions');
  if(!top)return;
  [...top.children].forEach(el=>{
    if(!(el instanceof HTMLElement))return;
    const meta=actionMeta(el);
    if(!meta)return;
    el.dataset.dm62Action='1';
    el.dataset.dm62Icon=meta[0];
    el.dataset.dm62Short=meta[1];
    if(!el.title){
      const label=(el.textContent||meta[1]||'Ação').replace(/\s+/g,' ').trim();
      el.title=label;
    }
  });
}

function sync(){
  syncPageMode();
  decorateTopActions();
}

export function installEnhancementsV061(){
  sync();
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;sync();});
  });
  observer.observe(document.getElementById('root')||document.body,{childList:true,subtree:true,characterData:true});
  window.addEventListener('popstate',sync);
}
