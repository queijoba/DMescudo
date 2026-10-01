const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const BOARD_KEY='dmlite_second_board_v1';
const MINI_KEY='dmlite_mini_pdf_v1';
let workspace=null;
let knownWidgets=new WeakSet();
let observer=null;
let centering=false;

function boardEnabled(){
  try{return localStorage.getItem(BOARD_KEY)==='1'}catch{return false}
}
function setBoardEnabled(value){
  try{localStorage.setItem(BOARD_KEY,value?'1':'0')}catch{}
  document.documentElement.classList.toggle('dm65-second-board-active',value);
  document.body.classList.toggle('dm65-second-board-active',value);
  const ed=$('.editor.page-theme');
  ed?.classList.toggle('dm65-has-second-board',value);
  const btn=$('.dm65-board-toggle');
  if(btn){
    btn.classList.toggle('is-active',value);
    btn.textContent=value?'− Quadro 2':'＋ Quadro 2';
    btn.title=value?'Remover segundo quadro':'Adicionar segundo quadro';
    btn.setAttribute('aria-pressed',String(value));
  }
  if(!value)window.scrollTo({top:0,behavior:'smooth'});
}

function ensureBoardToggle(){
  const ed=$('.editor.page-theme');
  const top=$('.top-actions',ed||document);
  if(!ed||!top)return;
  let btn=$('.dm65-board-toggle',top);
  if(!btn){
    btn=document.createElement('button');
    btn.type='button';
    btn.className='ui-btn dm65-board-toggle';
    btn.onclick=()=>setBoardEnabled(!document.body.classList.contains('dm65-second-board-active'));
    top.appendChild(btn);
  }
  setBoardEnabled(boardEnabled());
}

function desiredPosition(el,ws){
  const wr=ws.getBoundingClientRect();
  const er=el.getBoundingClientRect();
  const w=er.width||360,h=er.height||310;
  const x=Math.max(12,Math.min((wr.width-w)/2,Math.max(12,wr.width-w-12)));
  const visibleTop=Math.max(0,-wr.top);
  const viewportCenter=visibleTop+Math.max(58,(window.innerHeight-h)/2);
  const maxY=Math.max(12,ws.scrollHeight-h-54);
  const y=Math.max(12,Math.min(viewportCenter,maxY));
  return{x,y};
}

function commitCenterByDrag(el){
  if(centering||!workspace||matchMedia('(max-width:760px)').matches)return;
  const head=$('.widget-head',el);
  if(!head)return;
  const wr=workspace.getBoundingClientRect(),er=el.getBoundingClientRect();
  const target=desiredPosition(el,workspace);
  const currentX=er.left-wr.left,currentY=er.top-wr.top;
  const dx=target.x-currentX,dy=target.y-currentY;
  const sx=er.left+Math.min(24,Math.max(8,er.width*.08));
  const sy=er.top+18;
  if(Math.abs(dx)<2&&Math.abs(dy)<2)return;
  centering=true;
  try{
    const pid=65001;
    head.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:pid,pointerType:'mouse',isPrimary:true,button:0,buttons:1,clientX:sx,clientY:sy}));
    window.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,cancelable:true,pointerId:pid,pointerType:'mouse',isPrimary:true,button:0,buttons:1,clientX:sx+dx,clientY:sy+dy}));
    window.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,pointerId:pid,pointerType:'mouse',isPrimary:true,button:0,buttons:0,clientX:sx+dx,clientY:sy+dy}));
  }catch{
    el.style.left=`${target.x}px`;
    el.style.top=`${target.y}px`;
  }
  el.style.zIndex='999';
  el.classList.add('dm65-new-widget');
  setTimeout(()=>el.classList.remove('dm65-new-widget'),800);
  setTimeout(()=>{centering=false},40);
}

function centerMini(mini){
  if(!workspace||matchMedia('(max-width:760px)').matches)return;
  const wr=workspace.getBoundingClientRect();
  const r=mini.getBoundingClientRect();
  const w=r.width||370,h=r.height||440;
  const x=Math.max(12,(wr.width-w)/2);
  const visibleTop=Math.max(0,-wr.top);
  const y=Math.max(12,Math.min(visibleTop+Math.max(58,(window.innerHeight-h)/2),Math.max(12,workspace.scrollHeight-h-54)));
  mini.style.left=`${x}px`;
  mini.style.top=`${y}px`;
  mini.style.zIndex='999';
  try{
    const prev=JSON.parse(localStorage.getItem(MINI_KEY)||'{}');
    localStorage.setItem(MINI_KEY,JSON.stringify({...prev,x,y,w,h}));
  }catch{}
}

function markInitial(ws){
  workspace=ws;
  knownWidgets=new WeakSet();
  $$('.widget',ws).forEach(el=>knownWidgets.add(el));
}

function inspectAdded(node){
  if(!(node instanceof Element)||!workspace)return;
  const widgets=[];
  if(node.matches?.('.widget'))widgets.push(node);
  widgets.push(...$$('.widget',node));
  widgets.forEach(el=>{
    if(knownWidgets.has(el))return;
    knownWidgets.add(el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>commitCenterByDrag(el)));
  });
  const minis=[];
  if(node.matches?.('#dm55-mini'))minis.push(node);
  minis.push(...$$('#dm55-mini',node));
  minis.forEach(mini=>requestAnimationFrame(()=>requestAnimationFrame(()=>centerMini(mini))));
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
  if(ws&&ws!==workspace)markInitial(ws);
}

export function installEnhancementsV065(){
  sync();
  observer?.disconnect();
  observer=new MutationObserver(muts=>{
    sync();
    muts.forEach(m=>m.addedNodes.forEach(inspectAdded));
  });
  observer.observe(document.getElementById('root')||document.body,{subtree:true,childList:true});
}
