const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

function parseColor(value=''){
  const v=String(value).trim();
  if(v.startsWith('#')){
    const h=v.slice(1);
    if(h.length===3){
      const r=parseInt(h[0]+h[0],16),g=parseInt(h[1]+h[1],16),b=parseInt(h[2]+h[2],16);
      return [r,g,b];
    }
    if(h.length>=6){
      return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
    }
  }
  const m=v.match(/rgba?\(([^)]+)\)/i);
  if(m){
    const n=m[1].split(',').slice(0,3).map(x=>Number.parseFloat(x.trim()));
    if(n.every(Number.isFinite))return n;
  }
  return null;
}

function luminance(rgb){
  if(!rgb)return .5;
  const conv=rgb.map(v=>{
    const s=Math.max(0,Math.min(255,v))/255;
    return s<=.04045?s/12.92:Math.pow((s+.055)/1.055,2.4);
  });
  return .2126*conv[0]+.7152*conv[1]+.0722*conv[2];
}

function syncContrast(){
  $$('.page-theme').forEach(root=>{
    const style=getComputedStyle(root);
    const raw=style.getPropertyValue('--text').trim()||style.color;
    const outline=luminance(parseColor(raw))>.42?'#111827':'#ffffff';
    if(root.style.getPropertyValue('--text-outline')!==outline){
      root.style.setProperty('--text-outline',outline);
    }
    if(root.style.getPropertyValue('--light-text-outline')!=='#111827')root.style.setProperty('--light-text-outline','#111827');
    if(root.style.getPropertyValue('--dark-text-outline')!=='#ffffff')root.style.setProperty('--dark-text-outline','#ffffff');
  });
}

export function installEnhancementsV064(){
  syncContrast();
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;syncContrast();});
  });
  observer.observe(document.getElementById('root')||document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});
}
