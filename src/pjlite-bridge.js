import JSZip from 'jszip';
import LZString from 'lz-string';

const DND_SKILLS = [
  ['acrobacia','Acrobacia','des'],['arcanismo','Arcanismo','int'],['atletismo','Atletismo','for'],['atuacao','Atuação','car'],['enganacao','Enganação','car'],['furtividade','Furtividade','des'],['historia','História','int'],['intimidacao','Intimidação','car'],['intuicao','Intuição','sab'],['investigacao','Investigação','int'],['lidaranimais','Lidar com Animais','sab'],['medicina','Medicina','sab'],['natureza','Natureza','int'],['percepcao','Percepção','sab'],['persuasao','Persuasão','car'],['prestidigitacao','Prestidigitação','des'],['religiao','Religião','int'],['sobrevivencia','Sobrevivência','sab'],
];
const DET_SKILLS = { animais:'Animais',arte:'Arte',esporte:'Esporte',influencia:'Influência',luta:'Luta',manha:'Manha',maquinas:'Máquinas',medicina:'Medicina',mistica:'Mística',percepcao:'Percepção',saber:'Saber',sobrevivencia:'Sobrevivência' };
const SYSTEM_NAMES = { dragonbane:'Dragonbane', dnd5e:'D&D 5.5e', fabula:'Fabula Ultima', somdas6:'O Som das Seis', '3det':'3DeT Victory', rotaZero:'Rota Zero' };
const value = (v, fallback='—') => v === undefined || v === null || v === '' ? fallback : v;
const signed = n => Number(n) >= 0 ? `+${Number(n)||0}` : String(Number(n)||0);
const mod = score => Math.floor((Number(score || 10) - 10) / 2);
const prof = lvl => 2 + Math.floor((Math.max(1, Number(lvl)||1)-1)/4);
const section = (title, items) => { const clean=(items||[]).filter(Boolean); return clean.length ? {title,items:clean} : null; };

export function decodePJLiteCode(code) {
  const raw = String(code || '').trim();
  if (!raw) throw new Error('Cole o Código da Ficha do PJ Lite.');
  const json = LZString.decompressFromBase64(raw);
  if (!json) throw new Error('Código inválido. Use o botão “Código da Ficha” do PJ Lite atual.');
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object' || !data.system) throw new Error('O código não parece ser uma ficha do PJ Lite.');
  return data;
}

export async function readPJLiteFile(file) {
  if (!file) throw new Error('Escolha um arquivo.');
  let text = '';
  const isZip = /\.zip$/i.test(file.name || '') || /zip/i.test(file.type || '');
  if (isZip) {
    const zip = await JSZip.loadAsync(file);
    const entries = Object.values(zip.files).filter(entry => !entry.dir && /\.json$/i.test(entry.name));
    if (!entries.length) throw new Error('O ZIP não contém uma ficha JSON do PJ Lite.');
    text = await entries[0].async('string');
  } else {
    text = await file.text();
  }
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object' || !data.system) throw new Error('Arquivo incompatível com o PJ Lite atual.');
  return data;
}

export function buildQuickCard(item) {
  const system = item?.system || 'unknown';
  const type = item?.type || 'pc';
  const name = item?.bio?.nome || item?.nome || 'Sem Nome';
  const stats = [];
  const sections = [];
  let subtitle = `${SYSTEM_NAMES[system] || system} · ${type}`;
  let initiative = '';
  let hp = '';

  if (system === 'dragonbane' && type === 'pc') {
    const st=item.status||{}, bio=item.bio||{};
    hp=`${value(st.pv?.atual,0)}/${value(st.pv?.max,0)}`;
    subtitle=`${value(bio.ancestralidade)} · ${value(bio.profissao)}`;
    stats.push(['PV',hp],['PD',`${value(st.pd?.atual,0)}/${value(st.pd?.max,0)}`],['Mov.',value(item.derivados?.movimento)],['FOR+',value(item.derivados?.danoBonusFor)],['AGL+',value(item.derivados?.danoBonusAgl)],['Prof.',value(bio.profissao)]);
    const skills=[...(item.periciasBase||[]),...(item.periciasArmas||[]),...(item.periciasSecundarias||[])].filter(p=>p?.treinada||Number(p?.valor)>=12).map(p=>`${p.treinada?'Treinada · ':''}${value(p.nome)} ${value(p.valor)}`);
    sections.push(section('Perícias',skills));
    sections.push(section('Habilidades & Feitiços',(item.habilidadesFeiticos||[]).map(h=>h?.nome?`${h.nome}${h.descricao||h.desc?` — ${h.descricao||h.desc}`:''}`:null)));
    sections.push(section('Armas',(item.armas||[]).map(a=>a?.nome?`${a.nome} · ${value(a.dano)}`:null)));
  } else if (system === 'dragonbane') {
    const st=item.status||{}; hp=`${value(st.pv?.atual,0)}/${value(st.pv?.max,0)}`;
    subtitle= type==='pnj' ? `${value(item.ancestralidade)} · ${value(item.profissao)}` : `${value(item.tamanho)} · Ameaça`;
    stats.push(['PV',hp],['Mov.',value(item.movimento)],['Armadura',value(item.armaduraTipica?.valor ?? item.armadura)],['Tipo',value(item.tipoPnj || type)],['Feroc.',value(item.ferocidade,'—')],['Dano+',value(item.danoBonus,'—')]);
    sections.push(section('Perícias',(item.pericias||[]).map(p=>p?.nome?`${p.nome} ${value(p.valor)}`:null)));
    sections.push(section('Ataques',[...(item.armas||[]).map(a=>a?.nome?`${a.nome} · ${value(a.dano)}`:null),...(item.ataques||[]).map(a=>a?.descricao||a?.nome)]));
    sections.push(section('Habilidades',(item.habilidades||item.feiticos||[]).map(h=>h?.nome?`${h.nome}${h.desc?` — ${h.desc}`:''}`:null)));
  } else if (system === 'dnd5e' && type === 'pc') {
    const bio=item.bio||{}, st=item.status||{}, attrs=item.atributos||{}; const p=prof(bio.nivel);
    initiative=st.iniciativa || signed(mod(attrs.des)); hp=`${value(st.pvAtual,0)}/${value(st.pvMax,0)}`;
    subtitle=`${value(bio.linhagem)} · ${value(bio.classe)} Nv. ${value(bio.nivel,1)}`;
    stats.push(['PV',hp],['CA',value(st.ca,10)],['Inic.',initiative],['Mov.',value(st.deslocamento)],['Nível',value(bio.nivel,1)],['Classe',value(bio.classe)]);
    sections.push(section('Perícias treinadas',DND_SKILLS.map(([id,label,attr])=>{const e=(item.pericias||[]).find(x=>x.id===id);if(!e?.prof)return null;return `${e.prof===2?'Expertise':'Treinada'} · ${label} ${signed(mod(attrs[attr])+Number(e.prof)*p)}`;})));
    sections.push(section('Características & Talentos',(item.caracteristicas||[]).map(x=>x?.nome?`${x.nome}${x.desc?` — ${x.desc}`:''}`:null)));
    sections.push(section('Ataques',(item.ataques||[]).map(x=>x?.nome?`${x.nome} · ${value(x.bonus)} · ${value(x.dano)}`:null)));
    sections.push(section('Magias',(item.magias?.lista||[]).map(x=>x?.nome?`${x.nome}${x.nivel!==undefined?` · círculo ${x.nivel}`:''}`:null)));
  } else if (system === 'dnd5e') {
    hp=String(value(item.pv,'')); subtitle=`${value(item.tamanho)} ${value(item.tipo)}`;
    stats.push(['PV',value(item.pv)],['CA',value(item.ca)],['ND',value(item.desafio)],['Mov.',value(item.deslocamento)],['Tipo',value(item.tipo)],['Tam.',value(item.tamanho)]);
    sections.push(section('Perícias',item.pericias?[item.pericias]:[]));
    sections.push(section('Traços',(item.tracos||[]).map(x=>x?.nome?`${x.nome}${x.desc?` — ${x.desc}`:''}`:null)));
    sections.push(section('Ações',(item.acoes||[]).map(x=>x?.nome?`${x.nome}${x.desc?` — ${x.desc}`:''}`:null)));
  } else if (system === 'fabula') {
    const st=item.status||{}; hp=`${value(st.pvAtual,0)}/${value(st.pvMax,0)}`; initiative=String(value(st.iniciativa,''));
    subtitle=type==='pc'?`${value(item.bio?.identidade)} · ${value(item.bio?.tema)}`:`${value(item.tipoNpc||'Ameaça')} · ${value(item.patente)}`;
    stats.push(['PV',hp],['PM',`${value(st.pmAtual,0)}/${value(st.pmMax,0)}`],['DEF',value(st.defesa)],['DEF.M',value(st.defesaMagica)],['Inic.',value(st.iniciativa)],['Nível',value(item.nivel,5)]);
    if(type==='pc'){
      sections.push(section('Classes',(item.classes||[]).map(c=>c?.nome?`${c.nome} · Nv. ${value(c.nivel,1)}`:null)));
      sections.push(section('Poderes',[...(item.classes||[]).flatMap(c=>(c?.poderes||[]).map(p=>p?.nome?`${p.nome}${p.desc?` — ${p.desc}`:''}`:null)),...(item.poderesHeroicos||[]).map(p=>p?.nome?`${p.nome}${p.desc?` — ${p.desc}`:''}`:null)]));
      sections.push(section('Equipamentos',(item.equipamentos||[]).map(e=>e?.nome?`${e.slot||'Item'}: ${e.nome}`:null)));
      sections.push(section('Magias & Rituais',[...(item.extras?.magia?.feiticos||[]).map(f=>f?.nome?`${f.nome}${f.pm?` · ${f.pm} PM`:''}`:null),...(item.extras?.magia?.rituais||[]).map(r=>r?.nome?`Ritual: ${r.nome}`:null)]));
    } else {
      sections.push(section('Ataques',(item.ataques||[]).map(a=>a?.nome?`${a.nome} · ${value(a.teste)} · ${value(a.dano)}`:null)));
      sections.push(section('Poderes & Regras',[...(item.poderes||[]),...(item.outrasAcoes||[]),...(item.regrasEspeciais||[])].map(x=>x?.nome?`${x.nome}${x.desc?` — ${x.desc}`:''}`:null)));
    }
  } else if (system === 'somdas6') {
    const st=item.status||{}; hp=`${value(st.pvAtual,0)}/${value(st.pvMax,0)}`; initiative=String(value(st.iniciativa ?? st.iniciativaBonus,''));
    subtitle=type==='pc'?`${value(item.bio?.apelido,'Sem apelido')} · Nível ${value(item.nivel,1)}`:`${value(item.tipoNpc||'Ameaça')} · NP ${value(item.np,1)}`;
    stats.push(['PV',hp],['Defesa',value(st.defesa)],['Inic.',value(st.iniciativa ?? st.iniciativaBonus)],['Ações',value(st.acoes)],['Nível',value(item.nivel ?? item.np,1)],['$ ',value(item.dinheiro,'—')]);
    if(type==='pc'){
      const attrs=item.atributos||{}; sections.push(section('Atributos',[`Físico ${value(attrs.fisico,0)}`,`Intelecto ${value(attrs.intelecto,0)}`,`Coragem ${value(attrs.coragem,0)}`,`Agilidade ${value(attrs.agilidade,0)}`]));
      sections.push(section('Antecedentes',Object.entries(item.antecedentes||{}).filter(([,v])=>Number(v)>0).map(([k,v])=>`${k[0].toUpperCase()+k.slice(1)} ${v}`)));
    }
    sections.push(section('Habilidades',(item.habilidades||[]).map(h=>h?.nome?`${h.nome}${h.desc?` — ${h.desc}`:''}`:null)));
    sections.push(section('Armas',(item.armas||[]).map(a=>a?.nome?`${a.nome} · ${value(a.dano)}`:null)));
  } else if (system === 'rotaZero') {
    // Compatibilidade deliberadamente mínima: reconhece a ficha atual do PJ Lite,
    // preserva o payload importado e não injeta regras, estatísticas ou conteúdo
    // próprio de Rota Zero no DM Lite.
    subtitle='Ficha importada do PJ Lite';
  } else if (system === '3det') {
    const st=item.status||{}, attrs=item.atributos||{}; hp=`${value(st.pv?.atual,0)}/${value(st.pv?.max,0)}`;
    subtitle=type==='pc'?`${value(item.bio?.arquetipo,'3DeT Victory')} · ${value(item.bio?.conceito,'Personagem')}`:`3DeT Victory · ${value(type)}`;
    stats.push(['PV',hp],['PM',`${value(st.pm?.atual,0)}/${value(st.pm?.max,0)}`],['PA',`${value(st.pa?.atual,0)}/${value(st.pa?.max,0)}`],['P',value(attrs.poder)],['H',value(attrs.habilidade)],['R',value(attrs.resistencia)]);
    sections.push(section('Perícias',[...Object.entries(item.pericias||{}).filter(([,on])=>on).map(([k])=>DET_SKILLS[k]||k),...(item.periciasPersonalizadas||[]).filter(x=>x?.selecionada!==false).map(x=>x?.nome)]));
    sections.push(section('Vantagens',(item.vantagens||[]).map(x=>x?.nome?`${x.nome}${x.custo!==''?` (${x.custo})`:''}`:null)));
    sections.push(section('Técnicas',(item.tecnicas||[]).map(x=>x?.nome?`${x.nome}${x.custo?` · ${x.custo}`:''}`:null)));
  }

  return { source:'PJ Lite', name, system, systemName:SYSTEM_NAMES[system]||system, type, subtitle, initiative:String(initiative||''), hp:String(hp||''), stats:stats.slice(0,6).map(([label,v])=>({label,value:String(value(v))})), sections:sections.filter(Boolean), raw:item };
}

export const supportedPJSystems = Object.entries(SYSTEM_NAMES).map(([id,name])=>({id,name}));
