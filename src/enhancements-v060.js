const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

function windowTitle(widget,index){
  const input=$('.widget-head input',widget);
  const value=(input?.value||input?.getAttribute('value')||'').trim();
  if(value)return value;
  if($('.pj-card',widget))return 'Ficha importada';
  return `Janela ${index+1}`;
}

function windowIcon(widget){
  if($('.pj-card',widget))return '👤';
  const text=(widget.textContent||'').toLowerCase();
  if(text.includes('iniciativa'))return '⚔️';
  if(text.includes('dados'))return '🎲';
  if(text.includes('relógio'))return '◷';
  if(text.includes('npc'))return '👤';
  if(text.includes('tabela'))return '▦';
  if(text.includes('nota'))return '📝';
  if(text.includes('pdf'))return '📄';
  return '▣';
}

function createWindowLayer(){
  let layer=$('#dm60-window-layer');
  if(layer)return layer;
  layer=document.createElement('div');
  layer.id='dm60-window-layer';
  layer.className='dm60-window-layer';
  layer.hidden=true;
  layer.innerHTML=`<section class="dm60-window-modal" role="dialog" aria-modal="true" aria-label="Ir para janela"><header><h3>Ir para uma janela</h3><button type="button" data-close aria-label="Fechar">×</button></header><div class="dm60-window-list" data-list></div></section>`;
  document.body.appendChild(layer);
  const close=()=>{layer.hidden=true};
  $('[data-close]',layer).onclick=close;
  layer.addEventListener('pointerdown',e=>{if(e.target===layer)close()});
  return layer;
}

function openWindowJump(){
  const layer=createWindowLayer();
  const list=$('[data-list]',layer);
  const widgets=$$('.editor.page-theme .widget');
  list.innerHTML='';
  if(!widgets.length){
    list.innerHTML='<p style="margin:8px;color:var(--muted,#64748b)">Nenhuma janela aberta neste escudo.</p>';
  } else {
    widgets.forEach((widget,index)=>{
      const title=windowTitle(widget,index);
      const btn=document.createElement('button');
      btn.type='button';
      btn.innerHTML='<span></span><b></b><em>Ir</em>';
      $('span',btn).textContent=windowIcon(widget);
      $('b',btn).textContent=title;
      btn.onclick=()=>{
        layer.hidden=true;
        widget.scrollIntoView({behavior:'smooth',block:'start',inline:'nearest'});
        widget.classList.add('dm60-jump-flash');
        setTimeout(()=>widget.classList.remove('dm60-jump-flash'),1100);
      };
      list.appendChild(btn);
    });
  }
  layer.hidden=false;
}

function syncEditor(){
  const editor=$('.editor.page-theme');
  if(!editor)return;
  const top=$('.top-actions',editor);
  if(!top)return;

  if(!$('.dm60-window-jump',top)){
    const button=document.createElement('button');
    button.type='button';
    button.className='ui-btn dm60-window-jump';
    button.title='Ir para uma janela';
    button.setAttribute('aria-label','Ir para uma janela');
    button.textContent='🔎 Janelas';
    button.onclick=openWindowJump;
    const pj=$('[data-v55-pjeditor]',top);
    pj?top.insertBefore(button,pj):top.appendChild(button);
  }

  const theme=$('.dm53-editor-theme',top);
  if(theme){theme.title='Trocar tema';theme.setAttribute('aria-label','Trocar tema')}
  const pj=$('[data-v55-pjeditor]',top);
  if(pj){pj.title='Abrir PJ Lite';pj.setAttribute('aria-label','Abrir PJ Lite')}
  const mini=$('[data-v55-mini-top]',top);
  if(mini){mini.title='Abrir PDF Mini';mini.setAttribute('aria-label','Abrir PDF Mini')}
  const pdf=$('#dm53-pdf-button',top);
  if(pdf){pdf.title='Abrir materiais PDF';pdf.setAttribute('aria-label','Abrir materiais PDF')}
}

function syncHome(){
  const about=$('.home.page-theme [data-v55-about]');
  if(about){about.title='Sobre e atualizações — disponível também no fim da página'}
}

function sync(){syncEditor();syncHome()}

export function installEnhancementsV060(){
  createWindowLayer();
  sync();
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;sync()});
  });
  observer.observe(document.getElementById('root')||document.body,{childList:true,subtree:true});
}
