import * as React from 'react';
import LZString from 'lz-string';
import {
  isSupabaseConfigured,
  getSession,
  signInWithGoogle,
  signInWithOtp,
  signOut,
  onAuthStateChange,
  getProfile,
  listGroups,
  listInbox,
  markShareImported,
  dismissShare,
} from './dmliteCloud.js';
import './dmlite-cloud.css';

const systemLabel = system => ({
  dragonbane:'Dragonbane',
  dnd5e:'D&D 5.5e',
  fabula:'Fabula Ultima',
  somdas6:'O Som das Seis',
  '3det':'3DeT Victory',
  rotaZero:'Rota Zero',
  skyfall:'Skyfall',
  ordem:'Ordem Paranormal',
  ordemParanormal:'Ordem Paranormal',
}[system] || system || 'RPG');

const sheetName = packet => String(packet?.name || packet?.payload?.bio?.nome || packet?.payload?.nome || 'Ficha sem nome').trim() || 'Ficha sem nome';

const makePJCode = payload => {
  const copy = JSON.parse(JSON.stringify(payload || {}));
  if (copy.bio?.imagem) copy.bio.imagem = '';
  if (copy.imagem) copy.imagem = '';
  return LZString.compressToBase64(JSON.stringify(copy));
};

const downloadPayload = packet => {
  const payload = packet?.payload || {};
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
  const a = document.createElement('a');
  const safe = sheetName(packet).replace(/[^a-z0-9_-]+/gi, '_') || 'Ficha';
  a.href = URL.createObjectURL(blob);
  a.download = 'PJLite_' + safe + '.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

const Member = ({member,currentUserId}) => {
  const name = String(member?.name || (member?.userId === currentUserId ? 'Você' : 'Jogador')).trim() || 'Jogador';
  const tags = Array.isArray(member?.achievementTags) ? member.achievementTags : [];
  return <div className="dmcloud-member">
    <div className="dmcloud-avatar">{member?.avatar?<img src={member.avatar} alt=""/>:<span>{name.charAt(0).toUpperCase()}</span>}</div>
    <div><strong>{name}</strong><small>{member?.role==='owner'?'Dono do grupo':'Membro'}</small>
      <div className="dmcloud-tags">{tags.length?tags.map(tag=><span key={tag.id||tag.label}>{tag.label}</span>):<em>Sem conquistas</em>}</div>
    </div>
  </div>;
};

export default function DMLiteCloudPanel({notify=()=>{},onAddSheet=null,currentShieldName=''}) {
  const [open,setOpen] = React.useState(false);
  const [tab,setTab] = React.useState('inbox');
  const [session,setSession] = React.useState(null);
  const [profile,setProfile] = React.useState(null);
  const [groups,setGroups] = React.useState([]);
  const [inbox,setInbox] = React.useState([]);
  const [email,setEmail] = React.useState('');
  const [busy,setBusy] = React.useState(false);

  const account = session?.user ? {
    id: session.user.id,
    email: session.user.email || '',
    name: profile?.display_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Mestre',
    avatar: profile?.avatar_url || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
  } : null;

  const pending = inbox.filter(item => item.status === 'pending');

  const refresh = React.useCallback(async (silent=false) => {
    if (!session?.user) { setGroups([]); setInbox([]); return; }
    if (!silent) setBusy(true);
    try {
      const [nextGroups,nextInbox] = await Promise.all([listGroups(),listInbox()]);
      setGroups(nextGroups || []);
      setInbox(nextInbox || []);
    } catch (error) {
      console.error('DM Lite: Conta Lite',error);
      if (!silent) notify('Não foi possível atualizar grupos e fichas recebidas.');
    } finally {
      if (!silent) setBusy(false);
    }
  },[session?.user?.id,notify]);

  React.useEffect(()=>{
    let active=true;
    getSession().then(next=>{if(active)setSession(next)}).catch(error=>console.error('DM Lite: sessão',error));
    const unsubscribe=onAuthStateChange(next=>{if(active)setSession(next)});
    return()=>{active=false;unsubscribe?.()};
  },[]);

  React.useEffect(()=>{
    if(!session?.user){setProfile(null);setGroups([]);setInbox([]);return;}
    let active=true;
    (async()=>{
      try{
        const next=await getProfile();
        if(active)setProfile(next);
        if(active){
          const [g,i]=await Promise.all([listGroups(),listInbox()]);
          if(active){setGroups(g||[]);setInbox(i||[]);}
        }
      }catch(error){console.error('DM Lite: inicialização Conta Lite',error)}
    })();
    return()=>{active=false};
  },[session?.user?.id]);

  const loginGoogle=async()=>{
    try{await signInWithGoogle();}
    catch(error){console.error(error);notify('Não foi possível abrir o login Google.');}
  };
  const loginEmail=async()=>{
    const clean=String(email||'').trim().toLowerCase();
    if(!clean.includes('@'))return notify('Digite um e-mail válido.');
    try{await signInWithOtp(clean);setEmail('');notify('✉️ Link de acesso enviado para seu e-mail.');}
    catch(error){console.error(error);notify('Não foi possível enviar o link de acesso.');}
  };
  const logout=async()=>{
    try{await signOut();setOpen(false);notify('Conta Lite desconectada do DM Lite.');}
    catch(error){console.error(error);notify('Não foi possível sair da Conta Lite.');}
  };
  const copyCode=async packet=>{
    try{await navigator.clipboard.writeText(makePJCode(packet.payload));notify('Código da ficha copiado.');}
    catch{notify('Não foi possível copiar o código automaticamente.');}
  };
  const addToShield=async packet=>{
    if(!onAddSheet)return notify('Abra um escudo antes de adicionar a ficha.');
    try{
      onAddSheet(packet.payload);
      await markShareImported(packet.id);
      await refresh(true);
      notify('✓ Ficha adicionada ao escudo' + (currentShieldName?' “'+currentShieldName+'”':'') + '.');
      setOpen(false);
    }catch(error){
      console.error(error);
      notify('Não foi possível adicionar esta ficha ao escudo.');
    }
  };
  const archive=async packet=>{
    try{await dismissShare(packet.id);await refresh(true);notify('Compartilhamento arquivado.');}
    catch(error){console.error(error);notify('Não foi possível arquivar.');}
  };

  if(!isSupabaseConfigured)return null;

  const groupName = id => groups.find(g=>g.id===id)?.name || '';
  const senderName = packet => {
    for(const group of groups){
      const found=(group.members||[]).find(member=>(member.userId||member.user_id)===packet.sender_id);
      if(found)return found.name || 'Jogador';
    }
    return 'Jogador';
  };

  return <>
    <button type="button" className="dmcloud-trigger" onClick={()=>setOpen(true)} title="Conta Lite, grupos e fichas recebidas">
      <span>☁</span><b>{account?'Conta Lite':'Entrar'}</b>{pending.length>0&&<em>{pending.length}</em>}
    </button>

    {open&&<div className="dmcloud-layer" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
      <section className="dmcloud-panel" role="dialog" aria-modal="true" aria-label="Conta Lite do DM Lite">
        <header className="dmcloud-head">
          <div><small>DM LITE + PJ LITE</small><h2>Conta Lite</h2><p>Mesma conta e mesmos grupos do PJ Lite.</p></div>
          <button onClick={()=>setOpen(false)} aria-label="Fechar">×</button>
        </header>

        <nav className="dmcloud-tabs">
          <button className={tab==='account'?'active':''} onClick={()=>setTab('account')}>👤 Conta</button>
          <button className={tab==='groups'?'active':''} onClick={()=>setTab('groups')}>♟ Grupos</button>
          <button className={tab==='inbox'?'active':''} onClick={()=>setTab('inbox')}>✉ Recebidos {pending.length>0&&<span>{pending.length}</span>}</button>
        </nav>

        <div className="dmcloud-body">
          {!account ? <div className="dmcloud-login">
            <div className="dmcloud-callout"><b>Use a mesma Conta Lite do PJ Lite</b><span>O login usa o mesmo projeto online; nenhuma segunda conta é criada.</span></div>
            <button className="dmcloud-primary" onClick={loginGoogle}>G&nbsp;&nbsp;Continuar com Google</button>
            <div className="dmcloud-divider"><span>ou</span></div>
            <label><span>E-mail</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@gmail.com" onKeyDown={e=>e.key==='Enter'&&loginEmail()}/></label>
            <button onClick={loginEmail}>Enviar link de acesso</button>
            <small className="dmcloud-note">Por segurança do navegador, PJ Lite e DM Lite mantêm a sessão local separadamente, mas usam a mesma conta online.</small>
          </div> : tab==='account' ? <>
            <div className="dmcloud-account">
              <div className="dmcloud-avatar big">{account.avatar?<img src={account.avatar} alt=""/>:<span>{account.name.charAt(0).toUpperCase()}</span>}</div>
              <div><strong>{account.name}</strong><small>{account.email}</small><em>☁ Conta conectada</em></div>
            </div>
            <div className="dmcloud-block"><h3>Integração com o escudo</h3><p>{onAddSheet?<>O escudo <b>{currentShieldName||'atual'}</b> pode receber fichas do grupo diretamente.</>:<>Abra um escudo para habilitar o botão <b>Adicionar ao escudo</b>.</>}</p></div>
            <div className="dmcloud-actions"><button onClick={()=>refresh(false)} disabled={busy}>{busy?'Atualizando…':'↻ Atualizar'}</button><button onClick={logout}>Sair</button></div>
          </> : tab==='groups' ? <>
            <div className="dmcloud-block dmcloud-summary"><div><strong>{groups.length}</strong><span>grupos</span></div><div><strong>{groups.reduce((n,g)=>n+(g.members?.length||0),0)}</strong><span>perfis visíveis</span></div></div>
            {groups.length===0?<div className="dmcloud-empty">Nenhum grupo encontrado nesta Conta Lite.</div>:<div className="dmcloud-groups">{groups.map(group=><article key={group.id}>
              <header><div><strong>{group.name}</strong><small>{group.isOwner?'Você é o mestre/dono':'Você participa deste grupo'}</small></div><code>{group.invite_code}</code></header>
              <div className="dmcloud-members">{(group.members||[]).map(member=><Member key={member.userId||member.user_id} member={member} currentUserId={account.id}/>)}</div>
            </article>)}</div>}
          </> : <>
            <div className="dmcloud-inbox-head"><div><h3>Fichas enviadas ao grupo</h3><p>O Mestre pode colocar a ficha no escudo, copiar o Código da Ficha ou baixar o JSON.</p></div><button onClick={()=>refresh(false)} disabled={busy}>↻</button></div>
            {pending.length===0?<div className="dmcloud-empty"><b>Nenhuma ficha nova.</b><span>Quando alguém compartilhar uma ficha pelo grupo no PJ Lite, ela aparece aqui.</span></div>:<div className="dmcloud-inbox">{pending.map(packet=><article key={packet.id}>
              <div className="dmcloud-sheet-icon">👤</div>
              <div className="dmcloud-sheet-main"><div className="dmcloud-sheet-title"><strong>{sheetName(packet)}</strong><span>{systemLabel(packet.system||packet.payload?.system)}</span></div>
                <small>Enviada por {senderName(packet)}{packet.group_id&&groupName(packet.group_id)?' · '+groupName(packet.group_id):''} · {new Date(packet.sent_at).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}</small>
                <div className="dmcloud-sheet-actions">
                  <button className="dmcloud-primary" disabled={!onAddSheet} onClick={()=>addToShield(packet)}>＋ Adicionar ao escudo</button>
                  <button onClick={()=>copyCode(packet)}>⧉ Código</button>
                  <button onClick={()=>downloadPayload(packet)}>⇩ JSON</button>
                  <button className="quiet" onClick={()=>archive(packet)}>Arquivar</button>
                </div>
              </div>
            </article>)}</div>}
          </>}
        </div>
      </section>
    </div>}
  </>;
}
