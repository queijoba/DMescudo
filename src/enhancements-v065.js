const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const BOARD_KEY='dmlite_second_board_v1';
const MINI_KEY='dmlite_mini_pdf_v1';
let workspace=null;
let observer=null;
let queued=false;
const knownWidgets=new WeakSet();
const knownMinis=new WeakSet();

function boardEnabled(){try{return localStorage.getItem(BOARD_KEY)==='1'}catch{return false}}
function setBoardEnabled(value,{scroll=true}={}){
  try{localStorage.setItem(BOARD_KEY,value?'1':'0')}catch{}
  const current=document.body.classList.contains('dm65-second-board-active');
  document.documentElement.classList.toggle('dm65-second-board-active',value);
  document.body.classList.toggle('dm65-second-board-active',value);
  $('.editor.page-theme')?.classList.toggle('dm65-has-second-board',value);
  const btn=$('.dm65-board-toggle');
  if(btn){
    btn.classList.toggle('is-active',value);
    btn.textContent=value?'− Quadro 2':'＋ Quadro 2';
    btn.title=value?'Remover segundo quadro':'Adicionar segundo quadro';
    btn.setAttribute('aria-pressed',String(value));
  }
  if(scroll&&current&&!value)window.scrollTo({top:0,behavior:'smooth'});
}

function ensureBoardToggle(){
  const ed=$('.editor.page-theme'),top=$('.top-actions',ed||document);if(!ed||!top)return;
  let btn=$('.dm65-board-toggle',top);
  if(!btn){
    btn=document.createElement('button');
    btn.type='button';
    btn.className='ui-btn dm65-board-toggle';
    btn.onclick=()=>setBoardEnabled(!document.body.classList.contains('dm65-second-board-active'));
    top.appendChild(btn);
  }
  setBoardEnabled(boardEnabled(),{scroll:false});
}

function viewportCenterFor(el){
  if(!workspace)return null;
  const wr=workspace.getBoundingClientRect(),r=el.getBoundingClientRect();
  const w=r.width||430,h=r.height||390;
  const x=Math.max(12,Math.min((wr.width-w)/2,Math.max(12,wr.width-w-12)));
  const visibleTop=Math.max(0,-wr.top);
  const viewportBottom=Math.min(window.innerHeight,wr.bottom);
  const viewportTop=Math.max(0,wr.top);
  const visibleHeight=Math.max(220,viewportBottom-viewportTop);
  const y=Math.max(12,Math.min(visibleTop+(visibleHeight-h)/2,Math.max(12,workspace.scrollHeight-h-54)));
  return{x,y};
}

function bringWidgetForward(el){
  if(matchMedia('(max-width:760px)').matches||knownWidgets.has(el))return;
  knownWidgets.add(el);
  const isPJ=!!$('.pj-card',el);
  if(isPJ){
    const pos=viewportCenterFor(el);
    if(pos){
      el.style.left=`${pos.x}px`;
      el.style.top=`${pos.y}px`;
      el.dataset.dm65Centered='pj';
    }
  }
  el.style.zIndex='9999';
  el.classList.add('dm65-new-widget');
  requestAnimationFrame(()=>{
    try{el.scrollIntoView({block:'center',inline:'center',behavior:'smooth'});}catch{}
  });
  setTimeout(()=>{
    el.classList.remove('dm65-new-widget');
    if(!isPJ&&el.style.zIndex==='9999')el.style.zIndex='';
  },900);
}

function centerMini(mini){
  if(!workspace||matchMedia('(max-width:760px)').matches||knownMinis.has(mini))return;
  knownMinis.add(mini);
  const wr=workspace.getBoundingClientRect(),r=mini.getBoundingClientRect(),w=r.width||370,h=r.height||440;
  const x=Math.max(12,(wr.width-w)/2),visibleTop=Math.max(0,-wr.top),y=Math.max(12,Math.min(visibleTop+Math.max(58,(window.innerHeight-h)/2),Math.max(12,workspace.scrollHeight-h-54)));
  mini.style.left=`${x}px`;
  mini.style.top=`${y}px`;
  mini.style.zIndex='9999';
  try{const prev=JSON.parse(localStorage.getItem(MINI_KEY)||'{}');localStorage.setItem(MINI_KEY,JSON.stringify({...prev,x,y,w,h}))}catch{}
  setTimeout(()=>{if(mini.style.zIndex==='9999')mini.style.zIndex='';},900);
}

function inspectAdded(node){
  if(!(node instanceof Element)||!workspace)return;
  const widgets=[];
  if(node.matches?.('.widget'))widgets.push(node);
  widgets.push(...$$('.widget',node));
  widgets.forEach(el=>requestAnimationFrame(()=>bringWidgetForward(el)));
  const minis=[];
  if(node.matches?.('#dm55-mini'))minis.push(node);
  minis.push(...$$('#dm55-mini',node));
  minis.forEach(el=>requestAnimationFrame(()=>centerMini(el)));
}

function sync(){
  const ed=$('.editor.page-theme');
  if(!ed){
    document.documentElement.classList.remove('dm65-second-board-active');
    document.body.classList.remove('dm65-second-board-active');
    workspace=null;
    return;
  }
  ensureBoardToggle();
  const ws=$('.workspace',ed);
  if(ws&&ws!==workspace){
    workspace=ws;
    $$('.widget',ws).forEach(el=>knownWidgets.add(el));
    const mini=$('#dm55-mini');if(mini)knownMinis.add(mini);
  }
}

function scheduleSync(nodes=[]){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{
    queued=false;
    sync();
    nodes.forEach(inspectAdded);
  });
}

export function installEnhancementsV065(){
  sync();
  observer?.disconnect();
  observer=new MutationObserver(muts=>{
    const nodes=[];
    muts.forEach(m=>m.addedNodes.forEach(n=>nodes.push(n)));
    scheduleSync(nodes);
  });
  observer.observe(document.getElementById('root')||document.body,{subtree:true,childList:true});
}
