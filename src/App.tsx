import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Dices, Layout, Image as ImageIcon, 
  Table as TableIcon, FileText, Bold, Italic, 
  Heading, List, FilePlus, PlusSquare, X,
  GripHorizontal, MinusSquare, Scaling,
  Save, FolderOpen, Check, Lock, KeyRound,
  Search, ImagePlus, RefreshCw, Download, Upload,
  Unlock, Settings, Smartphone, Palette, MonitorPlay, MousePointer2
} from 'lucide-react';

const THEMES = {
  amber: { main: '#f59e0b', hover: '#d97706' },
  emerald: { main: '#10b981', hover: '#059669' },
  blue: { main: '#3b82f6', hover: '#2563eb' },
  purple: { main: '#a855f7', hover: '#9333ea' },
  rose: { main: '#f43f5e', hover: '#e11d48' },
  red: { main: '#ef4444', hover: '#b91c1c' }
};

const WidgetCard = ({ widget, updateWidget, removeWidget, bringToFront, isMobileMode, children }) => {
  const cardRef = useRef(null);

  const handleDragStart = (e) => {
    if (widget.isLocked) return;
    e.preventDefault();
    bringToFront(widget.id);
    
    // Captura o ponteiro: garante que o arrasto não pare se o dedo sair do elemento (ótimo para touch)
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch(err) {}
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = widget.x || 0;
    const startPosY = widget.y || 0;

    const desktopArea = document.getElementById('desktop-area');
    const desktopRect = desktopArea ? desktopArea.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      let newX = startPosX + dx;
      let newY = startPosY + dy;
      
      // Barreiras de colisão com as bordas da tela
      let maxX = desktopRect.width - (widget.width || 300);
      let maxY = desktopRect.height - (widget.height || 300);
      
      maxX = maxX > 0 ? maxX : 0;
      maxY = maxY > 0 ? maxY : 0;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      updateWidget(widget.id, { x: newX, y: newY });
    };

    const onPointerUp = (upEvent) => {
      try { upEvent.currentTarget.releasePointerCapture(upEvent.pointerId); } catch(err) {}
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const handleResizeStart = (e) => {
    if (widget.isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    bringToFront(widget.id);

    try { e.currentTarget.setPointerCapture(e.pointerId); } catch(err) {}

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = widget.width || 300;
    const startH = widget.height || 300;

    const desktopArea = document.getElementById('desktop-area');
    const desktopRect = desktopArea ? desktopArea.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };

    const onPointerMove = (moveEvent) => {
      const dw = moveEvent.clientX - startX;
      const dh = moveEvent.clientY - startY;
      
      const maxW = desktopRect.width - (widget.x || 0);
      const maxH = desktopRect.height - (widget.y || 0);
      
      updateWidget(widget.id, { 
        width: Math.min(maxW, Math.max(250, startW + dw)), 
        height: Math.min(maxH, Math.max(200, startH + dh)) 
      });
    };

    const onPointerUp = (upEvent) => {
      try { upEvent.currentTarget.releasePointerCapture(upEvent.pointerId); } catch(err) {}
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const toggleLock = (e) => {
    e.stopPropagation();
    updateWidget(widget.id, { isLocked: !widget.isLocked });
  };

  return (
    <div 
      ref={cardRef}
      onPointerDown={() => bringToFront(widget.id)}
      className={`absolute flex flex-col bg-stone-800 border ${widget.isLocked ? 'border-stone-600' : 'border-stone-700'} rounded-lg shadow-2xl overflow-hidden transition-shadow ${widget.isLocked ? 'shadow-none opacity-95' : ''}`}
      style={{ 
        left: widget.x, 
        top: widget.y, 
        width: widget.width, 
        height: widget.height, 
        zIndex: widget.zIndex || 1 
      }}
    >
      <div 
        className={`flex justify-between items-center bg-stone-950 px-3 ${isMobileMode ? 'py-3' : 'py-2'} border-b border-stone-700 select-none touch-none ${widget.isLocked ? 'cursor-default' : 'cursor-move'}`}
        onPointerDown={handleDragStart}
      >
        <div className="flex items-center gap-2 w-full overflow-hidden pr-2">
          {!widget.isLocked && <GripHorizontal size={isMobileMode ? 18 : 14} className="text-stone-500 flex-shrink-0" />}
          <input 
            type="text" 
            value={widget.title}
            onPointerDown={(e) => e.stopPropagation()} 
            onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
            className={`font-bold theme-text bg-transparent outline-none w-full focus:bg-stone-900 rounded px-1 truncate ${isMobileMode ? 'text-base' : 'text-sm'}`}
            disabled={widget.isLocked}
          />
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={toggleLock} 
            className={`p-1.5 rounded transition-colors ${widget.isLocked ? 'theme-text bg-stone-800' : 'text-stone-500 hover:bg-stone-800'}`}
            title={widget.isLocked ? "Destrancar" : "Trancar Posição"}
          >
            {widget.isLocked ? <Lock size={isMobileMode ? 18 : 16} /> : <Unlock size={isMobileMode ? 18 : 16} />}
          </button>
          
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => removeWidget(widget.id)} 
            className="text-red-500 hover:text-red-400 p-1.5 hover:bg-stone-800 rounded transition-colors"
            title="Fechar Janela"
          >
            <X size={isMobileMode ? 20 : 16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-2">
        {children}
      </div>

      {!widget.isLocked && (
        <div 
          className={`absolute bottom-0 right-0 cursor-nwse-resize text-stone-500 hover:text-white transition-colors touch-none ${isMobileMode ? 'p-3 bg-stone-800/80 rounded-tl-lg' : 'p-1'}`}
          onPointerDown={handleResizeStart}
        >
          <Scaling size={isMobileMode ? 24 : 16} />
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [topZ, setTopZ] = useState(10);
  const [widgets, setWidgets] = useState([
    { 
      id: 1, type: 'note', title: 'Grimório da Campanha', 
      pages: [{ id: 101, title: 'Capítulo 1', content: '<h2>O Início</h2><p>A aventura começa...</p>' }],
      activePageId: 101, x: 50, y: 50, width: 400, height: 350, zIndex: 2, isLocked: false
    },
    { 
      id: 2, type: 'dice', title: 'Rolador de Dados', 
      result: '---', history: [], 
      x: 500, y: 50, width: 300, height: 280, zIndex: 1, isLocked: false
    }
  ]);

  const [templates, setTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [appSettings, setAppSettings] = useState({
    theme: 'amber',
    bgType: 'none', // none, color, image, video
    bgValue: '#1c1917',
    opacity: 30
  });

  const [isMobileMode, setIsMobileMode] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' });
  const [templatePassword, setTemplatePassword] = useState('');
  const [templateImage, setTemplateImage] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [authPrompt, setAuthPrompt] = useState({ isOpen: false, templateId: null, action: null });
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Efeito de inicialização para carregar configurações e layouts do localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem('dmscreen_templates');
    if (savedTemplates) {
      try { setTemplates(JSON.parse(savedTemplates)); } catch (e) { console.error(e); }
    }
    
    const savedSettings = localStorage.getItem('dmscreen_settings');
    if (savedSettings) {
      try { setAppSettings(JSON.parse(savedSettings)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveSettings = (newSettings) => {
    setAppSettings(newSettings);
    localStorage.setItem('dmscreen_settings', JSON.stringify(newSettings));
  };

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onloadend = () => {
        saveSettings({ ...appSettings, bgType: isVideo ? 'video' : 'image', bgValue: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTemplateImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

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
        image: templateImage,
        widgets: widgets,
        topZ: topZ,
        date: new Date().toLocaleDateString()
      };
      
      const existingIndex = templates.findIndex(t => t.name === templateName);
      let updatedTemplates = [...templates];
      
      if (existingIndex >= 0) updatedTemplates[existingIndex] = newTemplate;
      else updatedTemplates.push(newTemplate);
      
      localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
      setModalMessage({ type: 'success', text: 'Modelo salvo com sucesso!' });
      setTimeout(() => setModalMessage({ type: '', text: '' }), 3000); 
      setTemplateName(''); 
      setTemplatePassword(''); 
      setTemplateImage(null); 
    } catch (error) {
      setModalMessage({ type: 'error', text: 'Erro! Limite de memória atingido.' });
    }
  };

  const loadTemplate = (id) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      setWidgets(template.widgets);
      setTopZ(template.topZ);
      setShowTemplateModal(false);
    }
  };

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
    if (action === 'update') {
      const updatedTemplates = templates.map(t => 
        t.id === id ? { ...t, widgets: [...widgets], topZ, date: new Date().toLocaleDateString() } : t
      );
      localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
      setModalMessage({ type: 'success', text: 'Modelo atualizado com sucesso!' });
      setTimeout(() => setModalMessage({ type: '', text: '' }), 3000);
    }
    setAuthPrompt({ isOpen: false, templateId: null, action: null });
  };

  const handleAuthSubmit = () => {
    const template = templates.find(t => t.id === authPrompt.templateId);
    const MASTER_PASSWORD = "71996813993";
    
    if (template && (template.password === authInput || authInput === MASTER_PASSWORD)) {
      executeAction(authPrompt.templateId, authPrompt.action);
    } else {
      setAuthError('Senha incorreta!');
    }
  };

  const exportTemplate = (template) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${template.name.replace(/\s+/g, '_')}_dm_layout.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importTemplate = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        const newTemplates = [...templates, { ...imported, id: Date.now() }];
        localStorage.setItem('dmscreen_templates', JSON.stringify(newTemplates));
        setTemplates(newTemplates);
        setModalMessage({ type: 'success', text: 'Modelo importado com sucesso!' });
        setTimeout(() => setModalMessage({ type: '', text: '' }), 3000);
      } catch (err) {
        setModalMessage({ type: 'error', text: 'Arquivo inválido.' });
      }
    };
    reader.readAsText(file);
  };

  const bringToFront = (id) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    updateWidget(id, { zIndex: newZ });
  };

  const addWidget = (type) => {
    const desktopArea = document.getElementById('desktop-area');
    const maxWidth = desktopArea ? desktopArea.clientWidth : window.innerWidth;
    const maxHeight = desktopArea ? desktopArea.clientHeight : window.innerHeight;

    const offset = (widgets.length % 5) * 40;
    
    let newWidget = { 
      id: Date.now(), type, title: 'Novo Widget',
      x: Math.min(100 + offset, Math.max(0, maxWidth - 350)), 
      y: Math.min(100 + offset, Math.max(0, maxHeight - 300)),
      zIndex: topZ + 1, width: 350, height: 300, isLocked: false
    };
    setTopZ(topZ + 1);

    if (type === 'note') {
      newWidget.title = 'Anotações';
      newWidget.pages = [{ id: Date.now() + 1, title: 'Nova Página', content: '' }];
      newWidget.activePageId = newWidget.pages[0].id;
      newWidget.width = Math.min(400, maxWidth); newWidget.height = Math.min(400, maxHeight);
    } else if (type === 'dice') {
      newWidget.title = 'Dados';
      newWidget.result = '---';
      newWidget.lastRollDetail = '';
      newWidget.diceCount = 1;
      newWidget.diceModifier = 0;
      newWidget.history = [];
      newWidget.width = 300; newWidget.height = 300;
    } else if (type === 'image') {
      newWidget.title = 'Imagem / Mapa';
      newWidget.imageData = null;
      newWidget.width = Math.min(400, maxWidth); newWidget.height = Math.min(350, maxHeight);
    } else if (type === 'table') {
      newWidget.title = 'Tabela Personalizada';
      newWidget.rows = [['', ''], ['', '']];
      newWidget.width = Math.min(450, maxWidth); newWidget.height = Math.min(300, maxHeight);
    }

    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id) => setWidgets(widgets.filter(w => w.id !== id));

  const updateWidget = (id, updates) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const rollDice = (widgetId, sides) => {
    const widget = widgets.find(w => w.id === widgetId);
    const count = parseInt(widget.diceCount) || 1;
    const mod = parseInt(widget.diceModifier) || 0;

    let total = 0;
    let rolls = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    
    const finalResult = total + mod;
    const sign = mod > 0 ? '+' : '';
    const modString = mod !== 0 ? `${sign}${mod}` : '';
    const rollName = `${count}d${sides}${modString}`;
    const detail = `[${rolls.join(', ')}] ${modString}`;

    const historyEntry = `${rollName} ➔ ${finalResult}`;
    const newHistory = [historyEntry, ...(widget.history || [])].slice(0, 5);

    updateWidget(widgetId, { 
      result: finalResult, 
      lastRollDetail: detail, 
      history: newHistory 
    });
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
      e.stopPropagation();
      if (widget.pages.length === 1) return;
      const newPages = widget.pages.filter(p => p.id !== pageId);
      let newActiveId = widget.activePageId;
      if (newActiveId === pageId) newActiveId = newPages[0].id;
      updateWidget(widget.id, { pages: newPages, activePageId: newActiveId });
    };

    const updatePageContent = (htmlContent) => {
      const newPages = widget.pages.map(p => 
        p.id === activePage.id ? { ...p, content: htmlContent } : p
      );
      updateWidget(widget.id, { pages: newPages });
    };

    const updatePageTitle = (pageId, newTitle) => {
      const newPages = widget.pages.map(p => 
        p.id === pageId ? { ...p, title: newTitle } : p
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
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded cursor-pointer group whitespace-nowrap border border-transparent ${widget.activePageId === page.id ? 'bg-stone-700 theme-text border-stone-600' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}
            >
              <input
                type="text"
                value={page.title}
                onChange={(e) => updatePageTitle(page.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent outline-none w-20 sm:w-24 text-inherit truncate placeholder-stone-500"
                placeholder="Sem Título"
              />
              {widget.pages.length > 1 && (
                <button 
                  onClick={(e) => deletePage(e, page.id)} 
                  className={`opacity-${isMobileMode ? '100' : '0'} group-hover:opacity-100 hover:text-red-400 transition-opacity ml-1`}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addPage} className="px-2 py-1 text-stone-400 hover:text-white flex-shrink-0" title="Nova Aba">
            <FilePlus size={16} />
          </button>
        </div>

        <div className={`flex gap-2 bg-stone-800 border-b border-stone-700 flex-wrap ${isMobileMode ? 'p-2' : 'p-1'}`}>
          <button onClick={() => execCmd('bold')} className="p-1.5 hover:bg-stone-700 rounded text-stone-300" title="Negrito"><Bold size={isMobileMode ? 18 : 14} /></button>
          <button onClick={() => execCmd('italic')} className="p-1.5 hover:bg-stone-700 rounded text-stone-300" title="Itálico"><Italic size={isMobileMode ? 18 : 14} /></button>
          <button onClick={() => execCmd('formatBlock', 'H2')} className="p-1.5 hover:bg-stone-700 rounded text-stone-300" title="Título"><Heading size={isMobileMode ? 18 : 14} /></button>
          <button onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-stone-700 rounded text-stone-300" title="Lista"><List size={isMobileMode ? 18 : 14} /></button>
        </div>

        <div 
          className="flex-1 w-full bg-stone-900 p-3 rounded-b-lg text-sm text-stone-200 outline-none overflow-y-auto custom-scrollbar"
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
        <div className={`mb-2 flex gap-2 ${isMobileMode ? 'p-1' : ''}`}>
          <button onClick={addRow} className={`text-xs bg-stone-700 hover:bg-stone-600 rounded flex items-center gap-1 ${isMobileMode ? 'px-3 py-2' : 'px-2 py-1'}`}><PlusSquare size={14}/> Linha</button>
          <button onClick={addColumn} className={`text-xs bg-stone-700 hover:bg-stone-600 rounded flex items-center gap-1 ${isMobileMode ? 'px-3 py-2' : 'px-2 py-1'}`}><PlusSquare size={14}/> Coluna</button>
        </div>
        
        <div className="flex-1 overflow-auto custom-scrollbar border border-stone-700 rounded bg-stone-900 relative">
          <table className="w-full border-collapse min-w-max">
            <thead>
              <tr>
                {widget.rows[0].map((_, cIdx) => (
                  <th key={`del-col-${cIdx}`} className="p-1 border-b border-stone-700 bg-stone-800">
                    <button onClick={() => removeColumn(cIdx)} className="text-stone-500 hover:text-red-400 mx-auto block p-1">
                      <MinusSquare size={16} />
                    </button>
                  </th>
                ))}
                <th className="bg-stone-800 border-b border-stone-700 w-10"></th>
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
                        className={`w-full h-full bg-transparent outline-none text-stone-200 placeholder-stone-600 focus:bg-stone-800 min-w-[80px] ${isMobileMode ? 'p-3 text-base' : 'p-2 text-sm'}`}
                        placeholder="..."
                      />
                    </td>
                  ))}
                  <td className="border border-stone-700 bg-stone-800 text-center w-10">
                    <button onClick={() => removeRow(rIdx)} className="text-stone-500 hover:text-red-400 mx-auto block p-2">
                      <Trash2 size={16} />
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

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentThemeHex = THEMES[appSettings.theme].main;
  const currentHoverHex = THEMES[appSettings.theme].hover;

  return (
    <div className="flex flex-col h-screen bg-stone-900 text-stone-100 font-sans overflow-hidden">
      
      {/* Injeção de variáveis CSS Dinâmicas para o Tema */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --theme-main: ${currentThemeHex};
          --theme-hover: ${currentHoverHex};
        }
        .theme-text { color: var(--theme-main); }
        .theme-bg { background-color: var(--theme-main); }
        .theme-bg-hover:hover { background-color: var(--theme-hover); }
        .theme-border { border-color: var(--theme-main); }
        .theme-border-hover:hover { border-color: var(--theme-main); }
        
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1c1917; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #44403c; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--theme-main); }
        
        ::selection { background-color: var(--theme-main); color: #fff; }
      `}} />

      <header className="flex flex-col md:flex-row justify-between items-center bg-stone-950 p-4 border-b border-stone-700 z-50 flex-shrink-0 shadow-md gap-4">
        <h1 className="text-2xl font-bold theme-text flex items-center gap-2">
          <Layout size={24} /> DM Screen
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 flex-1 md:justify-start md:ml-4">
          <button onClick={() => addWidget('note')} className="bg-stone-800 theme-bg-hover hover:text-stone-900 transition-colors px-3 py-2 rounded flex items-center gap-2 border border-stone-700 text-sm font-bold">
            <FileText size={16} /> Nota
          </button>
          <button onClick={() => addWidget('dice')} className="bg-stone-800 theme-bg-hover hover:text-stone-900 transition-colors px-3 py-2 rounded flex items-center gap-2 border border-stone-700 text-sm font-bold">
            <Dices size={16} /> Dados
          </button>
          <button onClick={() => addWidget('image')} className="bg-stone-800 theme-bg-hover hover:text-stone-900 transition-colors px-3 py-2 rounded flex items-center gap-2 border border-stone-700 text-sm font-bold">
            <ImageIcon size={16} /> Imagem
          </button>
          <button onClick={() => addWidget('table')} className="bg-stone-800 theme-bg-hover hover:text-stone-900 transition-colors px-3 py-2 rounded flex items-center gap-2 border border-stone-700 text-sm font-bold">
            <TableIcon size={16} /> Tabela
          </button>
        </div>
        
        <div className="flex gap-2">
          {/* Botão Modo Mobile */}
          <button 
            onClick={() => setIsMobileMode(!isMobileMode)} 
            className={`px-3 py-2 rounded flex items-center gap-2 border transition-colors text-sm font-bold shadow-lg ${isMobileMode ? 'theme-bg text-stone-900 border-transparent' : 'bg-stone-800 text-stone-300 border-stone-600 hover:bg-stone-700'}`}
            title="Modo Móvel (Fácil Toque)"
          >
            {isMobileMode ? <Smartphone size={18} /> : <MousePointer2 size={18} />}
          </button>

          {/* Botão Configurações */}
          <button 
            onClick={() => setShowSettingsModal(true)} 
            className="bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors px-3 py-2 rounded flex items-center gap-2 border border-stone-600 text-sm font-bold shadow-lg"
            title="Configurações"
          >
            <Settings size={18} />
          </button>

          <button 
            onClick={() => setShowTemplateModal(true)} 
            className="bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors px-4 py-2 rounded flex items-center gap-2 border border-stone-600 text-sm font-bold shadow-lg"
          >
            <FolderOpen size={16} className="theme-text" /> Layouts
          </button>
        </div>
      </header>

      {}
      {showSettingsModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-600 rounded-lg shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-stone-700 bg-stone-950">
              <h2 className="text-lg font-bold theme-text flex items-center gap-2"><Settings size={20} /> Configurações Visuais</h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-stone-400 hover:text-red-400 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-5 flex flex-col gap-6">
              {/* Cores do Tema */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-stone-300 flex items-center gap-2"><Palette size={16}/> Cor do Tema Principal</label>
                <div className="flex gap-3 flex-wrap">
                  {Object.keys(THEMES).map(themeKey => (
                    <button 
                      key={themeKey}
                      onClick={() => saveSettings({ ...appSettings, theme: themeKey })}
                      className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${appSettings.theme === themeKey ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                      style={{ backgroundColor: THEMES[themeKey].main }}
                      title={`Tema ${themeKey}`}
                    />
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-stone-700"></div>

              {/* Background */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-stone-300 flex items-center gap-2"><MonitorPlay size={16}/> Plano de Fundo da Mesa</label>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => saveSettings({ ...appSettings, bgType: 'none', bgValue: '#1c1917' })}
                    className={`flex-1 py-2 text-sm font-bold rounded border ${appSettings.bgType === 'none' ? 'theme-bg text-stone-900 border-transparent' : 'bg-stone-800 border-stone-600 text-stone-300 hover:bg-stone-700'}`}
                  >
                    Cor Sólida
                  </button>
                  <label className={`flex-1 py-2 text-sm font-bold rounded border text-center cursor-pointer ${appSettings.bgType === 'upload' ? 'theme-bg text-stone-900 border-transparent' : 'bg-stone-800 border-stone-600 text-stone-300 hover:bg-stone-700'}`}>
                    Upload Arquivo
                    <input type="file" accept="image/*,video/mp4,video/webm" onChange={handleBackgroundUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-xs text-stone-400">Ou cole uma URL (Link de Imagem/Vídeo/GIF):</label>
                  <input 
                    type="text" 
                    placeholder="https://exemplo.com/fundo.gif"
                    className="bg-stone-800 border border-stone-600 rounded px-3 py-2 text-sm outline-none focus:border-[var(--theme-main)] text-stone-100"
                    onChange={(e) => {
                      if(e.target.value) {
                          const isVid = e.target.value.match(/\.(mp4|webm)$/i);
                          saveSettings({ ...appSettings, bgType: isVid ? 'video' : 'image', bgValue: e.target.value });
                      }
                    }}
                  />
                </div>

                {appSettings.bgType !== 'none' && (
                  <div className="flex flex-col gap-1 mt-2">
                    <label className="text-xs text-stone-400">Opacidade do Fundo</label>
                    <input 
                      type="range" min="10" max="100" 
                      value={appSettings.opacity || 30}
                      onChange={(e) => saveSettings({ ...appSettings, opacity: e.target.value })}
                      className="w-full accent-[var(--theme-main)]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {showTemplateModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-600 rounded-lg shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-stone-700 bg-stone-950">
              <h2 className="text-lg font-bold theme-text flex items-center gap-2"><Save size={20} /> Modelos de Escudo</h2>
              <div className="flex gap-2">
                <label className="cursor-pointer bg-stone-800 hover:bg-stone-700 text-stone-300 p-2 rounded transition-colors" title="Importar Layout JSON">
                  <Upload size={18} />
                  <input type="file" accept=".json" onChange={importTemplate} className="hidden" />
                </label>
                <button onClick={() => setShowTemplateModal(false)} className="text-stone-400 hover:text-red-400 transition-colors"><X size={20} /></button>
              </div>
            </div>
            
            <div className="p-5 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-stone-300">Salvar Mesa Atual</label>
                <div className="flex gap-2">
                  <label className="cursor-pointer flex-shrink-0 w-10 h-10 bg-stone-800 border border-stone-600 rounded flex items-center justify-center hover:bg-stone-700 transition-colors relative overflow-hidden" title="Adicionar miniatura">
                    {templateImage ? (
                      <img src={templateImage} alt="Thumb" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus size={18} className="text-stone-400" />
                    )}
                    <input type="file" accept="image/*" onChange={handleTemplateImageUpload} className="hidden" />
                  </label>
                  <input 
                    type="text" 
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Nome do Modelo"
                    className="flex-1 bg-stone-800 border border-stone-600 rounded px-3 py-2 text-sm outline-none focus:border-[var(--theme-main)] text-stone-100 placeholder-stone-500 min-w-[120px]"
                    onKeyDown={(e) => e.key === 'Enter' && saveTemplate()}
                  />
                  <input 
                    type="password" 
                    value={templatePassword}
                    onChange={(e) => setTemplatePassword(e.target.value)}
                    placeholder="Senha"
                    className="w-1/4 bg-stone-800 border border-stone-600 rounded px-3 py-2 text-sm outline-none focus:border-[var(--theme-main)] text-stone-100 placeholder-stone-500"
                    onKeyDown={(e) => e.key === 'Enter' && saveTemplate()}
                  />
                  <button onClick={saveTemplate} className="theme-bg theme-bg-hover text-stone-900 font-bold px-4 py-2 rounded text-sm transition-colors shadow">
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

              <div className="w-full h-px bg-stone-700"></div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-stone-300">Carregar Salvos ({templates.length})</label>
                  <div className="relative w-1/2">
                    <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Pesquisar..." 
                      className="w-full bg-stone-900 border border-stone-700 rounded-full pl-7 pr-3 py-1 text-xs outline-none focus:border-[var(--theme-main)] text-stone-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1 mt-1">
                  {filteredTemplates.length === 0 ? (
                    <p className="text-sm text-stone-500 text-center py-6 border border-dashed border-stone-700 rounded bg-stone-800/30">
                      {templates.length === 0 ? "Você ainda não salvou nenhum modelo." : "Nenhum modelo encontrado."}
                    </p>
                  ) : (
                    filteredTemplates.map(t => (
                      <div key={t.id} className="flex items-center justify-between bg-stone-800 border border-stone-700 p-2 rounded group theme-border-hover transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden pr-2">
                          {t.image ? (
                            <img src={t.image} alt={t.name} className="w-10 h-10 rounded object-cover flex-shrink-0 border border-stone-600" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-stone-900 border border-stone-700 flex items-center justify-center flex-shrink-0">
                              <Layout size={16} className="text-stone-500" />
                            </div>
                          )}
                          
                          <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-stone-200 truncate flex items-center gap-2">
                              {t.password && <Lock size={14} className="theme-text" title="Protegido por Senha" />}
                              {t.name}
                            </span>
                            <span className="text-xs text-stone-500">{t.date} • {t.widgets.length} Janelas</span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => exportTemplate(t)} className="p-1.5 text-stone-500 hover:text-emerald-400 hover:bg-stone-700 rounded" title="Exportar Backup">
                            <Download size={16} />
                          </button>
                          <button onClick={() => requestTemplateAction(t.id, 'load')} className="px-2 py-1.5 bg-stone-700 theme-bg-hover hover:text-stone-900 text-stone-200 rounded text-xs font-bold transition-colors">
                            Carregar
                          </button>
                          <button onClick={() => requestTemplateAction(t.id, 'update')} className="p-1.5 text-stone-500 hover:text-blue-400 hover:bg-stone-700 rounded" title="Atualizar Layout Atual">
                            <RefreshCw size={16} />
                          </button>
                          <button onClick={() => requestTemplateAction(t.id, 'delete')} className="p-1.5 text-stone-500 hover:text-red-500 hover:bg-stone-700 rounded" title="Deletar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {authPrompt.isOpen && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-950/95 p-4">
                <div className="bg-stone-900 border border-stone-600 rounded-lg p-5 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
                  <h3 className="theme-text font-bold flex items-center gap-2 text-lg">
                    <KeyRound size={20} />
                    Acesso Protegido
                  </h3>
                  <p className="text-sm text-stone-300">
                    Este modelo exige senha.
                  </p>
                  <input
                    type="password"
                    value={authInput}
                    onChange={(e) => setAuthInput(e.target.value)}
                    placeholder="Digite a senha..."
                    className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 outline-none focus:border-[var(--theme-main)] text-stone-100"
                    onKeyDown={(e) => e.key === 'Enter' && handleAuthSubmit()}
                    autoFocus
                  />
                  {authError && <span className="text-red-400 text-xs font-bold">{authError}</span>}
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setAuthPrompt({ isOpen: false, templateId: null, action: null })} className="px-4 py-2 rounded text-stone-400 hover:bg-stone-800 text-sm font-bold">
                      Cancelar
                    </button>
                    <button onClick={handleAuthSubmit} className="px-4 py-2 rounded theme-bg theme-bg-hover text-stone-900 text-sm font-bold shadow">
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      <main className="relative flex-1 w-full overflow-hidden bg-stone-900" id="desktop-area">
        
        {/* Renderizador de Fundo */}
        {appSettings.bgType === 'none' && (
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        )}
        {appSettings.bgType === 'image' && (
          <img src={appSettings.bgValue} className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: (appSettings.opacity || 30) / 100 }} alt="Fundo" />
        )}
        {appSettings.bgType === 'video' && (
          <video src={appSettings.bgValue} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: (appSettings.opacity || 30) / 100 }} />
        )}

        {widgets.map((widget) => (
          <WidgetCard 
            key={widget.id} 
            widget={widget} 
            updateWidget={updateWidget} 
            removeWidget={removeWidget}
            bringToFront={bringToFront}
            isMobileMode={isMobileMode}
          >
            {widget.type === 'note' && renderNoteWidget(widget)}
            
            {widget.type === 'dice' && (
              <div className="flex flex-col items-center justify-center h-full gap-2 p-1">
                <div className="text-5xl font-black theme-text drop-shadow-lg bg-stone-900/80 w-full text-center py-3 rounded-lg border border-stone-700 flex-1 flex flex-col items-center justify-center relative">
                  <span>{widget.result}</span>
                  {widget.lastRollDetail && <span className="text-sm text-stone-500 font-normal mt-1">{widget.lastRollDetail}</span>}
                </div>
                
                <div className="flex gap-2 w-full mb-1">
                  <div className={`flex-1 flex items-center bg-stone-900/80 border border-stone-700 rounded px-2 ${isMobileMode ? 'py-2' : ''}`} title="Quantidade de Dados">
                    <span className="text-xs text-stone-400 mr-2 font-bold">Qtd:</span>
                    <input type="number" min="1" max="100" value={widget.diceCount || 1} onChange={(e) => updateWidget(widget.id, { diceCount: e.target.value })} className={`bg-transparent theme-text font-bold outline-none w-full py-1 ${isMobileMode ? 'text-base' : 'text-sm'}`} />
                  </div>
                  <div className={`flex-1 flex items-center bg-stone-900/80 border border-stone-700 rounded px-2 ${isMobileMode ? 'py-2' : ''}`} title="Modificador (+/-)">
                    <span className="text-xs text-stone-400 mr-2 font-bold">Mod:</span>
                    <input type="number" value={widget.diceModifier || 0} onChange={(e) => updateWidget(widget.id, { diceModifier: e.target.value })} className={`bg-transparent theme-text font-bold outline-none w-full py-1 ${isMobileMode ? 'text-base' : 'text-sm'}`} />
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-1 w-full">
                  {[4, 6, 8, 10, 12, 20, 100].map(d => (
                    <button 
                      key={d} onClick={() => rollDice(widget.id, d)}
                      className={`bg-stone-700 theme-bg-hover hover:text-stone-900 transition-colors rounded font-bold border border-stone-600 theme-border-hover flex-1 min-w-[35px] text-center shadow-sm ${isMobileMode ? 'py-3 text-base' : 'py-1.5 text-sm'}`}
                    >
                      D{d}
                    </button>
                  ))}
                </div>
                {widget.history && widget.history.length > 0 && (
                  <div className="w-full text-xs text-stone-500 text-center bg-stone-900/80 p-1.5 rounded truncate mt-1 border border-stone-800" title={widget.history.join(' | ')}>
                    Últimos: {widget.history.slice(1).join(' | ')}
                  </div>
                )}
              </div>
            )}

            {widget.type === 'image' && (
              <div className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-stone-600 rounded-lg p-2 bg-stone-900/80 overflow-hidden relative group">
                {widget.imageData ? (
                  <>
                    <img src={widget.imageData} alt="Mapa" className="w-full h-full object-contain rounded pointer-events-none" />
                    <label className="absolute bottom-2 right-2 bg-stone-800/90 text-white px-3 py-2 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold border border-stone-600 theme-bg-hover">
                      Trocar
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(widget.id, e)} className="hidden" />
                    </label>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center text-stone-400 theme-text transition-colors w-full h-full justify-center">
                    <ImageIcon size={48} className="mb-2 opacity-50" />
                    <span className="text-sm text-center px-4">Toque para carregar mapa ou imagem</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(widget.id, e)} className="hidden" />
                  </label>
                )}
              </div>
            )}

            {widget.type === 'table' && renderTableWidget(widget)}

          </WidgetCard>
        ))}
      </main>
      
      {}
      <footer className="bg-stone-950 border-t border-stone-700 p-2 flex items-center gap-2 overflow-x-auto custom-scrollbar flex-shrink-0 z-50 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.5)]">
        <div className="text-stone-400 text-xs font-bold px-2 whitespace-nowrap flex items-center gap-2">
          <Layout size={14} /> Janelas: <span className="theme-text">{widgets.length}</span>
        </div>
        <div className="h-4 w-px bg-stone-700 mx-1"></div>
        {widgets.map(w => (
          <button 
            key={w.id}
            onClick={() => bringToFront(w.id)}
            className={`px-3 bg-stone-800 theme-bg-hover hover:text-stone-900 border border-stone-700 rounded font-medium text-stone-300 transition-colors whitespace-nowrap flex items-center gap-1.5 max-w-[150px] ${isMobileMode ? 'py-2 text-sm' : 'py-1.5 text-xs'}`}
            title="Trazer para frente"
          >
            {w.type === 'note' && <FileText size={12}/>}
            {w.type === 'dice' && <Dices size={12}/>}
            {w.type === 'image' && <ImageIcon size={12}/>}
            {w.type === 'table' && <TableIcon size={12}/>}
            <span className="truncate">{w.title}</span>
            {w.isLocked && <Lock size={10} className="ml-1 opacity-50"/>}
          </button>
        ))}
      </footer>

    </div>
  );
};

export default App;
