// Escudos prontos do DM Lite.
// O conteúdo abaixo é uma síntese própria das referências de mesa dos PDFs do usuário.
// Mantemos lembretes curtos, sem reproduzir integralmente os textos dos escudos.

export const SYSTEMS = {
  generic: { label: 'Genérico', icon: '🛡️', theme: 'dark' },
  dragonbane: { label: 'Dragonbane', icon: '🐉', theme: 'dragonbane' },
  fabula: { label: 'Fabula Ultima', icon: '✨', theme: 'fabula' },
  dnd5e: { label: 'D&D 5.5e', icon: '🐲', theme: 'dnd' },
  tormenta20: { label: 'Tormenta20', icon: '⚡', theme: 't20' },
  ordem: { label: 'Ordem Paranormal', icon: '◉', theme: 'ordem' },
  '3det': { label: '3DeT Victory', icon: '⭐', theme: '3det' },
  '3dt-alpha': { label: '3D&T Alpha', icon: '🎮', theme: '3dtalpha' },
};

const ref = (title, subtitle, sections, source) => ({
  type: 'reference', title, subtitle, sections, source,
});

export const PRESETS = {
  blank: {
    label: 'Mesa em branco', icon: '🛡️', system: 'generic', genre: 'Genérico', theme: 'dark',
    description: 'Comece limpo e monte apenas o que sua mesa realmente precisa.', widgets: [],
  },

  dragonbane: {
    label: 'Dragonbane', icon: '🐉', system: 'dragonbane', genre: 'Fantasia / Exploração', theme: 'dragonbane',
    description: 'Combate, tempo, jornada, terreno e PNJs típicos.',
    source: 'dragonbane-rpg-escudo-do-mestre.pdf',
    widgets: [
      ref('Dragonbane · Combate', 'Ações, reações e manobras', [
        { title: 'Ações rápidas', items: ['Arrancada dobra o movimento da rodada.', 'Ataques corpo a corpo usam o alcance da arma; armas longas alcançam mais.', 'Bloqueio e Esquiva funcionam como reações.', 'Ajudar concede uma vantagem apropriada ao aliado.', 'Usar item, ativar habilidade e conjurar magia normalmente consomem ação.'] },
        { title: 'Ataques especiais', items: ['Encontrar ponto fraco', 'Derrubar', 'Desarmar', 'Agarrar'] },
        { title: 'Dragão / Demônio', items: ['Um Dragão pode ampliar o efeito do sucesso.', 'Um Demônio costuma gerar uma complicação adequada à situação.'] },
      ], 'dragonbane-rpg-escudo-do-mestre.pdf'),
      ref('Dragonbane · Tempo & Jornada', 'Exploração e recuperação', [
        { title: 'Medidas de tempo', rows: [['Rodada', '10 segundos'], ['Turno', '15 minutos'], ['Quarto de dia', '6 horas']] },
        { title: 'Jornada', items: ['Use Sobrevivência quando o grupo atravessar terreno sem trilha.', 'Mapa, terreno e condições podem alterar a dificuldade e o ritmo.', 'Quartos de dia ajudam a organizar marcha, acampamento e descanso.'] },
        { title: 'Terreno', items: ['Espaço estreito prejudica armas grandes.', 'Terreno acidentado dificulta movimentação.', 'Pouca luz atrapalha ataques à distância.'] },
      ], 'dragonbane-rpg-escudo-do-mestre.pdf'),
      ref('Dragonbane · PNJs', 'Valores rápidos para improvisação', [
        { title: 'PNJs típicos', items: ['Guarda', 'Cultista', 'Ladrão', 'Aldeão', 'Caçador', 'Bandido', 'Aventureiro', 'Erudito', 'Chefes e especialistas'] },
        { title: 'Perícias não listadas', items: ['Para PNJs, use um valor padrão quando uma perícia não estiver indicada e ajuste quando o conceito do personagem justificar.'] },
      ], 'dragonbane-rpg-escudo-do-mestre.pdf'),
      { type: 'initiative', title: 'Iniciativa' }, { type: 'dice', title: 'Dados' }, { type: 'npc', title: 'PNJ Rápido' },
    ],
  },

  fabula: {
    label: 'Fabula Ultima', icon: '✨', system: 'fabula', genre: 'JRPG / Fantasia', theme: 'fabula',
    description: 'Testes, oportunidades, ações, condições, rituais e criação de NPCs.',
    source: 'FU-Escudo-Do-Mestre.pdf',
    widgets: [
      ref('Fabula Ultima · Testes', 'Dificuldade, viagem e improviso', [
        { title: 'Dificuldades', rows: [['ND 7', 'Fácil'], ['ND 10', 'Normal'], ['ND 13', 'Difícil'], ['ND 16', 'Muito difícil']] },
        { title: 'Viagem', items: ['Áreas seguras usam dados menores; ermos e regiões extremas usam dados maiores.', 'Resultados extremos podem indicar descobertas ou perigos.'] },
        { title: 'Dano improvisado', items: ['A intensidade deve acompanhar o nível do grupo e a gravidade da situação.', 'A mesma referência pode ajudar a estimar recuperação ou perda de PV/PM.'] },
      ], 'FU-Escudo-Do-Mestre.pdf'),
      ref('Fabula Ultima · Conflitos', 'Ações, condições e oportunidades', [
        { title: 'Ações de turno', items: ['Ataque', 'Poder', 'Feitiço', 'Estudo', 'Guarda', 'Impedimento', 'Objetivo', 'Inventário', 'Equipamento'] },
        { title: 'Condições', rows: [['Atordoado', 'AST'], ['Abalado', 'VON'], ['Enfurecido', 'DES e AST'], ['Lento', 'DES'], ['Envenenado', 'VIG e VON'], ['Fraco', 'VIG']] },
        { title: 'Oportunidades', items: ['Aflição', 'Avaliar', 'Conexão', 'Desmascarar', 'Favor', 'Informações', 'Item perdido', 'Progresso', 'Reviravolta', 'Vantagem'] },
      ], 'FU-Escudo-Do-Mestre.pdf'),
      ref('Fabula Ultima · Mestre', 'Rituais, batalhas e NPCs', [
        { title: 'Relógios / rituais', items: ['Relógios pequenos atendem objetivos curtos; maiores servem para objetivos decisivos.', 'A potência do ritual influencia relógio, custo e dificuldade.'] },
        { title: 'Batalhas', items: ['A quantidade e o nível dos inimigos devem acompanhar o tamanho e o nível do grupo.', 'Elites e campeões concentram a força de vários soldados em menos criaturas.'] },
        { title: 'Estudar NPCs', items: ['Resultados melhores revelam progressivamente estatísticas, afinidades, ataques e feitiços.'] },
      ], 'FU-Escudo-Do-Mestre.pdf'),
      { type: 'initiative', title: 'Iniciativa' }, { type: 'clock', title: 'Relógio de Objetivo' }, { type: 'dice', title: 'Dados' },
    ],
  },

  dnd5e: {
    label: 'D&D 5.5e', icon: '🐲', system: 'dnd5e', genre: 'Fantasia Medieval', theme: 'dnd',
    description: 'Condições, ações, cobertura, exploração e dano improvisado.',
    source: 'DnD-5.5e-Escudo-DM.pdf',
    widgets: [
      ref('D&D 5.5e · Condições', 'Consulta rápida', [
        { title: 'Condições frequentes', items: ['Cego', 'Amedrontado', 'Agarrado', 'Incapacitado', 'Invisível', 'Paralisado', 'Petrificado', 'Envenenado', 'Caído', 'Contido', 'Atordoado', 'Inconsciente'] },
        { title: 'Exaustão', items: ['Os níveis são cumulativos e penalizam jogadas de d20 e movimento.', 'Descanso longo pode reduzir a exaustão quando as necessidades básicas são atendidas.'] },
      ], 'DnD-5.5e-Escudo-DM.pdf'),
      ref('D&D 5.5e · Ações', 'Combate e posicionamento', [
        { title: 'Ações comuns', items: ['Ataque', 'Disparada', 'Desengajar', 'Esquivar', 'Ajudar', 'Esconder-se', 'Influenciar', 'Preparar', 'Procurar', 'Estudar', 'Magia', 'Utilizar objeto'] },
        { title: 'Cobertura', rows: [['Meia cobertura', 'Bônus moderado em CA e Destreza'], ['Três quartos', 'Bônus maior em CA e Destreza'], ['Total', 'Não pode ser alvo direto']] },
        { title: 'Saltos', items: ['Impulso aumenta a distância e a altura alcançada.', 'Obstáculos e terreno difícil podem exigir teste.'] },
      ], 'DnD-5.5e-Escudo-DM.pdf'),
      ref('D&D 5.5e · Exploração', 'Viagem, descanso e perigos', [
        { title: 'Dano improvisado', items: ['Use a gravidade do perigo e o nível dos personagens para estimar o dano.', 'Perigos extremos devem ser claramente mais severos que acidentes comuns.'] },
        { title: 'Viagem e descanso', items: ['Ritmo, terreno, visibilidade, cobertura e repouso são referências recorrentes do escudo.', 'Use o escudo como atalho; consulte a regra completa quando uma exceção importar.'] },
      ], 'DnD-5.5e-Escudo-DM.pdf'),
      { type: 'initiative', title: 'Iniciativa' }, { type: 'dice', title: 'Dados' }, { type: 'npc', title: 'NPC / Monstro' },
    ],
  },

  tormenta20: {
    label: 'Tormenta20', icon: '⚡', system: 'tormenta20', genre: 'Fantasia Heroica', theme: 't20',
    description: 'Condições, perigos, geradores rápidos e tesouros.',
    source: 'Escudo-do-mestre-t20.pdf',
    widgets: [
      ref('Tormenta20 · Condições', 'Estados mais consultados em mesa', [
        { title: 'Combate e movimento', items: ['Agarrado', 'Atordoado', 'Caído', 'Cego', 'Desprevenido', 'Enredado', 'Imóvel', 'Lento', 'Paralisado', 'Surpreendido', 'Vulnerável'] },
        { title: 'Mental e fadiga', items: ['Abalado', 'Apavorado', 'Confuso', 'Esmorecido', 'Exausto', 'Fascinado', 'Fatigado', 'Frustrado', 'Pasmo'] },
        { title: 'Dano contínuo', items: ['Em chamas', 'Envenenado', 'Sangrando'] },
      ], 'Escudo-do-mestre-t20.pdf'),
      ref('Tormenta20 · Perigos', 'Ambiente e sobrevivência', [
        { title: 'Perigos comuns', items: ['Ácido', 'Armadilhas', 'Calor e frio', 'Fogo', 'Fome e sede', 'Fumaça', 'Lava', 'Queda', 'Sono', 'Sufocamento', 'Venenos'] },
        { title: 'Uso em mesa', items: ['Aumente a pressão gradualmente em exposições prolongadas.', 'Quedas e imersão total em perigos devem ser muito mais graves que exposição breve.'] },
      ], 'Escudo-do-mestre-t20.pdf'),
      ref('Tormenta20 · Geradores', 'Improviso de campanha', [
        { title: 'Nomes aleatórios', items: ['Humanos', 'Anões', 'Elfos', 'Goblins', 'Lefou', 'Qareen', 'Dahllan / Minotauros', 'Hynne', 'Sereias / Tritões', 'Sílfides', 'Trog'] },
        { title: 'Tesouros', items: ['O escudo traz referências por ND para dinheiro e itens; use a faixa de desafio para escolher uma recompensa coerente.'] },
      ], 'Escudo-do-mestre-t20.pdf'),
      { type: 'initiative', title: 'Iniciativa' }, { type: 'dice', title: 'Dados' }, { type: 'npc', title: 'NPC Rápido' },
    ],
  },

  ordem: {
    label: 'Ordem Paranormal', icon: '◉', system: 'ordem', genre: 'Horror / Investigação', theme: 'ordem',
    description: 'Investigação, urgência, combate, interlúdio e criação rápida de NPCs.',
    source: 'Ordem-Paranormal-RPG-Escudo-do-Mestre-1.pdf',
    widgets: [
      ref('Ordem · Investigação', 'Pistas, dificuldade e urgência', [
        { title: 'Ações de investigação', items: ['Procurar pistas', 'Facilitar investigação', 'Usar habilidades e itens de forma criativa', 'Ajudar outro investigador'] },
        { title: 'Dificuldades', rows: [['5', 'Fácil'], ['10', 'Média'], ['15', 'Difícil'], ['20', 'Muito difícil'], ['25', 'Formidável'], ['30', 'Heroica'], ['35', 'Quase impossível']] },
        { title: 'Urgência', rows: [['Muito baixa', '6 rodadas'], ['Baixa', '5'], ['Média', '4'], ['Alta', '3'], ['Muito alta', '2']] },
      ], 'Ordem-Paranormal-RPG-Escudo-do-Mestre-1.pdf'),
      ref('Ordem · Combate', 'Ações e situações especiais', [
        { title: 'Economia de ações', items: ['Uma ação padrão + uma de movimento', 'Duas ações de movimento', 'Uma ação completa', 'Ações livres e reações quando aplicável'] },
        { title: 'Ações padrão', items: ['Agredir', 'Manobra de combate', 'Atropelar', 'Conjurar ritual', 'Fintar', 'Preparar', 'Usar habilidade ou item'] },
        { title: 'Situações especiais', items: ['Caído', 'Cego', 'Posição elevada', 'Flanqueando', 'Invisível', 'Ofuscado', 'Camuflagem', 'Cobertura'] },
      ], 'Ordem-Paranormal-RPG-Escudo-do-Mestre-1.pdf'),
      ref('Ordem · Interlúdio & NPCs', 'Recuperação e improviso', [
        { title: 'Interlúdio', items: ['Alimentar-se', 'Dormir', 'Exercitar-se', 'Ler', 'Manutenção', 'Relaxar', 'Revisar caso'] },
        { title: 'Gerador de NPCs', items: ['Aparência', 'Personalidade', 'Faixa etária', 'Nomes femininos', 'Nomes masculinos'] },
        { title: 'Perigos', items: ['Ácido', 'Armadilhas', 'Clima extremo', 'Neblina', 'Precipitação', 'Vento e outros riscos ambientais'] },
      ], 'Ordem-Paranormal-RPG-Escudo-do-Mestre-1.pdf'),
      { type: 'initiative', title: 'Iniciativa' }, { type: 'dice', title: 'Dados' }, { type: 'clock', title: 'Urgência da Investigação' },
    ],
  },

  '3det': {
    label: '3DeT Victory', icon: '⭐', system: '3det', genre: 'Ação / Anime', theme: '3det',
    description: 'Rodada de combate, manobras, Ganhos/Perdas, recuperação e metas.',
    source: '3det-victory-escudo-do-mestre.pdf',
    widgets: [
      ref('3DeT Victory · Combate', 'Fluxo e manobras', [
        { title: 'Rodada', items: ['Iniciativa', 'Ataque / manobra', 'Defesa e cálculo de dano'] },
        { title: 'Manobras', items: ['Adiar ação', 'Agarrão', 'Ataque concentrado', 'Ataque direcionado', 'Ataque total', 'Contra-ataque', 'Defesa total', 'Fuga', 'Sacrifício final'] },
        { title: 'Derrota', items: ['Chegar a 0 PV significa derrota.', 'Em combate violento, sofrer novo dano derrotado pode levar a teste de morte.'] },
      ], '3det-victory-escudo-do-mestre.pdf'),
      ref('3DeT Victory · Recursos', 'PA, Ganhos, Perdas e descanso', [
        { title: 'Ganhos', items: ['Situação positiva', 'Ajuda', 'Vantagens', 'Estilo', 'Dharma'] },
        { title: 'Perdas', items: ['Situação negativa', 'Vantagens do oponente', 'Desvantagens', 'Karma'] },
        { title: 'Recuperação', items: ['Descanso longo recupera recursos.', 'Descanso curto recupera PM/PV de acordo com os atributos.', 'PA possui formas específicas de recuperação.'] },
      ], '3det-victory-escudo-do-mestre.pdf'),
      ref('3DeT Victory · Campanha', 'Metas, recompensas e inventário', [
        { title: 'Metas estendidas', items: ['Tarefas simples: poucos sucessos.', 'Tarefas complexas: mais sucessos.', 'Tarefas épicas: seis ou mais sucessos.'] },
        { title: 'Recompensas', items: ['Objetivos menores e maiores geram XP.', 'Marcos maiores aceleram evolução de personagem.'] },
        { title: 'Inventário', items: ['O tamanho do inventário define quantos itens comuns, incomuns e raros podem ser carregados.'] },
      ], '3det-victory-escudo-do-mestre.pdf'),
      { type: 'initiative', title: 'Iniciativa' }, { type: 'dice', title: 'Dados' }, { type: 'clock', title: 'Meta Estendida' },
    ],
  },

  '3dt-alpha': {
    label: '3D&T Alpha', icon: '🎮', system: '3dt-alpha', genre: 'Ação / Anime (Legado)', theme: '3dtalpha',
    description: 'Escalas, testes, movimento, manobras e combate do Alpha.',
    source: 'Escudo-do-Mestre-3D&T-alpha.pdf',
    widgets: [
      ref('3D&T Alpha · Testes', 'Características, perícias e escalas', [
        { title: 'Dificuldade', items: ['Tarefas fáceis recebem bônus.', 'Tarefas normais usam pouco ou nenhum ajuste.', 'Tarefas difíceis recebem redutores.'] },
        { title: 'Escalas de poder', items: ['Ningen', 'Sugoi', 'Kiodai', 'Kami'] },
        { title: 'Testes de morte', items: ['Muito fraco', 'Inconsciente', 'Quase morto', 'Morto'] },
      ], 'Escudo-do-Mestre-3D&T-alpha.pdf'),
      ref('3D&T Alpha · Combate', 'FA, FD e manobras', [
        { title: 'Turno de combate', items: ['Iniciativa', 'Força de Ataque', 'Força de Defesa'] },
        { title: 'Manobras', items: ['Esquiva', 'Acerto crítico', 'Alvo indefeso', 'Surpresa', 'Ataques múltiplos', 'Ataque concentrado', 'Ataque especial'] },
        { title: 'Movimento', items: ['Natação, escalada, voo e quedas possuem ritmos próprios.', 'Privações incluem respiração, fome/sede e sono.'] },
      ], 'Escudo-do-Mestre-3D&T-alpha.pdf'),
      { type: 'initiative', title: 'Iniciativa' }, { type: 'dice', title: 'Dados' },
    ],
  },
};
