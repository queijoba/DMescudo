const PJ_LITE_URL='https://pjlite.vercel.app/';
const VERSION='0.5.4 Alpha';

const LOG=[
  ['0.5.4 Alpha','Migração definitiva para a nova base, mobile aproximado do PJ Lite, salvamento antigo preservado e revisão da Home para telas pequenas.'],
  ['0.5.3 Alpha','Tema escuro corrigido nas mini fichas, PDF Mini mais nítido e integração prática com o PJ Lite.'],
  ['0.5.2 Alpha','PDF Mini, Guia ampliado, Fichas do Grupo, leitor de materiais e painel de atualizações.'],
  ['0.5.1 Alpha','Arraste estabilizado, escudos prontos ampliados e identidade visual aproximada do ecossistema Lite.'],
];

function createFooter(){
  const shell=document.querySelector('.home.page-theme .home-shell');
  if(!shell||shell.querySelector('.dm59-project-footer'))return;

  const section=document.createElement('section');
  section.className='dm59-project-footer';
  section.innerHTML=`
    <header class="dm59-project-head">
      <h2>SOBRE O PROJETO & ATUALIZAÇÕES</h2>
      <span>${VERSION.toUpperCase()}</span>
    </header>
    <div class="dm59-project-grid">
      <section class="dm59-log-col">
        <h3>LOG DE ATUALIZAÇÕES</h3>
        <div class="dm59-log-list">${LOG.map(([v,d])=>`<p><b>${v}:</b> ${d}</p>`).join('')}</div>
        <div class="dm59-credits">
          <h4>CRÉDITOS DE DESENVOLVIMENTO</h4>
          <p>DM Lite é um projeto comunitário, gratuito e de código aberto para ajudar Mestres a organizar a mesa sem transformar a experiência em um VTT completo.</p>
          <a href="https://t.me/boost/Baianoviado" target="_blank" rel="noreferrer noopener">✈ Canal de anúncios e novidades no Telegram ↗</a>
        </div>
        <details class="dm59-backup-info">
          <summary>▸ 💾 BACKUP & RESTAURAÇÃO</summary>
          <p>Os escudos são salvos automaticamente neste navegador. Para trocar de aparelho ou manter uma cópia segura, use Exportar no card do escudo e guarde o JSON ou o Código DM Lite.</p>
        </details>
      </section>
      <aside class="dm59-project-col">
        <small>DM LITE</small>
        <h3>ESCUDO DIGITAL DO MESTRE</h3>
        <p class="dm59-project-sub">Organização rápida, consulta de regras, fichas resumidas e materiais da sessão.</p>
        <div class="dm59-open-source">
          <h4>PROJETO DE CÓDIGO ABERTO 🔓</h4>
          <p>Seus dados ficam localmente no navegador. O DM Lite foi pensado para trabalhar junto do PJ Lite: o jogador mantém a ficha completa e o Mestre importa apenas o que precisa consultar.</p>
        </div>
        <a class="dm59-pjlite-card" href="${PJ_LITE_URL}" target="_blank" rel="noreferrer noopener">
          <strong>CONFIRA O PJ LITE 👤</strong>
          <span>Gerencie fichas de personagens e envie para o DM Lite por Código da Ficha, ZIP ou JSON.</span>
        </a>
      </aside>
    </div>`;
  shell.appendChild(section);
}

function syncFooter(){
  const home=document.querySelector('.home.page-theme');
  if(!home)return;
  createFooter();
}

export function installEnhancementsV059(){
  syncFooter();
  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;syncFooter();});
  };
  const observer=new MutationObserver(schedule);
  observer.observe(document.getElementById('root')||document.body,{childList:true,subtree:true});
}
