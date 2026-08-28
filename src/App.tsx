import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Dices, Layout, Image as ImageIcon, 
  Table as TableIcon, FileText, Bold, Italic, 
  Heading, List, FilePlus, PlusSquare, X,
  GripHorizontal, MinusSquare, Scaling,
  Save, FolderOpen, Check, Lock,
  Search, ImagePlus, RefreshCw, Download, Upload,
  Unlock, Settings, Smartphone, MonitorPlay,
  Swords, ChevronLeft, ChevronRight,
  Link2, ArrowUp, ArrowDown, ExternalLink, Minus, Type
} from 'lucide-react';

const THEMES = {
  amber: { main: '#d97706', bg: '#1c1917', text: '#fef3c7' },
  emerald: { main: '#059669', bg: '#064e3b', text: '#d1fae5' },
  blue: { main: '#2563eb', bg: '#1e3a8a', text: '#dbeafe' },
  purple: { main: '#7c3aed', bg: '#4c1d95', text: '#ede9fe' },
  rose: { main: '#e11d48', bg: '#881337', text: '#ffe4e6' },
  pjlite: { main: '#f59e0b', bg: '#18181b', text: '#fcd34d' }
};

const WidgetCard = ({ widget, updateWidget, removeWidget, bringToFront, isMobileMode, children }) => {
  const cardRef = useRef(null);

  const handleDragStart = (e) => {
    if (widget.isLocked) return;
    e.preventDefault();
    bringToFront(widget.id);
    
    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);
    const startPosX = widget.x || 0;
    const startPosY = widget.y || 0;

    const onMove = (moveEvent) => {
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      
      const dx = clientX - startX;
      const dy = clientY - startY;
      
      let newX = startPosX + dx;
      let newY = startPosY + dy;
      
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;
      
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      updateWidget(widget.id, { x: newX, y: newY });
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  const handleResizeStart = (e) => {
    if (widget.isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    bringToFront(widget.id);

    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);
    const startW = widget.width || 300;
    const startH = widget.height || 300;

    const onMove = (moveEvent) => {
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      const dw = clientX - startX;
      const dh = clientY - startY;
      
      const maxWidth = window.innerWidth - (widget.x || 0);
      const maxHeight = window.innerHeight - (widget.y || 0) - 50;

      updateWidget(widget.id, { 
        width: Math.max(250, Math.min(startW + dw, maxWidth)),
        height: Math.max(200, Math.min(startH + dh, maxHeight))
      });
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  return (
    <div 
      ref={cardRef}
      onPointerDown={() => bringToFront(widget.id)}
      className="absolute flex flex-col bg-stone-800 border border-stone-700 rounded-lg shadow-2xl overflow-hidden select-none"
      style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height, zIndex: widget.zIndex || 1 }}
    >
      <div 
        className={`flex justify-between items-center bg-stone-950 px-3 py-2 border-b border-stone-700 ${widget.isLocked ? 'cursor-default' : 'cursor-move'} ${isMobileMode ? 'py-3' : 'py-2'}`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="flex items-center gap-2 w-full overflow-hidden hover:bg-stone-900 rounded transition-colors" title="Clique para renomear">
          {!widget.isLocked && <GripHorizontal size={isMobileMode ? 18 : 14} className="text-stone-500 flex-shrink-0" />}
          <input 
            type="text" 
            value={widget.title}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
            className={`font-bold theme-text bg-transparent outline-none w-full px-1 truncate cursor-text ${isMobileMode ? 'text-base' : 'text-sm'}`}
          />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button onPointerDown={e => e.stopPropagation()} onClick={() => updateWidget(widget.id, { isLocked: !widget.isLocked })} className={`text-stone-500 hover:text-white p-1 transition-colors ${isMobileMode ? 'p-2' : ''}`} title={widget.isLocked ? "Destrancar" : "Trancar"}>
            {widget.isLocked ? <Lock size={isMobileMode ? 18 : 14}/> : <Unlock size={isMobileMode ? 18 : 14}/>}
          </button>
          <button onPointerDown={e => e.stopPropagation()} onClick={() => removeWidget(widget.id)} className={`text-red-500 hover:text-red-400 p-1 transition-colors ${isMobileMode ? 'p-2' : ''}`} title="Fechar Janela">
            <X size={isMobileMode ? 18 : 14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-2 relative bg-stone-900">
        {children}
      </div>

      {!widget.isLocked && (
        <div 
          className="absolute bottom-0 right-0 p-1 cursor-nwse-resize text-stone-500 hover:theme-text transition-colors z-50 bg-stone-900/50 rounded-tl"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        >
          <Scaling size={isMobileMode ? 24 : 16} />
        </div>
      )}
    </div>
  );
};

const LinksWidget = ({ widget, updateWidget }) => {
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const links = widget.links || [];

  const addLink = () => {
    if (!urlInput.trim()) return;
    const newLink = { 
      id: Date.now(), 
      title: titleInput.trim() || 'Novo Link', 
      url: urlInput.startsWith('http') ? urlInput : `https://${urlInput}` 
    };
    updateWidget(widget.id, { links: [...links, newLink] });
    setUrlInput('');
    setTitleInput('');
  };

  const removeLink = (id) => updateWidget(widget.id, { links: links.filter(l => l.id !== id) });
  
  const moveLink = (index, dir) => {
    const newLinks = [...links];
    if (dir === 'up' && index > 0) {
      [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
    } else if (dir === 'down' && index < newLinks.length - 1) {
      [newLinks[index + 1], newLinks[index]] = [newLinks[index], newLinks[index + 1]];
    }
    updateWidget(widget.id, { links: newLinks });
  };

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex flex-col gap-1 bg-stone-900 p-2 rounded border border-stone-700">
        <input 
          type="text" value={titleInput} onChange={e => setTitleInput(e.target.value)} 
          placeholder="Nome do Link..." 
          className="bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs outline-none w-full text-stone-200"
        />
        <div className="flex gap-1">
          <input 
            type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)} 
            placeholder="URL..." 
            className="flex-1 bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs outline-none text-stone-200"
            onKeyDown={e => e.key === 'Enter' && addLink()}
          />
          <button onClick={addLink} className="bg-stone-700 hover:bg-stone-600 px-3 rounded text-xs font-bold"><Plus size={14}/></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar border border-stone-700 rounded p-1 flex flex-col gap-1 bg-stone-950">
        {links.map((link, index) => (
          <div key={link.id} className="flex items-center justify-between p-2 rounded bg-stone-900 border border-stone-800 hover:border-stone-600 group">
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              <a href={link.url} target="_blank" rel="noreferrer" className="text-stone-400 hover:theme-text"><ExternalLink size={14} /></a>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-stone-200 truncate">{link.title}</span>
                <span className="text-[9px] text-stone-500 truncate">{link.url}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => moveLink(index, 'up')} className="p-0.5 text-stone-500 hover:text-white"><ArrowUp size={12}/></button>
              <button onClick={() => moveLink(index, 'down')} className="p-0.5 text-stone-500 hover:text-white"><ArrowDown size={12}/></button>
              <button onClick={() => removeLink(link.id)} className="p-0.5 text-stone-500 hover:text-red-500 ml-1"><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InitiativeWidget = ({ widget, updateWidget, isMobileMode }) => {
  const addCombatant = () => {
    updateWidget(widget.id, { combatants: [...(widget.combatants || []), { id: Date.now(), name: 'Personagem', init: '', hp: '' }] });
  };
  const updateCombatant = (id, field, value) => {
    updateWidget(widget.id, { combatants: (widget.combatants || []).map(c => c.id === id ? { ...c, [field]: value } : c) });
  };
  const sortInitiative = () => {
    const sorted = [...(widget.combatants || [])].sort((a, b) => (Number(b.init) || 0) - (Number(a.init) || 0));
    updateWidget(widget.id, { combatants: sorted });
  };

  const combatants = widget.combatants || [];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex gap-2 mb-2">
        <button onClick={addCombatant} className="bg-stone-700 hover:bg-stone-600 rounded px-2 py-1 text-xs font-bold flex items-center gap-1"><PlusSquare size={14}/> Add</button>
        <button onClick={sortInitiative} className="bg-stone-700 hover:bg-stone-600 rounded px-2 py-1 text-xs font-bold flex items-center gap-1"><RefreshCw size={14}/> Sort</button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-stone-900 border border-stone-700 rounded p-1">
        {combatants.map((c, i) => (
          <div key={c.id} className={`flex items-center gap-1 p-1 mb-1 rounded border transition-colors ${widget.activeTurn === i ? 'border-[var(--theme-main)] bg-stone-800' : 'border-stone-700 bg-stone-800/50'}`}>
            {widget.activeTurn === i && <ChevronRight size={14} className="theme-text flex-shrink-0" />}
            <input type="text" value={c.name} onChange={e => updateCombatant(c.id, 'name', e.target.value)} className="flex-1 bg-transparent outline-none font-bold text-sm w-20" placeholder="Nome" />
            <input type="number" value={c.init} onChange={e => updateCombatant(c.id, 'init', e.target.value)} className="w-10 bg-stone-950 border border-stone-700 rounded text-center text-sm outline-none" placeholder="Init" title="Iniciativa"/>
            <input type="text" value={c.hp} onChange={e => updateCombatant(c.id, 'hp', e.target.value)} className="w-10 bg-stone-950 border border-stone-700 rounded text-center text-sm outline-none text-red-400" placeholder="HP" title="Vida"/>
            <button onClick={() => updateWidget(widget.id, { combatants: combatants.filter(cb => cb.id !== c.id) })} className="text-stone-500 hover:text-red-400 p-1"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
      {combatants.length > 0 && (
        <div className="flex justify-between items-center mt-2 bg-stone-950 p-1 rounded border border-stone-800">
          <button onClick={() => updateWidget(widget.id, { activeTurn: Math.max(0, (widget.activeTurn || 0) - 1) })} className="p-1 hover:text-white text-stone-400"><ChevronLeft size={16}/></button>
          <span className="text-xs font-bold theme-text truncate">Turno: {combatants[widget.activeTurn || 0]?.name}</span>
          <button onClick={() => updateWidget(widget.id, { activeTurn: ((widget.activeTurn || 0) + 1) % combatants.length })} className="p-1 hover:text-white text-stone-400"><ChevronRight size={16}/></button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [topZ, setTopZ] = useState(10);
  const [widgets, setWidgets] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [appSettings, setAppSettings] = useState({ 
    theme: 'amber', 
    bgType: 'none', 
    bgValue: '#1c1917', 
    customBgColor: '#ffffff',
    opacity: 30, 
    fontSize: 16 
  });
  
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateImage, setTemplateImage] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dmscreen_layout');
      if (saved) setWidgets(JSON.parse(saved));
      const savedTemplates = localStorage.getItem('dmscreen_templates');
      if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
      const savedSettings = localStorage.getItem('dmscreen_settings');
      if (savedSettings) setAppSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.warn("Erro ao carregar dados locais. Iniciando em branco.");
    }
    const checkMobile = () => setIsMobileMode(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateWidget = (id, updates) => setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  const bringToFront = (id) => { const newZ = topZ + 1; setTopZ(newZ); updateWidget(id, { zIndex: newZ }); };
  const removeWidget = (id) => setWidgets(widgets.filter(w => w.id !== id));

  const addWidget = (type) => {
    const offset = (widgets.length % 5) * 40;
    const newWidget = { 
      id: Date.now(), type, title: type.charAt(0).toUpperCase() + type.slice(1),
      x: 50 + offset, y: 50 + offset, zIndex: topZ + 1, width: 350, height: 300, isLocked: false
    };
    
    if (type === 'note') {
      newWidget.title = 'Anotações';
      newWidget.pages = [{ id: Date.now() + 1, title: 'Nova Página', content: '' }];
      newWidget.activePageId = newWidget.pages[0].id;
    } else if (type === 'dice') {
      newWidget.title = 'Rolador de Dados';
      newWidget.result = '---';
      newWidget.history = [];
      newWidget.qty = 1;
      newWidget.mod = 0;
    } else if (type === 'initiative') {
      newWidget.title = 'Iniciativa';
      newWidget.combatants = [];
      newWidget.activeTurn = 0;
    } else if (type === 'links') {
      newWidget.title = 'Central de Links';
      newWidget.links = [];
    } else if (type === 'image') {
      newWidget.title = 'Imagem';
    } else if (type === 'table') {
      newWidget.title = 'Tabela';
      newWidget.rows = [['', ''], ['', '']];
    }
    
    setWidgets([...widgets, newWidget]);
    setTopZ(topZ + 1);
  };

  const saveTemplate = (existingId = null) => {
    if (!existingId && !templateName.trim()) return alert('Digite um nome para o modelo.');
    
    try {
      let updatedTemplates = [...templates];
      if (existingId) {
        const existing = updatedTemplates.find(t => t.id === existingId);
        existing.widgets = widgets;
        existing.topZ = topZ;
        existing.date = new Date().toLocaleDateString();
      } else {
        updatedTemplates.push({
          id: Date.now(), name: templateName, image: templateImage, widgets, topZ, date: new Date().toLocaleDateString()
        });
      }
      localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
      setTemplateName(''); setTemplateImage(null);
      alert('Salvo com sucesso!');
    } catch (e) {
      alert('Erro ao salvar. Verifique se os mapas/imagens não ultrapassam o limite do navegador.');
    }
  };

  const loadTemplate = (id) => {
    const template = templates.find(t => t.id === id);
    if (template) { setWidgets(template.widgets); setTopZ(template.topZ); setShowTemplateModal(false); }
  };

  const deleteTemplate = (id) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  const exportAllTemplates = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates));
    const a = document.createElement('a');
    a.href = dataStr; a.download = `dmscreen_layouts.json`; a.click();
  };

  const importTemplates = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const merged = [...templates, ...imported];
          localStorage.setItem('dmscreen_templates', JSON.stringify(merged));
          setTemplates(merged);
          alert('Importado com sucesso!');
        }
      } catch (err) { alert('Arquivo inválido.'); }
    };
    reader.readAsText(file);
  };

  const renderNoteWidget = (widget) => {
    const activePage = (widget.pages || []).find(p => p.id === widget.activePageId) || (widget.pages && widget.pages[0]);
    if (!activePage) return <div className="text-xs text-stone-500">Erro na anotação. Recrie o widget.</div>;

    const addPage = () => {
      const newPage = { id: Date.now(), title: `Pág ${(widget.pages||[]).length + 1}`, content: '' };
      updateWidget(widget.id, { pages: [...(widget.pages||[]), newPage], activePageId: newPage.id });
    };

    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between bg-stone-900 border-b border-stone-700 p-1">
          <button onClick={() => updateWidget(widget.id, { showTools: !widget.showTools })} className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs font-bold transition-colors">
            {widget.showTools ? 'Ocultar Edição' : 'Formatar Texto'}
          </button>
        </div>
        
        {widget.showTools && (
          <div className="flex flex-wrap gap-1 p-1.5 bg-stone-800 border-b border-stone-700 items-center text-xs">
            <button onClick={() => document.execCommand('bold', false, null)} className="p-1.5 hover:bg-stone-700 rounded text-stone-300" title="Negrito"><Bold size={14} /></button>
            <button onClick={() => document.execCommand('italic', false, null)} className="p-1.5 hover:bg-stone-700 rounded text-stone-300" title="Itálico"><Italic size={14} /></button>
            <button onClick={() => document.execCommand('formatBlock', false, 'H2')} className="p-1.5 hover:bg-stone-700 rounded text-stone-300" title="Título"><Heading size={14} /></button>
            <input type="color" onChange={(e) => document.execCommand('foreColor', false, e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent" title="Cor do Texto" />
            <select onChange={(e) => document.execCommand('fontSize', false, e.target.value)} className="bg-stone-900 border border-stone-600 rounded text-stone-200 outline-none p-1" title="Tamanho do Texto">
              <option value="3">Normal</option>
              <option value="1">Muito Pequeno</option>
              <option value="5">Grande</option>
              <option value="7">Enorme</option>
            </select>
          </div>
        )}

        <div className="flex overflow-x-auto bg-stone-900 border-b border-stone-700 p-1 gap-1 custom-scrollbar">
          {widget.pages.map(page => (
            <div key={page.id} onClick={() => updateWidget(widget.id, { activePageId: page.id })} className={`flex items-center gap-1 px-2 py-1 text-xs rounded cursor-pointer group whitespace-nowrap ${widget.activePageId === page.id ? 'bg-stone-700 theme-text font-bold' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}>
              <input type="text" value={page.title} onChange={e => updateWidget(widget.id, { pages: widget.pages.map(p => p.id === page.id ? { ...p, title: e.target.value } : p) })} className="bg-transparent outline-none w-20 text-center" onClick={e => e.stopPropagation()} />
              {widget.pages.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); const newPages = widget.pages.filter(p => p.id !== page.id); updateWidget(widget.id, { pages: newPages, activePageId: widget.activePageId === page.id ? newPages[0].id : widget.activePageId }); }} className="opacity-0 group-hover:opacity-100 hover:text-red-400 ml-1">
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addPage} className="px-2 py-1 text-stone-400 hover:theme-text"><FilePlus size={14} /></button>
        </div>

        <div 
          className="flex-1 w-full bg-stone-950 p-3 rounded-b-lg text-sm text-stone-200 outline-none overflow-y-auto"
          contentEditable suppressContentEditableWarning
          onBlur={(e) => updateWidget(widget.id, { pages: widget.pages.map(p => p.id === activePage.id ? { ...p, content: e.currentTarget.innerHTML } : p) })}
          dangerouslySetInnerHTML={{ __html: activePage.content }}
        />
      </div>
    );
  };

  const renderDiceWidget = (widget) => {
    const roll = (sides) => {
      const q = parseInt(widget.qty) || 1;
      const m = parseInt(widget.mod) || 0;
      let sum = 0; let results = [];
      for(let i=0; i<q; i++) { const val = Math.floor(Math.random() * sides) + 1; sum += val; results.push(val); }
      const total = sum + m;
      const histStr = `${q}d${sides}${m !== 0 ? (m > 0 ? '+'+m : m) : ''} ➔ ${total} [${results.join(',')}]`;
      updateWidget(widget.id, { result: total, history: [histStr, ...(widget.history || [])].slice(0, 6) });
    };

    return (
      <div className="flex flex-col items-center h-full gap-2 relative">
        <div className="text-5xl font-black theme-text bg-stone-950 w-full text-center py-4 rounded border border-stone-700 flex-1 flex items-center justify-center shadow-inner">
          {widget.result}
        </div>
        <div className="flex gap-2 w-full justify-center bg-stone-800 p-2 rounded border border-stone-700">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-stone-400">QTD</span>
            <input type="number" value={widget.qty || 1} onChange={e => updateWidget(widget.id, { qty: e.target.value })} className="w-12 bg-stone-950 text-center rounded border border-stone-600 text-sm py-1 outline-none theme-text font-bold" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-stone-400">MOD</span>
            <input type="number" value={widget.mod || 0} onChange={e => updateWidget(widget.id, { mod: e.target.value })} className="w-12 bg-stone-950 text-center rounded border border-stone-600 text-sm py-1 outline-none theme-text font-bold" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-1 w-full">
          {[4, 6, 8, 10, 12, 20, 100].map(d => (
            <button key={d} onClick={() => roll(d)} className="bg-stone-700 hover:bg-stone-600 px-2 py-2 rounded font-bold border border-stone-600 flex-1 min-w-[35px] text-center text-xs">D{d}</button>
          ))}
        </div>
        <div className="w-full text-[10px] text-stone-500 bg-stone-950 p-1 rounded overflow-hidden max-h-16 overflow-y-auto custom-scrollbar">
          {(widget.history || []).map((h, i) => <div key={i} className="truncate">{h}</div>)}
        </div>
      </div>
    );
  };

  const renderTableWidget = (widget) => {
    const updateCell = (rIdx, cIdx, val) => {
      const newRows = [...widget.rows]; newRows[rIdx][cIdx] = val; updateWidget(widget.id, { rows: newRows });
    };
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center gap-2 bg-stone-900 border-b border-stone-700 p-1">
          <button onClick={() => updateWidget(widget.id, { isEditingStruct: !widget.isEditingStruct })} className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs font-bold transition-colors border border-stone-600 flex items-center gap-1">
            {widget.isEditingStruct ? <Unlock size={12}/> : <Lock size={12}/>} Estrutura
          </button>
        </div>
        
        {widget.isEditingStruct && (
          <div className="flex gap-2 p-1.5 bg-stone-800 border-b border-stone-700 items-center">
             <button onClick={() => updateWidget(widget.id, { rows: [...widget.rows, Array(widget.rows[0].length).fill('')] })} className="text-xs bg-stone-700 px-2 py-1 rounded flex items-center gap-1"><PlusSquare size={12}/> Linha</button>
             <button onClick={() => updateWidget(widget.id, { rows: widget.rows.map(r => [...r, '']) })} className="text-xs bg-stone-700 px-2 py-1 rounded flex items-center gap-1"><PlusSquare size={12}/> Coluna</button>
          </div>
        )}

        <div className="flex-1 overflow-auto custom-scrollbar bg-stone-950 p-1">
          <table className="w-full border-collapse border border-stone-700 min-w-max">
            <tbody>
              {widget.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="border border-stone-700 p-0 relative">
                      <input type="text" value={cell} onChange={(e) => updateCell(rIdx, cIdx, e.target.value)} className="w-full h-full p-2 bg-transparent outline-none text-sm text-stone-200 placeholder-stone-700 min-w-[80px]" placeholder="..." />
                    </td>
                  ))}
                  {widget.isEditingStruct && widget.rows.length > 1 && (
                    <td className="border border-stone-700 bg-stone-900 text-center w-6">
                      <button onClick={() => updateWidget(widget.id, { rows: widget.rows.filter((_, i) => i !== rIdx) })} className="text-stone-500 hover:text-red-400 block mx-auto"><Trash2 size={12}/></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden text-stone-100 font-sans w-full h-full m-0 p-0" style={{ '--theme-main': THEMES[appSettings.theme]?.main || '#d97706', backgroundColor: appSettings.bgType === 'custom_color' ? (appSettings.customBgColor || '#ffffff') : (THEMES[appSettings.theme]?.bg || '#1c1917') }}>
      
      {appSettings.bgType === 'image' && <div className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url(${appSettings.bgValue})`, opacity: appSettings.opacity / 100 }} />}
      {appSettings.bgType === 'video' && (
        <video autoPlay loop muted className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none" style={{ opacity: appSettings.opacity / 100 }}>
          <source src={appSettings.bgValue} type="video/mp4" />
        </video>
      )}

      <header className="flex flex-col md:flex-row justify-between items-center bg-stone-950/95 px-4 py-2.5 border-b border-stone-800 z-50 flex-shrink-0 shadow-lg w-full">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold theme-text flex items-center gap-2 select-none"><Layout size={18} /> DM SCREEN</h1>
          <a href="https://pjlite.vercel.app/" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1 text-[10px] bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/30 px-2 py-1 rounded transition-colors" title="Criador de Fichas Dragonbane">
            PJ Lite <ExternalLink size={10} />
          </a>
        </div>
        
        <div className="flex flex-wrap justify-center gap-1.5 flex-1 my-1 md:my-0">
          <button onClick={() => addWidget('note')} className="bg-stone-900 hover:bg-stone-800 px-2.5 py-1 rounded flex items-center gap-1 border border-stone-800 text-xs font-bold transition-colors"><FileText size={13} /> Nota</button>
          <button onClick={() => addWidget('dice')} className="bg-stone-900 hover:bg-stone-800 px-2.5 py-1 rounded flex items-center gap-1 border border-stone-800 text-xs font-bold transition-colors"><Dices size={13} /> Dados</button>
          <button onClick={() => addWidget('initiative')} className="bg-stone-900 hover:bg-stone-800 px-2.5 py-1 rounded flex items-center gap-1 border border-stone-800 text-xs font-bold transition-colors"><Swords size={13} /> Init</button>
          <button onClick={() => addWidget('links')} className="bg-stone-900 hover:bg-stone-800 px-2.5 py-1 rounded flex items-center gap-1 border border-stone-800 text-xs font-bold transition-colors"><Link2 size={13} /> Links</button>
          <button onClick={() => addWidget('image')} className="bg-stone-900 hover:bg-stone-800 px-2.5 py-1 rounded flex items-center gap-1 border border-stone-800 text-xs font-bold transition-colors"><ImageIcon size={13} /> Imagem</button>
          <button onClick={() => addWidget('table')} className="bg-stone-900 hover:bg-stone-800 px-2.5 py-1 rounded flex items-center gap-1 border border-stone-800 text-xs font-bold transition-colors"><TableIcon size={13} /> Tabela</button>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1 bg-stone-900 rounded border border-stone-800 p-0.5">
            <button onClick={() => setAppSettings({...appSettings, fontSize: Math.max(12, (appSettings.fontSize || 16) - 1)})} className="p-1 text-stone-400 hover:text-white transition-colors"><Minus size={12} /></button>
            <span className="text-xs font-bold text-stone-300 px-1">Aa</span>
            <button onClick={() => setAppSettings({...appSettings, fontSize: Math.min(22, (appSettings.fontSize || 16) + 1)})} className="p-1 text-stone-400 hover:text-white transition-colors"><Plus size={12} /></button>
          </div>
          <button onClick={() => setIsMobileMode(!isMobileMode)} className={`p-1.5 rounded border transition-colors ${isMobileMode ? 'bg-[var(--theme-main)] border-[var(--theme-main)] text-stone-900' : 'bg-stone-900 border-stone-800 text-stone-400'}`}>
            <Smartphone size={15} />
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="p-1.5 bg-stone-900 hover:bg-stone-800 rounded border border-stone-800 text-stone-400 transition-colors">
            <Settings size={15} />
          </button>
          <button onClick={() => setShowTemplateModal(true)} className="bg-stone-900 hover:bg-stone-800 text-stone-200 transition-colors px-3 py-1 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold">
            <FolderOpen size={13} className="theme-text" /> <span>Layouts</span>
          </button>
        </div>
      </header>

      <main className="relative flex-1 w-full h-full overflow-hidden z-10">
        {widgets.map((widget) => (
          <WidgetCard key={widget.id} widget={widget} updateWidget={updateWidget} removeWidget={removeWidget} bringToFront={bringToFront} isMobileMode={isMobileMode}>
            {widget.type === 'note' && renderNoteWidget(widget)}
            {widget.type === 'dice' && renderDiceWidget(widget)}
            {widget.type === 'initiative' && <InitiativeWidget widget={widget} updateWidget={updateWidget} isMobileMode={isMobileMode} />}
            {widget.type === 'links' && <LinksWidget widget={widget} updateWidget={updateWidget} />}
            {widget.type === 'image' && (
              <div className="flex flex-col h-full w-full gap-1">
                <div className="flex items-center justify-between bg-stone-900 p-1 rounded border border-stone-700">
                  <button onClick={() => updateWidget(widget.id, { showUpload: !widget.showUpload })} className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px] font-bold">
                    {widget.showUpload ? 'Ocultar Opções' : 'Mudar Imagem'}
                  </button>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 font-bold">
                    Zoom:
                    <button onClick={() => updateWidget(widget.id, { zoom: Math.max(50, (widget.zoom || 100) - 15) })} className="bg-stone-800 px-1 rounded">-</button>
                    <span>{widget.zoom || 100}%</span>
                    <button onClick={() => updateWidget(widget.id, { zoom: Math.min(300, (widget.zoom || 100) + 15) })} className="bg-stone-800 px-1 rounded">+</button>
                  </div>
                </div>

                {widget.showUpload && (
                  <div className="flex flex-col gap-1.5 bg-stone-900 p-2 rounded border border-stone-700 text-xs">
                    <div className="flex gap-1">
                      <input type="text" placeholder="Cole URL da imagem..." value={widget.imageUrlInput || ''} onChange={e => updateWidget(widget.id, { imageUrlInput: e.target.value })} className="flex-1 bg-stone-950 border border-stone-700 rounded px-2 py-1 outline-none text-stone-200" />
                      <button onClick={() => updateWidget(widget.id, { imageData: widget.imageUrlInput, showUpload: false })} className="bg-stone-700 hover:bg-stone-600 px-2 py-1 rounded font-bold">OK</button>
                    </div>
                    <label className="cursor-pointer bg-stone-800 hover:bg-stone-700 text-stone-300 py-1.5 px-2 rounded text-center font-bold border border-stone-700 block mt-1">
                      Fazer Upload
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => updateWidget(widget.id, { imageData: reader.result, showUpload: false });
                          reader.readAsDataURL(file);
                        }
                      }} className="hidden" />
                    </label>
                  </div>
                )}

                <div className="flex-1 overflow-auto rounded bg-stone-950 border border-stone-700 flex items-center justify-center p-1 relative">
                  {widget.imageData ? (
                    <img src={widget.imageData} alt="Conteúdo" className="transition-all duration-200 object-contain" style={{ width: `${widget.zoom || 100}%`, height: `${widget.zoom || 100}%` }} />
                  ) : (
                    <div className="text-xs text-stone-500 italic text-center">Imagem não carregada.</div>
                  )}
                </div>
              </div>
            )}
            {widget.type === 'table' && renderTableWidget(widget)}
          </WidgetCard>
        ))}
      </main>

      <footer className="flex items-center gap-2 bg-stone-950 border-t border-stone-800 px-3 py-1 overflow-x-auto z-50 flex-shrink-0 w-full">
        <div className="text-[10px] font-bold text-stone-500 uppercase flex-shrink-0">Janelas ({widgets.length}):</div>
        {widgets.map(w => (
          <button key={`task-${w.id}`} onClick={() => bringToFront(w.id)} className="px-2.5 py-0.5 bg-stone-900 hover:bg-stone-800 rounded text-xs font-bold border border-stone-800 truncate max-w-[130px] transition-colors theme-text">
            {w.title}
          </button>
        ))}
      </footer>

      {showSettingsModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-lg shadow-2xl w-full max-w-sm p-4 flex flex-col gap-3 max-h-[85vh]">
            <div className="flex justify-between items-center border-b border-stone-800 pb-2">
              <h2 className="text-sm font-bold theme-text flex items-center gap-1.5"><Settings size={16}/> Configurações e Sobre</h2>
              <button onClick={() => { setShowSettingsModal(false); localStorage.setItem('dmscreen_settings', JSON.stringify(appSettings)); }} className="text-stone-400 hover:text-white"><X size={16}/></button>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
              <div className="flex flex-col gap-1.5" title="Define a cor principal">
                <label className="text-[11px] font-bold text-stone-400 uppercase">Tema de Cores</label>
                <div className="flex gap-2">
                  {Object.keys(THEMES).map(t => (
                    <button key={t} onClick={() => setAppSettings({...appSettings, theme: t})} className={`w-6 h-6 rounded-full border-2 ${appSettings.theme === t ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: THEMES[t].main }} title={t === 'pjlite' ? 'Tema PJ Lite' : `Tema ${t}`} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5" title="Personalize o visual do fundo">
                <label className="text-[11px] font-bold text-stone-400 uppercase flex items-center justify-between">
                  Plano de Fundo da Mesa
                  <span className="text-[10px] text-stone-500">Opacidade: {appSettings.opacity}%</span>
                </label>
                <input type="range" min="10" max="100" value={appSettings.opacity} onChange={e => setAppSettings({...appSettings, opacity: e.target.value})} className="w-full" />
                <select value={appSettings.bgType} onChange={e => setAppSettings({...appSettings, bgType: e.target.value})} className="bg-stone-950 border border-stone-800 rounded p-1.5 text-xs text-stone-200 outline-none">
                  <option value="none">Cor do Tema (Padrão Escuro)</option>
                  <option value="custom_color">Cor Personalizada (Branco, Claro, etc)</option>
                  <option value="image">Imagem / GIF (URL)</option>
                  <option value="video">Vídeo MP4 (URL)</option>
                </select>
                {appSettings.bgType === 'custom_color' && (
                  <div className="flex items-center gap-2 mt-1 bg-stone-950 border border-stone-800 rounded p-1.5">
                    <input type="color" value={appSettings.customBgColor || '#ffffff'} onChange={e => setAppSettings({...appSettings, customBgColor: e.target.value})} className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer" />
                    <span className="text-[11px] text-stone-400">Escolha a cor</span>
                  </div>
                )}
                {(appSettings.bgType === 'image' || appSettings.bgType === 'video') && (
                  <input type="text" value={appSettings.bgValue} onChange={e => setAppSettings({...appSettings, bgValue: e.target.value})} placeholder="URL do arquivo..." className="bg-stone-950 border border-stone-800 rounded p-1.5 text-xs outline-none w-full mt-1" />
                )}
              </div>

              <div className="flex flex-col gap-1 bg-stone-950 p-2.5 rounded border border-stone-800 text-xs">
                <div className="font-bold theme-text flex items-center justify-between">
                  <span>DM lite Alpha 0.2.3v</span>
                  <a href="https://pjlite.vercel.app/" target="_blank" rel="noreferrer" className="text-[10px] text-amber-400 hover:underline">PJ Lite</a>
                </div>
                <div className="text-[11px] font-bold text-stone-300 mt-2">Recursos Atuais:</div>
                <ul className="list-disc pl-4 text-[10px] text-stone-400 space-y-0.5">
                  <li><strong className="text-stone-300">NOVO:</strong> Integração visual PJ Lite.</li>
                  <li>Escudos públicos da comunidade no Drive.</li>
                  <li>Bloco de anotações em abas e formatador.</li>
                  <li>Rolador de dados com histórico.</li>
                  <li>Central de links e Gerenciador de iniciativa.</li>
                  <li>Visualizador de imagens e Tabelas editáveis.</li>
                  <li>Modo Mobile, Zoom de Fonte e Fundo Personalizado.</li>
                  <li>Correção de crash de renderização.</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-stone-800 text-[10px] text-stone-400">
                  <span className="font-bold text-stone-300">Dev:</span> Nicck Queijo<br/>
                  <span className="font-bold text-stone-300">Telegram:</span> @ralseibaiano<br/>
                  <span className="font-bold text-stone-300">Discord:</span> inabakaoru
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-lg shadow-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[85vh]">
            <div className="flex justify-between items-center p-3 border-b border-stone-800 bg-stone-950">
              <h2 className="text-sm font-bold theme-text flex items-center gap-1.5"><Save size={16} /> Gerenciar Layouts</h2>
              <button onClick={() => setShowTemplateModal(false)} className="text-stone-400 hover:text-red-400"><X size={18} /></button>
            </div>
            
            <div className="p-3 flex flex-col gap-3 overflow-y-auto">
              <div className="flex flex-col gap-2 bg-stone-950 p-2.5 rounded border border-stone-800">
                <label className="text-[11px] font-bold text-stone-400 uppercase">Salvar Layout Atual</label>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer bg-stone-900 p-2 rounded hover:bg-stone-800 transition border border-stone-800">
                    {templateImage ? <img src={templateImage} className="w-6 h-6 rounded object-cover" alt="" /> : <ImagePlus size={18} className="text-stone-500"/>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const f = e.target.files[0]; if(f) { const r = new FileReader(); r.onloadend = () => setTemplateImage(r.result); r.readAsDataURL(f); }
                    }}/>
                  </label>
                  <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Nome do Layout" className="flex-1 bg-stone-900 border border-stone-800 rounded px-2 py-1.5 text-xs outline-none text-stone-200" />
                  <button onClick={() => saveTemplate(null)} className="bg-[var(--theme-main)] text-stone-900 font-bold px-3 py-1.5 rounded text-xs">Salvar</button>
                </div>
              </div>

              <a href="https://drive.google.com/drive/folders/1aZe-IfaPEwp4JvIxBATxNIfZi630gAhL?usp=sharing" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded p-2 text-xs text-stone-300">
                <FolderOpen size={14} className="text-amber-500" /> 
                <span className="font-bold">Baixar Escudos (Comunidade)</span> 
              </a>

              <div className="flex justify-between items-center">
                <div className="relative w-1/2">
                  <Search size={12} className="absolute left-2 top-2 text-stone-500" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar..." className="w-full bg-stone-950 border border-stone-800 rounded pl-6 pr-2 py-1 text-[11px] outline-none text-stone-200" />
                </div>
                <div className="flex gap-2">
                   <label className="cursor-pointer text-[10px] bg-stone-900 hover:bg-stone-800 px-2 py-1 rounded text-stone-300 font-bold flex items-center gap-1 border border-stone-800">
                     <Upload size={10}/> Importar
                     <input type="file" accept=".json" onChange={importTemplates} className="hidden" />
                   </label>
                   <button onClick={exportAllTemplates} className="text-[10px] bg-stone-900 hover:bg-stone-800 px-2 py-1 rounded text-stone-300 font-bold flex items-center gap-1 border border-stone-800">
                     <Download size={10}/> Exportar
                   </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                {templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map(t => (
                  <div key={t.id} className="flex items-center justify-between bg-stone-950 border border-stone-800 p-2 rounded">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {t.image ? <img src={t.image} className="w-8 h-8 rounded object-cover flex-shrink-0" alt="" /> : <div className="w-8 h-8 rounded bg-stone-900 flex items-center justify-center flex-shrink-0"><Layout size={14} className="text-stone-600"/></div>}
                      <div className="flex flex-col truncate">
                        <span className="font-bold text-xs text-stone-200 flex items-center gap-1 truncate">{t.name}</span>
                        <span className="text-[9px] text-stone-500">{t.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => saveTemplate(t.id)} className="p-1.5 text-stone-400 hover:text-blue-400 rounded"><RefreshCw size={12} /></button>
                      <button onClick={() => loadTemplate(t.id)} className="px-2.5 py-1 bg-stone-800 hover:bg-[var(--theme-main)] hover:text-stone-900 text-stone-200 rounded text-[11px] font-bold">Carregar</button>
                      <button onClick={() => deleteTemplate(t.id)} className="p-1.5 text-stone-400 hover:text-red-400 rounded"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        html { font-size: ${appSettings.fontSize || 16}px !important; }
        .theme-text { color: var(--theme-main); }
        .custom-scrollbar::-webkit-scrollbar { height: 5px; width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0c0a09; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #292524; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--theme-main); }
      `}} />
    </div>
  );
};

export default App;
