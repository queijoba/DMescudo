const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

function syncEditorA11y(){
  const editor=$('.editor.page-theme');
  if(!editor)return;

  const rail=$('.tool-rail',editor);
  if(rail){
    rail.setAttribute('aria-label','Ferramentas do Mestre');
    rail.setAttribute('role','toolbar');
  }

  const settings=$$('.top-actions button',editor).find(btn=>(btn.textContent||'').trim()==='⚙');
  if(settings){
    settings.title='Ajustes do escudo e tema';
    settings.setAttribute('aria-label','Ajustes do escudo e tema');
  }
}

function syncGuide(){
  const guide=$('#dm53-guide');
  if(!guide)return;

  const barPanel=$('[data-panel="barra"]',guide);
  if(barPanel&&!barPanel.dataset.dm66Reviewed){
    barPanel.dataset.dm66Reviewed='1';
    $$('li',barPanel).forEach(li=>{
      const text=(li.textContent||'').trim();
      if(text.startsWith('🎨 Tema:'))li.remove();
      if(text.startsWith('⚙ Ajustes:'))li.innerHTML='<b>⚙ Ajustes:</b> tema, escala da interface e fundo personalizado do escudo.';
    });
    if(!$('.dm66-theme-note',barPanel)){
      const note=document.createElement('div');
      note.className='dm63-tip dm66-theme-note';
      note.innerHTML='<b>Tema:</b> para evitar uma barra redundante no escudo, a troca de tema fica concentrada em <b>⚙ Ajustes</b> e na Home.';
      barPanel.appendChild(note);
    }
  }
}

function sync(){
  syncEditorA11y();
  syncGuide();
}

export function installEnhancementsV066(){
  sync();
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      sync();
    });
  });
  observer.observe(document.getElementById('root')||document.body,{childList:true,subtree:true});
}
