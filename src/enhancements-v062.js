const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const PJ_LITE_URL='https://pjlite.vercel.app/';

let bootResolved=false;

function resolveInitialScreen(){
  if(bootResolved)return;
  const home=$('.home.page-theme');
  if(home){bootResolved=true;return;}
  const editor=$('.editor.page-theme');
  if(!editor)return;
  bootResolved=true;
  const homeButton=$('.editor-top .brand-block button',editor);
  homeButton?.click();
}

function guideMarkup(){
  return `<nav class="dm63-guide-tabs">
    <button class="active" data-tab="visao">Visão geral</button>
    <button data-tab="home">Home & Escudos</button>
    <button data-tab="barra">Barra do Mestre</button>
    <button data-tab="janelas">Janelas</button>
    <button data-tab="prontos">Escudos prontos</button>
    <button data-tab="fichas">Fichas / PJ Lite</button>
    <button data-tab="pdf">PDFs</button>
    <button data-tab="temas">Temas</button>
    <button data-tab="mobile">Celular</button>
    <button data-tab="saves">Saves & Backup</button>
    <button data-tab="fluxo">Fluxo de sessão</button>
  </nav>
  <main class="dm63-guide-content">
    <article data-panel="visao">
      <h3>O que é o DM Lite?</h3>
      <p>O DM Lite é um <b>escudo digital para o Mestre</b>. A ideia é reunir, em uma única mesa, as informações que normalmente ficam espalhadas entre escudo físico, bloco de notas, iniciativa, fichas dos jogadores, PDFs e tabelas rápidas.</p>
      <p>Ele foi pensado para <b>complementar a mesa</b>, não para substituir livros, fichas completas ou um VTT. Você abre apenas o que precisa, consulta rapidamente e continua jogando.</p>
      <h4>O que um escudo pode guardar</h4>
      <ul>
        <li>referências rápidas de regras;</li><li>notas da sessão;</li><li>ordem de iniciativa e condições;</li><li>rolagens de dados;</li><li>tabelas personalizadas;</li><li>NPCs rápidos e relógios;</li><li>links e imagens;</li><li>mini fichas importadas do PJ Lite;</li><li>PDF Mini e acesso ao leitor completo de PDFs.</li>
      </ul>
      <div class="dm63-tip"><b>Resumo:</b> PJ Lite é a ficha digital do jogador; DM Lite é o escudo digital atrás da mesa.</div>
    </article>

    <article data-panel="home" hidden>
      <h3>Home e biblioteca de escudos</h3>
      <p>Ao abrir o endereço do DM Lite, você entra primeiro na <b>Home</b>. Nenhum escudo é aberto automaticamente: você escolhe qual mesa deseja continuar.</p>
      <h4>Principais controles</h4>
      <ul>
        <li><b>Tema:</b> altera a aparência global da Home e dos escudos.</li>
        <li><b>Guias e Tutoriais:</b> abre esta documentação.</li>
        <li><b>Importar:</b> recupera um escudo salvo em JSON ou Código DM Lite.</li>
        <li><b>Novo Escudo:</b> cria uma mesa em branco ou usa um modelo pronto.</li>
        <li><b>Busca:</b> procura por nome, gênero ou sistema.</li>
        <li><b>Filtros:</b> reduz a lista conforme sistema e organização disponível.</li>
        <li><b>Grade / Lista:</b> alterna a forma de visualizar seus escudos.</li>
      </ul>
      <h4>Card de um escudo salvo</h4>
      <p>Cada card mostra sistema, nome, gênero, número de janelas e última edição. As ações permitem <b>Abrir, Duplicar, Editar, Exportar e Apagar</b>.</p>
      <p>Na parte inferior da Home ficam o <b>log de atualizações</b>, créditos, informações do projeto, backup e acesso ao PJ Lite.</p>
    </article>

    <article data-panel="barra" hidden>
      <h3>Barra superior do Mestre</h3>
      <p>Dentro de um escudo, a barra superior reúne ações gerais da mesa. No celular ela usa ícones compactos; no desktop há mais espaço para os controles.</p>
      <ul>
        <li><b>← Home:</b> volta para a biblioteca de escudos. O save continua automático.</li>
        <li><b>📚 PDF:</b> abre o leitor grande para consultar livros, aventuras e suplementos.</li>
        <li><b>📄 Mini:</b> abre um PDF compacto junto das outras ferramentas.</li>
        <li><b>🎨 Tema:</b> troca a paleta sem alterar o conteúdo do escudo.</li>
        <li><b>➕ Ficha:</b> importa uma ficha do PJ Lite.</li>
        <li><b>👥 Fichas:</b> lista as fichas já carregadas e permite ir diretamente até elas.</li>
        <li><b>↕ Ordem:</b> organiza automaticamente as janelas no desktop.</li>
        <li><b>⚙ Ajustes:</b> escala da interface, tema e fundo personalizado do escudo.</li>
        <li><b>🔎 Janelas:</b> abre um índice com atalhos para saltar diretamente a qualquer janela.</li>
        <li><b>👤 PJ:</b> abre o PJ Lite oficial em outra aba.</li>
      </ul>
      <div class="dm63-tip">No celular, deslize horizontalmente a barra caso existam mais ações do que cabem na tela.</div>
    </article>

    <article data-panel="janelas" hidden>
      <h3>Janelas e ferramentas</h3>
      <p>As janelas são módulos independentes. Você pode adicionar quantas precisar e renomeá-las para combinar com sua campanha.</p>
      <h4>Controles de uma janela</h4>
      <ul>
        <li><b>≡ / alça:</b> identifica o cabeçalho e, no desktop, serve para arrastar.</li>
        <li><b>↑ / ↓:</b> no celular, muda a posição da janela na pilha.</li>
        <li><b>□:</b> foca uma janela no celular; use novamente para retornar à visão geral.</li>
        <li><b>—:</b> minimiza ou restaura.</li>
        <li><b>⧉:</b> duplica a janela.</li>
        <li><b>×:</b> remove a janela.</li>
        <li>No desktop, janelas também podem ser redimensionadas e posicionadas livremente.</li>
      </ul>
      <h4>Ferramentas disponíveis</h4>
      <ul>
        <li><b>📝 Nota:</b> páginas independentes, título editável e formatação por seleção — negrito, itálico, sublinhado, cor e tamanho.</li>
        <li><b>⚔️ Iniciativa:</b> combatentes, iniciativa, PV, condições e controle do participante ativo.</li>
        <li><b>🎲 Dados:</b> rolagens rápidas para dados comuns e fórmulas da mesa.</li>
        <li><b>▦ Tabela:</b> linhas e colunas editáveis, formatação e uso como tabela de consulta ou sorteio.</li>
        <li><b>👤 NPC:</b> bloco rápido para nome, descrição e dados de apoio; pode ser usado junto da iniciativa.</li>
        <li><b>◷ Relógio:</b> acompanha progresso, perigo, objetivo ou contagem narrativa.</li>
        <li><b>🔗 Links:</b> reúne sites, documentos e referências externas.</li>
        <li><b>🖼️ Imagem:</b> exibe URL ou upload local com controle de zoom.</li>
        <li><b>📄 PDF Mini:</b> consulta compacta de PDF sem sair da mesa.</li>
        <li><b>Referências:</b> quadros recolhíveis de regras e tabelas dos escudos prontos.</li>
        <li><b>Mini ficha PJ:</b> resumo estilizado de um personagem importado.</li>
      </ul>
    </article>

    <article data-panel="prontos" hidden>
      <h3>Escudos prontos</h3>
      <p>Ao criar um novo escudo, você pode começar em branco ou escolher um modelo. Os modelos trazem <b>resumos de consulta e ferramentas já montadas</b>, sem substituir o livro do sistema.</p>
      <p>A biblioteca atual inclui modelos para <b>Dragonbane, D&D 5.5e, Fabula Ultima, Tormenta20, Ordem Paranormal, 3DeT Victory e 3D&T Alpha</b>, além do modo em branco.</p>
      <h4>Como usar</h4>
      <ol><li>Clique em <b>Novo Escudo</b>.</li><li>Escolha um modelo em “Pegar um pronto”.</li><li>Edite nome e gênero, se quiser.</li><li>Use <b>Criar e abrir</b>.</li><li>Apague, duplique ou acrescente janelas conforme sua campanha.</li></ol>
      <div class="dm63-tip">As referências prontas são atalhos de mesa. Para regras completas, exceções e exemplos extensos, consulte o material original pelo leitor de PDF.</div>
    </article>

    <article data-panel="fichas" hidden>
      <h3>Fichas e integração com o PJ Lite</h3>
      <p>O PJ Lite continua sendo o local principal das fichas. O DM Lite recebe uma <b>versão resumida para o Mestre</b>, com aparência adaptada ao sistema da ficha.</p>
      <h4>Como importar</h4>
      <ul>
        <li><b>Código da Ficha:</b> copie no PJ Lite e cole em “➕ Ficha”.</li>
        <li><b>ZIP / JSON:</b> importe o arquivo exportado pelo PJ Lite.</li>
        <li><b>👥 Fichas:</b> mostra tudo que já foi importado para aquele escudo e serve como atalho até cada ficha.</li>
      </ul>
      <p>A mini ficha pode exibir PV, defesa, atributos, perícias, ataques, habilidades, magias ou outras informações, dependendo do sistema e dos dados presentes no arquivo.</p>
      <p>Quando fizer sentido, uma ficha também pode ser adicionada à <b>Iniciativa</b>.</p>
      <p><a href="${PJ_LITE_URL}" target="_blank" rel="noreferrer noopener">Abrir PJ Lite oficial ↗</a></p>
      <div class="dm63-tip">Os dois sites ficam em domínios separados. Por segurança do navegador, o DM Lite não lê automaticamente o localStorage do PJ Lite; a transferência é feita por código ou arquivo.</div>
    </article>

    <article data-panel="pdf" hidden>
      <h3>Consulta de PDFs</h3>
      <h4>📚 Leitor completo</h4>
      <p>Indicado para livros, aventuras e consultas longas. Aceita <b>arquivo PDF local, URL direta e link do Google Drive</b>. Links usados recentemente podem aparecer na lista de recentes.</p>
      <h4>📄 PDF Mini</h4>
      <p>Indicado para escudos pequenos, handouts, mapas simples, tabelas e páginas que você quer manter perto das outras janelas. Pode ser movido, redimensionado, minimizado e aberto em nova aba.</p>
      <p>O zoom do PDF Mini usa o visualizador de PDF do navegador, evitando ampliar apenas uma imagem rasterizada e preservando melhor a nitidez do texto.</p>
      <h4>Por que o arquivo local não fica dentro do save?</h4>
      <p>Livros podem ter dezenas ou centenas de megabytes. Guardá-los no save poderia estourar o limite do navegador. Por isso o DM Lite guarda o escudo e as referências, mas não incorpora o PDF local pesado.</p>
    </article>

    <article data-panel="temas" hidden>
      <h3>Temas e aparência</h3>
      <p>O tema é global: ao escolher uma paleta na Home ou dentro do escudo, a preferência acompanha as duas áreas.</p>
      <p>Há temas inspirados no ecossistema do PJ Lite — <b>Padrão, Clássico DB, D&D, Fabula Ultima, O Som das Seis, 3DeT Victory, Modo Escuro e Personalizado</b> — além de extras do DM Lite para Tormenta20 e Ordem Paranormal.</p>
      <p>O <b>Tema Personalizado</b> permite escolher fundo, janela, barra, destaque, texto, imagem de fundo e opacidade.</p>
      <p>Mini fichas importadas preservam a identidade visual do próprio sistema para não perder legibilidade quando o tema geral muda.</p>
    </article>

    <article data-panel="mobile" hidden>
      <h3>Uso no celular</h3>
      <p>No mobile, o DM Lite evita janelas flutuantes livres. As ferramentas viram uma <b>pilha vertical</b>, mais confortável para toque e leitura.</p>
      <ul>
        <li>Use <b>↑ / ↓</b> para reorganizar a pilha.</li>
        <li>Use <b>□</b> para focar uma janela.</li>
        <li>Use <b>🔎 Janelas</b> para abrir o índice e saltar diretamente até qualquer módulo.</li>
        <li>A barra superior e a barra de ferramentas podem rolar horizontalmente.</li>
        <li>O PDF Mini recebe espaço maior para continuar legível.</li>
        <li>A Home segue a mesma lógica visual do PJ Lite, com biblioteca, busca, filtros, cards e informações do projeto ao final.</li>
      </ul>
    </article>

    <article data-panel="saves" hidden>
      <h3>Saves, importação e backup</h3>
      <p>O salvamento é <b>automático no navegador</b>. Alterações em janelas, notas, organização e configurações são persistidas sem botão de salvar manual.</p>
      <h4>Backup</h4>
      <ul>
        <li><b>JSON:</b> melhor opção para backup completo e transferência entre aparelhos.</li>
        <li><b>Código DM Lite:</b> formato compacto para compartilhar ou guardar rapidamente.</li>
        <li><b>Duplicar:</b> cria uma cópia independente antes de mudanças grandes.</li>
      </ul>
      <p>A linha atual também possui migração para saves de versões anteriores do DM Lite e mantém compatibilidade com códigos antigos suportados pelo projeto.</p>
      <div class="dm63-tip">Antes de limpar dados do navegador, trocar de dispositivo ou testar alterações grandes, exporte os escudos importantes.</div>
    </article>

    <article data-panel="fluxo" hidden>
      <h3>Fluxo sugerido para uma sessão</h3>
      <ol>
        <li>Abra o DM Lite e escolha o escudo da campanha na Home.</li>
        <li>Use o 🔎 índice para conferir as janelas que já estão preparadas.</li>
        <li>Importe ou revise as fichas do grupo.</li>
        <li>Abra Iniciativa, Dados e uma Nota para acontecimentos da sessão.</li>
        <li>Deixe um PDF Mini aberto se houver uma página consultada com frequência.</li>
        <li>Use o leitor completo quando precisar pesquisar o livro.</li>
        <li>Acrescente NPCs, relógios, links, imagens ou tabelas conforme a cena pedir.</li>
        <li>Ao terminar, volte para a Home. O escudo já foi salvo automaticamente.</li>
      </ol>
      <h4>Princípio Lite</h4>
      <p>Se uma ferramenta não está ajudando naquela sessão, você não precisa deixá-la aberta. O objetivo é reduzir troca de abas e papelada, não aumentar a quantidade de coisas na tela.</p>
    </article>
  </main>`;
}

function upgradeGuide(){
  const layer=$('#dm53-guide');
  if(!layer||layer.dataset.dm63Guide)return;
  const box=$('.dm53-guide',layer);
  if(!box)return;
  layer.dataset.dm63Guide='1';
  box.innerHTML=guideMarkup();
  $$('[data-tab]',box).forEach(button=>{
    button.onclick=()=>{
      $$('[data-tab]',box).forEach(x=>x.classList.toggle('active',x===button));
      $$('[data-panel]',box).forEach(panel=>panel.hidden=panel.dataset.panel!==button.dataset.tab);
      $('.dm53-modal--guide .modal-body')?.scrollTo?.({top:0,behavior:'smooth'});
    };
  });
}

function sync(){
  resolveInitialScreen();
  upgradeGuide();
}

export function installEnhancementsV062(){
  sync();
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;sync();});
  });
  observer.observe(document.getElementById('root')||document.body,{childList:true,subtree:true});
}
