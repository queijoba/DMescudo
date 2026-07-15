import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Dices, Layout, Image as ImageIcon, 
  Table as TableIcon, FileText, Bold, Italic, 
  Heading, List, FilePlus, PlusSquare, X,
  GripHorizontal, MinusSquare, Scaling,
  Save, FolderOpen, Check, Lock, KeyRound
} from 'lucide-react';

// Este componente encapsula a lógica de arrastar, redimensionar e focar as janelas.
const WidgetCard = ({ widget, updateWidget, removeWidget, bringToFront, children }) => {
  const cardRef = useRef(null);

  // Lógica de Mover (Arrastar)
  const handleDragStart = (e) => {
    e.preventDefault();
    bringToFront(widget.id);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = widget.x || 0;
    const startPosY = widget.y || 0;

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      updateWidget(widget.id, { 
        x: Math.max(0, startPosX + dx), 
        y: Math.max(0, startPosY + dy) 
      });
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  // Lógica de Redimensionar
  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    bringToFront(widget.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = widget.width || 300;
    const startH = widget.height || 300;

    const onPointerMove = (moveEvent) => {
      const dw = moveEvent.clientX - startX;
      const dh = moveEvent.clientY - startY;
      updateWidget(widget.id, { 
        width: Math.max(250, startW + dw), // Largura mínima
        height: Math.max(200, startH + dh) // Altura mínima
      });
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div 
      ref={cardRef}
      onPointerDown={() => bringToFront(widget.id)}
      className="absolute flex flex-col bg-stone-800 border border-stone-700 rounded-lg shadow-2xl overflow-hidden"
      style={{ 
        left: widget.x, 
        top: widget.y, 
        width: widget.width, 
        height: widget.height, 
        zIndex: widget.zIndex || 1 
      }}
    >
      {/* Barra de Título (Alça de Arrastar) */}
      <div 
        className="flex justify-between items-center bg-stone-950 px-3 py-2 border-b border-stone-700 cursor-move select-none"
        onPointerDown={handleDragStart}
      >
        <div className="flex items-center gap-2 w-full">
          <GripHorizontal size={14} className="text-stone-500" />
          <input 
            type="text" 
            value={widget.title}
            onPointerDown={(e) => e.stopPropagation()} // Permite clicar no input sem arrastar
            onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
            className="font-bold text-amber-500 bg-transparent outline-none w-full focus:bg-stone-900 rounded px-1 text-sm"
          />
        </div>
        <button 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => removeWidget(widget.id)} 
          className="text-red-500 hover:text-red-400 ml-2 p-1"
          title="Fechar Janela"
        >
          <X size={16} />
        </button>
      </div>

      {/* Conteúdo Dinâmico do Widget */}
      <div className="flex-1 overflow-hidden flex flex-col p-3">
        {children}
      </div>

      {/* Alça de Redimensionamento */}
      <div 
        className="absolute bottom-0 right-0 p-1 cursor-nwse-resize text-stone-500 hover:text-amber-500 transition-colors"
        onPointerDown={handleResizeStart}
      >
        <Scaling size={16} />
      </div>
    </div>
  );
};

const App = () => {
  const [topZ, setTopZ] = useState(10);
  const [widgets, setWidgets] = useState([
    { 
      id: 1, type: 'note', title: 'Grimório da Campanha', 
      pages: [{ id: 101, title: 'Capítulo 1', content: '<h2>O Início</h2><p>A aventura começa...</p>' }],
      activePageId: 101, x: 50, y: 50, width: 400, height: 350, zIndex: 2
    },
    { 
      id: 2, type: 'dice', title: 'Rolador de Dados', 
      result: '---', history: [], 
      x: 500, y: 50, width: 300, height: 250, zIndex: 1
    }
  ]);

  const [templates, setTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' });
  const [templatePassword, setTemplatePassword] = useState('');
  const [authPrompt, setAuthPrompt] = useState({ isOpen: false, templateId: null, action: null });
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Carrega os templates salvos na memória do navegador ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('dmscreen_templates');
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar templates', e);
      }
    }
  }, []);

  // Função para salvar a configuração atual da tela
  const saveTemplate = () => {
    if (!templateName.trim()) {
      setModalMessage({ type: 'error', text: 'Digite um nome para o modelo.' });
      return;
    }
    
    try {
      const newTemplate = {
        id: Date.now(),
        name: templateName,
        password: templatePassword.trim() || null,
        widgets: widgets,
        topZ: topZ,
        date: new Date().toLocaleDateString()
      };
      
      const existingIndex = templates.findIndex(t => t.name === templateName);
      let updatedTemplates = [...templates];
      
      // Se já existir um com esse nome, atualiza. Se não, adiciona um novo.
      if (existingIndex >= 0) {
        updatedTemplates[existingIndex] = newTemplate;
      } else {
        updatedTemplates.push(newTemplate);
      }
      
      localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
      setModalMessage({ type: 'success', text: 'Modelo salvo com sucesso!' });
      setTimeout(() => setModalMessage({ type: '', text: '' }), 3000); // Apaga a mensagem após 3 seg
      setTemplateName(''); // Limpa o campo
      setTemplatePassword(''); // Limpa a senha
    } catch (error) {
      // O localStorage tem limite de ~5MB. Mapas muito pesados podem causar erro.
      setModalMessage({ type: 'error', text: 'Erro! Se tiver imagens grandes no layout, o limite de memória do navegador pode ter sido atingido.' });
    }
  };

  // Carrega o layout salvo na tela
  const loadTemplate = (id) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      setWidgets(template.widgets);
      setTopZ(template.topZ);
      setShowTemplateModal(false);
    }
  };

  // Exclui um layout salvo
  const deleteTemplate = (id) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  const requestTemplateAction = (id, action) => {
    const template = templates.find(t => t.id === id);
    if (template && template.password) {
      setAuthPrompt({ isOpen: true, templateId: id, action });
      setAuthInput('');
      setAuthError('');
    } else {
      executeAction(id, action);
    }
  };

  const executeAction = (id, action) => {
    if (action === 'load') loadTemplate(id);
    if (action === 'delete') deleteTemplate(id);
    setAuthPrompt({ isOpen: false, templateId: null, action: null });
  };

  const handleAuthSubmit = () => {
    const template = templates.find(t => t.id === authPrompt.templateId);
    if (template && template.password === authInput) {
      executeAction(authPrompt.templateId, authPrompt.action);
    } else {
      setAuthError('Senha incorreta!');
    }
  };

  const bringToFront = (id) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    updateWidget(id, { zIndex: newZ });
  };

  const addWidget = (type) => {
    // Calcula uma posição em cascata para novas janelas
    const offset = (widgets.length % 5) * 40;
    let newWidget = { 
      id: Date.now(), 
      type, 
      title: 'Novo Widget',
      x: 100 + offset,
      y: 100 + offset,
      zIndex: topZ + 1,
      width: 350,
      height: 300
    };
    setTopZ(topZ + 1);

    if (type === 'note') {
      newWidget.title = 'Anotações';
      newWidget.pages = [{ id: Date.now() + 1, title: 'Nova Página', content: '' }];
      newWidget.activePageId = newWidget.pages[0].id;
      newWidget.width = 400; newWidget.height = 400;
    } else if (type === 'dice') {
      newWidget.title = 'Dados';
      newWidget.result = '---';
      newWidget.history = [];
      newWidget.width = 280; newWidget.height = 250;
    } else if (type === 'image') {
      newWidget.title = 'Imagem / Mapa';
      newWidget.imageData = null;
      newWidget.width = 400; newWidget.height = 350;
    } else if (type === 'table') {
      newWidget.title = 'Tabela Personalizada';
      newWidget.rows = [['', ''], ['', '']];
      newWidget.width = 450; newWidget.height = 300;
    }

    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id) => setWidgets(widgets.filter(w => w.id !== id));

  const updateWidget = (id, updates) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const rollDice = (widgetId, sides) => {
    const val = Math.floor(Math.random() * sides) + 1;
    const widget = widgets.find(w => w.id === widgetId);
    const newHistory = [`D${sides}: ${val}`, ...(widget.history || [])].slice(0, 4);
    updateWidget(widgetId, { result: val, history: newHistory });
  };

  const handleImageUpload = (widgetId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateWidget(widgetId, { imageData: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderNoteWidget = (widget) => {
    const activePage = widget.pages.find(p => p.id === widget.activePageId) || widget.pages[0];

    const addPage = () => {
      const newPage = { id: Date.now(), title: `Pág ${widget.pages.length + 1}`, content: '' };
      updateWidget(widget.id, { 
        pages: [...widget.pages, newPage],
        activePageId: newPage.id
      });
    };

    const deletePage = (e, pageId) => {
      e.stopPropagation(); // Evita ativar a aba ao clicar no X
      if (widget.pages.length === 1) return; // Não deleta se for a última aba

      const newPages = widget.pages.filter(p => p.id !== pageId);
      let newActiveId = widget.activePageId;
      
      // Se a aba deletada for a ativa, muda para a primeira aba restante
      if (newActiveId === pageId) {
        newActiveId = newPages[0].id;
      }
      
      updateWidget(widget.id, { pages: newPages, activePageId: newActiveId });
    };

    const updatePageContent = (htmlContent) => {
      const newPages = widget.pages.map(p => 
        p.id === activePage.id ? { ...p, content: htmlContent } : p
      );
      updateWidget(widget.id, { pages: newPages });
    };

    const execCmd = (cmd, arg = null) => {
      document.execCommand(cmd, false, arg);
    };

    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex overflow-x-auto bg-stone-900 rounded-t-lg border-b border-stone-700 p-1 gap-1 custom-scrollbar">
          {widget.pages.map(page => (
            <div 
              key={page.id}
              onClick={() => updateWidget(widget.id, { activePageId: page.id })}
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded cursor-pointer group whitespace-nowrap ${widget.activePageId === page.id ? 'bg-stone-700 text-amber-400' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}
            >
              <span>{page.title}</span>
              {widget.pages.length > 1 && (
                <button 
                  onClick={(e) => deletePage(e, page.id)} 
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity ml-1"
                  title="Deletar Aba"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addPage} className="px-2 py-1 text-stone-400 hover:text-amber-400 flex-shrink-0">
            <FilePlus size={16} />
          </button>
        </div>

        <div className="flex gap-2 p-1 bg-stone-800 border-b border-stone-700 flex-wrap">
          <button onClick={() => execCmd('bold')} className="p-1 hover:bg-stone-700 rounded text-stone-300" title="Negrito"><Bold size={14} /></button>
          <button onClick={() => execCmd('italic')} className="p-1 hover:bg-stone-700 rounded text-stone-300" title="Itálico"><Italic size={14} /></button>
          <button onClick={() => execCmd('formatBlock', 'H2')} className="p-1 hover:bg-stone-700 rounded text-stone-300" title="Título / -#"><Heading size={14} /></button>
          <button onClick={() => execCmd('insertUnorderedList')} className="p-1 hover:bg-stone-700 rounded text-stone-300" title="Lista"><List size={14} /></button>
        </div>

        <div 
          className="flex-1 w-full bg-stone-900 p-3 rounded-b-lg text-sm text-stone-200 outline-none overflow-y-auto"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updatePageContent(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: activePage.content }}
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>
    );
  };

  const renderTableWidget = (widget) => {
    const updateCell = (rIdx, cIdx, val) => {
      const newRows = [...widget.rows];
      newRows[rIdx][cIdx] = val;
      updateWidget(widget.id, { rows: newRows });
    };

    const addRow = () => updateWidget(widget.id, { rows: [...widget.rows, Array(widget.rows[0].length).fill('')] });
    const addColumn = () => updateWidget(widget.id, { rows: widget.rows.map(row => [...row, '']) });
    
    const removeRow = (rIdx) => {
      if (widget.rows.length <= 1) return;
      updateWidget(widget.id, { rows: widget.rows.filter((_, i) => i !== rIdx) });
    };

    const removeColumn = (cIdx) => {
      if (widget.rows[0].length <= 1) return;
      updateWidget(widget.id, { rows: widget.rows.map(row => row.filter((_, i) => i !== cIdx)) });
    };

    return (
      <div className="flex flex-col h-full">
        <div className="mb-2 flex gap-2">
          <button onClick={addRow} className="text-xs bg-stone-700 hover:bg-stone-600 px-2 py-1 rounded flex items-center gap-1"><PlusSquare size={14}/> Linha</button>
          <button onClick={addColumn} className="text-xs bg-stone-700 hover:bg-stone-600 px-2 py-1 rounded flex items-center gap-1"><PlusSquare size={14}/> Coluna</button>
        </div>
        
        <div className="flex-1 overflow-auto custom-scrollbar border border-stone-700 rounded bg-stone-900 relative">
          <table className="w-full border-collapse min-w-max">
            <thead>
              {/* Linha de botões para deletar colunas */}
              <tr>
                {widget.rows[0].map((_, cIdx) => (
                  <th key={`del-col-${cIdx}`} className="p-1 border-b border-stone-700 bg-stone-800">
                    <button 
                      onClick={() => removeColumn(cIdx)} 
                      className="text-stone-500 hover:text-red-400 mx-auto block"
                      title={`Deletar Coluna ${cIdx + 1}`}
                    >
                      <MinusSquare size={14} />
                    </button>
                  </th>
                ))}
                {/* Célula vazia no canto para o botão de deletar linha */}
                <th className="bg-stone-800 border-b border-stone-700 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {widget.rows.map((row, rIdx) => (
                <tr key={`row-${rIdx}`}>
                  {row.map((cell, cIdx) => (
                    <td key={`cell-${rIdx}-${cIdx}`} className="border border-stone-700 p-0 relative">
                      <input 
                        type="text" 
                        value={cell} 
                        onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                        className="w-full h-full p-2 bg-transparent outline-none text-sm text-stone-200 placeholder-stone-600 focus:bg-stone-800 min-w-[80px]"
                        placeholder="..."
                      />
                    </td>
                  ))}
                  {/* Botão de deletar linha */}
                  <td className="border border-stone-700 bg-stone-800 text-center w-8">
                    <button 
                      onClick={() => removeRow(rIdx)} 
                      className="text-stone-500 hover:text-red-400 mx-auto block"
                      title={`Deletar Linha ${rIdx + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-stone-900 text-stone-100 font-sans selection:bg-amber-600 selection:text-white overflow-hidden">
      
      {/* Cabeçalho e Controles */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-stone-950 p-4 border-b border-stone-700 z-50 flex-shrink-0 shadow-md gap-4">
        <h1 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
          <Layout size={24} /> DM Screen Architect
        </h1>
        <div className="flex flex-wrap justify-center gap-2 flex-1 md:justify-start md:ml-4">
          <button onClick={() => addWidget('note')} className="bg-stone-800 hover:bg-amber-600 transition-colors px-3 py-2 rounded flex items-center gap-2 border border-stone-700 text-sm font-medium">
            <FileText size={16} /> Nota
          </button>
          <button onClick={() => addWidget('dice')} className="bg-stone-800 hover:bg-amber-600 transition-colors px-3 py-2 rounded flex items-center gap-2 border border-stone-700 text-sm font-medium">
            <Dices size={16} /> Dados
          </button>
          <button onClick={() => addWidget('image')} className="bg-stone-800 hover:bg-amber-600 transition-colors px-3 py-2 rounded flex items-center gap-2 border border-stone-700 text-sm font-medium">
            <ImageIcon size={16} /> Imagem
          </button>
          <button onClick={() => addWidget('table')} className="bg-stone-800 hover:bg-amber-600 transition-colors px-3 py-2 rounded flex items-center gap-2 border border-stone-700 text-sm font-medium">
            <TableIcon size={16} /> Tabela
          </button>
        </div>
        
        {/* Botão de Abrir Gerenciador de Templates */}
        <div className="flex">
          <button 
            onClick={() => setShowTemplateModal(true)} 
            className="bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors px-4 py-2 rounded flex items-center gap-2 border border-stone-600 text-sm font-bold shadow-lg"
          >
            <FolderOpen size={16} className="text-amber-500" /> Salvar / Carregar Layout
          </button>
        </div>
      </header>

      {}
      {showTemplateModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-stone-900 border border-stone-600 rounded-lg shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-stone-700 bg-stone-950">
              <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2"><Save size={20} /> Modelos de Escudo</h2>
              <button onClick={() => setShowTemplateModal(false)} className="text-stone-400 hover:text-red-400 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-5 flex flex-col gap-6">
              {/* Seção de Salvar */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-stone-300">Salvar Mesa Atual</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Ex: Combate na Taverna..."
                    className="flex-1 bg-stone-800 border border-stone-600 rounded px-3 py-2 text-sm outline-none focus:border-amber-500 text-stone-100 placeholder-stone-500"
                    onKeyDown={(e) => e.key === 'Enter' && saveTemplate()}
                  />
                  <input 
                    type="password" 
                    value={templatePassword}
                    onChange={(e) => setTemplatePassword(e.target.value)}
                    placeholder="Senha (Opcional)"
                    className="w-1/3 bg-stone-800 border border-stone-600 rounded px-3 py-2 text-sm outline-none focus:border-amber-500 text-stone-100 placeholder-stone-500"
                    onKeyDown={(e) => e.key === 'Enter' && saveTemplate()}
                  />
                  <button onClick={saveTemplate} className="bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold px-4 py-2 rounded text-sm transition-colors flex items-center gap-1 shadow">
                    Salvar
                  </button>
                </div>
                {modalMessage.text && (
                  <div className={`text-xs p-2 rounded mt-1 font-medium flex items-center gap-1 ${modalMessage.type === 'error' ? 'bg-red-900/40 text-red-400 border border-red-800' : 'bg-green-900/40 text-green-400 border border-green-800'}`}>
                    {modalMessage.type === 'success' && <Check size={14} />}
                    {modalMessage.text}
                  </div>
                )}
              </div>

              {/* Linha Divisória */}
              <div className="w-full h-px bg-stone-700"></div>

              {/* Seção de Carregar */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-stone-300">Carregar Modelos Salvos ({templates.length})</label>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {templates.length === 0 ? (
                    <p className="text-sm text-stone-500 text-center py-6 border border-dashed border-stone-700 rounded bg-stone-800/30">
                      Você ainda não salvou nenhum modelo.
                    </p>
                  ) : (
                    templates.map(t => (
                      <div key={t.id} className="flex items-center justify-between bg-stone-800 border border-stone-700 p-3 rounded group hover:border-amber-600/50 transition-colors">
                        <div className="flex flex-col overflow-hidden pr-2">
                          <span className="font-bold text-stone-200 truncate flex items-center gap-2">
                            {t.password && <Lock size={14} className="text-amber-500" title="Protegido por Senha" />}
                            {t.name}
                          </span>
                          <span className="text-xs text-stone-500">{t.date} • {t.widgets.length} Ferramentas na tela</span>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button 
                            onClick={() => requestTemplateAction(t.id, 'load')}
                            className="px-3 py-1.5 bg-stone-700 hover:bg-amber-600 hover:text-stone-900 text-stone-200 rounded text-xs font-bold transition-colors"
                          >
                            Carregar
                          </button>
                          <button 
                            onClick={() => requestTemplateAction(t.id, 'delete')}
                            className="p-1.5 text-stone-500 hover:text-red-500 hover:bg-stone-700 rounded transition-colors"
                            title="Deletar este modelo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Tela de Autenticação (Overlay) */}
            {authPrompt.isOpen && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-950/90 p-4 backdrop-blur-sm">
                <div className="bg-stone-900 border border-stone-600 rounded-lg p-5 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
                  <h3 className="text-amber-500 font-bold flex items-center gap-2 text-lg">
                    <KeyRound size={20} />
                    Acesso Protegido
                  </h3>
                  <p className="text-sm text-stone-300">
                    Este modelo exige uma senha para ser {authPrompt.action === 'load' ? 'carregado' : 'deletado'}.
                  </p>
                  <input
                    type="password"
                    value={authInput}
                    onChange={(e) => setAuthInput(e.target.value)}
                    placeholder="Digite a senha..."
                    className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 outline-none focus:border-amber-500 text-stone-100"
                    onKeyDown={(e) => e.key === 'Enter' && handleAuthSubmit()}
                    autoFocus
                  />
                  {authError && <span className="text-red-400 text-xs font-bold">{authError}</span>}
                  <div className="flex justify-end gap-2 mt-2">
                    <button 
                      onClick={() => setAuthPrompt({ isOpen: false, templateId: null, action: null })}
                      className="px-4 py-2 rounded text-stone-400 hover:bg-stone-800 transition-colors text-sm font-bold"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleAuthSubmit}
                      className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-stone-900 transition-colors text-sm font-bold shadow"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Área de Trabalho (Canvas) - Onde os widgets flutuam */}
      <main className="relative flex-1 w-full bg-stone-900 overflow-hidden" id="desktop-area">
        {/* Padrão de fundo opcional para parecer um grid/mesa */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        {widgets.map((widget) => (
          <WidgetCard 
            key={widget.id} 
            widget={widget} 
            updateWidget={updateWidget} 
            removeWidget={removeWidget}
            bringToFront={bringToFront}
          >
            {/* RENDERIZADOR ESPECÍFICO DE CONTEÚDO */}
            {widget.type === 'note' && renderNoteWidget(widget)}
            
            {widget.type === 'dice' && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="text-6xl font-black text-amber-500 drop-shadow-lg bg-stone-900 w-full text-center py-6 rounded-lg border border-stone-700 flex-1 flex items-center justify-center">
                  {widget.result}
                </div>
                <div className="flex flex-wrap justify-center gap-2 w-full">
                  {[4, 6, 8, 10, 12, 20, 100].map(d => (
                    <button 
                      key={d} onClick={() => rollDice(widget.id, d)}
                      className="bg-stone-700 hover:bg-amber-600 transition-colors px-3 py-2 rounded font-bold border border-stone-600 hover:border-amber-500 flex-1 min-w-[45px] text-center text-sm"
                    >
                      D{d}
                    </button>
                  ))}
                </div>
                {widget.history && widget.history.length > 0 && (
                  <div className="w-full text-xs text-stone-500 text-center bg-stone-900/50 p-1 rounded">
                    Últimos: {widget.history.slice(1).join(' | ')}
                  </div>
                )}
              </div>
            )}

            {widget.type === 'image' && (
              <div className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-stone-600 rounded-lg p-2 bg-stone-900/50 overflow-hidden relative group">
                {widget.imageData ? (
                  <>
                    <img src={widget.imageData} alt="Mapa/Arte" className="w-full h-full object-contain rounded" />
                    <label className="absolute bottom-2 right-2 bg-stone-800/80 text-white px-2 py-1 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-xs border border-stone-600 hover:bg-amber-600">
                      Trocar
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(widget.id, e)} className="hidden" />
                    </label>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center text-stone-400 hover:text-amber-500 transition-colors w-full h-full justify-center">
                    <ImageIcon size={48} className="mb-2 opacity-50" />
                    <span className="text-sm text-center px-4">Clique para carregar mapa ou imagem</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(widget.id, e)} className="hidden" />
                  </label>
                )}
              </div>
            )}

            {widget.type === 'table' && renderTableWidget(widget)}

          </WidgetCard>
        ))}
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1c1917; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #44403c; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f59e0b; }
      `}} />
    </div>
  );
};

export default App;
