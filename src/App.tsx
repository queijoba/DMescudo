import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Dices, Layout, Image as ImageIcon, 
  Table as TableIcon, FileText, Bold, Italic, 
  Heading, List, FilePlus, PlusSquare, X,
  GripHorizontal, Scaling, Save, FolderOpen, 
  Lock, Search, ImagePlus, RefreshCw, Download, Upload,
  Unlock, Settings, Smartphone, MonitorPlay,
  Swords, ChevronLeft, ChevronRight,
  Link2, ArrowUp, ArrowDown, ExternalLink, Minus, Type, HelpCircle
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
    // Previne comportamento padrão mas permite clique em inputs/textos
    if (e.target.tagName.toLowerCase() === 'input') return;
    
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
      className="absolute flex flex-col bg-stone-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_8px_32px_rgb(0,0,0,0.5)] overflow-hidden transition-shadow hover:shadow-[0_8px_32px_rgb(0,0,0,0.7)] animate-fade-in"
      style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height, zIndex: widget.zIndex || 1 }}
    >
      <div 
        className={`flex justify-between items-center bg-black/40 px-3 py-2 border-b border-white/5 ${widget.isLocked ? 'cursor-default' : 'cursor-move'} ${isMobileMode ? 'py-3' : 'py-2'}`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="flex items-center gap-2 w-full overflow-hidden hover:bg-white/5 rounded-md transition-colors p-1 -ml-1" title="Clique para renomear">
          {!widget.isLocked && <GripHorizontal size={isMobileMode ? 18 : 14} className="text-stone-500 flex-shrink-0" />}
          <input 
            type="text" 
            value={widget.title}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
            className={`font-bold theme-text bg-transparent outline-none w-full px-1 truncate cursor-text ${isMobileMode ? 'text-base' : 'text-sm'} focus:ring-1 ring-[var(--theme-main)] rounded`}
          />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button onPointerDown={e => e.stopPropagation()} onClick={() => updateWidget(widget.id, { isLocked: !widget.isLocked })} className={`text-stone-400 hover:text-white p-1.5 rounded-md transition-colors hover:bg-white/10 ${isMobileMode ? 'p-2' : ''}`} title={widget.isLocked ? "Destrancar" : "Trancar"}>
            {widget.isLocked ? <Lock size={isMobileMode ? 18 : 14}/> : <Unlock size={isMobileMode ? 18 : 14}/>}
          </button>
          <button onPointerDown={e => e.stopPropagation()} onClick={() => removeWidget(widget.id)} className={`text-red-400 hover:text-red-300 p-1.5 rounded-md transition-colors hover:bg-red-400/10 ${isMobileMode ? 'p-2' : ''}`} title="Fechar Janela">
            <X size={isMobileMode ? 18 : 14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-2 relative bg-transparent">
        {children}
      </div>

      {!widget.isLocked && (
        <div 
          className="absolute bottom-0 right-0 p-1.5 cursor-nwse-resize text-stone-500 hover:theme-text transition-colors z-50 bg-black/20 rounded-tl-lg backdrop-blur-sm"
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
    setUrlInput(''); setTitleInput('');
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
      <div className="flex flex-col gap-1.5 bg-black/20 p-2.5 rounded-lg border border-white/5">
        <input 
          type="text" value={titleInput} onChange={e => setTitleInput(e.target.value)} 
          placeholder="Nome do Link..." 
          className="bg-black/40 border border-white/10 rounded-md px-2.5 py-1.5 text-xs outline-none w-full text-stone-200 focus:border-[var(--theme-main)] transition-colors"
        />
        <div className="flex gap-1.5">
          <input 
            type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)} 
            placeholder="URL (Site, PDF, YouTube)..." 
            className="flex-1 bg-black/40 border border-white/10 rounded-md px-2.5 py-1.5 text-xs outline-none text-stone-200 focus:border-[var(--theme-main)] transition-colors"
            onKeyDown={e => e.key === 'Enter' && addLink()}
          />
          <button onClick={addLink} className="bg-white/10 hover:bg-white/20 px-3.5 rounded-md text-xs font-bold transition-colors"><Plus size={14}/></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar border border-white/5 rounded-lg p-1.5 flex flex-col gap-1.5 bg-black/10">
        {links.map((link, index) => (
          <div key={link.id} className="flex items-center justify-between p-2.5 rounded-md bg-white/5 border border-white/5 hover:border-white/20 group transition-all">
            <div className="flex items-center gap-2.5 flex-1 overflow-hidden">
              <a href={link.url} target="_blank" rel="noreferrer" className="text-stone-400 hover:theme-text transition-colors"><ExternalLink size={14} /></a>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-stone-200 truncate">{link.title}</span>
                <span className="text-[10px] text-stone-500 truncate">{link.url}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => moveLink(index, 'up')} className="p-1 text-stone-500 hover:text-white rounded hover:bg-white/10 transition-colors"><ArrowUp size={12}/></button>
              <button onClick={() => moveLink(index, 'down')} className="p-1 text-stone-500 hover:text-white rounded hover:bg-white/10 transition-colors"><ArrowDown size={12}/></button>
              <button onClick={() => removeLink(link.id)} className="p-1 text-stone-500 hover:text-red-400 ml-1 rounded hover:bg-red-400/10 transition-colors"><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InitiativeWidget = ({ widget, updateWidget, isMobileMode }) => {
  const addCombatant = () => updateWidget(widget.id, { combatants: [...(widget.combatants || []), { id: Date.now(), name: 'Personagem', init: '', hp: '' }] });
  const updateCombatant = (id, field, value) => updateWidget(widget.id, { combatants: (widget.combatants || []).map(c => c.id === id ? { ...c, [field]: value } : c) });
  const sortInitiative = () => {
    const sorted = [...(widget.combatants || [])].sort((a, b) => (Number(b.init) || 0) - (Number(a.init) || 0));
    updateWidget(widget.id, { combatants: sorted });
  };
  const combatants = widget.combatants || [];

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex gap-2 mb-1">
        <button onClick={addCombatant} className="bg-white/10 hover:bg-white/20 rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors"><PlusSquare size={14}/> Add</button>
        <button onClick={sortInitiative} className="bg-white/10 hover:bg-white/20 rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors"><RefreshCw size={14}/> Sort</button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 border border-white/5 rounded-lg p-1.5">
        {combatants.map((c, i) => (
          <div key={c.id} className={`flex items-center gap-1.5 p-1.5 mb-1.5 rounded-md transition-all ${widget.activeTurn === i ? 'border border-[var(--theme-main)] bg-[var(--theme-main)]/10 shadow-[inset_0_0_10px_var(--theme-main)]' : 'border border-white/5 bg-white/5 hover:bg-white/10'}`}>
            {widget.activeTurn === i && <ChevronRight size={14} className="theme-text flex-shrink-0" />}
            <input type="text" value={c.name} onChange={e => updateCombatant(c.id, 'name', e.target.value)} className="flex-1 bg-transparent outline-none font-bold text-sm w-20 px-1 focus:ring-1 ring-white/20 rounded" placeholder="Nome" />
            <input type="number" value={c.init} onChange={e => updateCombatant(c.id, 'init', e.target.value)} className="w-12 bg-black/40 border border-white/10 rounded-md text-center text-sm outline-none focus:border-[var(--theme-main)] py-0.5" placeholder="Init" title="Iniciativa"/>
            <input type="text" value={c.hp} onChange={e => updateCombatant(c.id, 'hp', e.target.value)} className="w-12 bg-black/40 border border-white/10 rounded-md text-center text-sm outline-none text-red-400 focus:border-red-400 py-0.5" placeholder="HP" title="Vida"/>
            <button onClick={() => updateWidget(widget.id, { combatants: combatants.filter(cb => cb.id !== c.id) })} className="text-stone-500 hover:text-red-400 p-1.5 rounded hover:bg-red-400/10 transition-colors"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
      {combatants.length > 0 && (
        <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg border border-white/10">
          <button onClick={() => updateWidget(widget.id, { activeTurn: Math.max(0, (widget.activeTurn || 0) - 1) })} className="p-1.5 hover:text-white text-stone-400 rounded hover:bg-white/10 transition-colors"><ChevronLeft size={16}/></button>
          <span className="text-xs font-bold theme-text truncate px-2 text-center" style={{ textShadow: '0 0 10px var(--theme-main)' }}>Turno: {combatants[widget.activeTurn || 0]?.name}</span>
          <button onClick={() => updateWidget(widget.id, { activeTurn: ((widget.activeTurn || 0) + 1) % combatants.length })} className="p-1.5 hover:text-white text-stone-400 rounded hover:bg-white/10 transition-colors"><ChevronRight size={16}/></button>
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
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  const [appSettings, setAppSettings] = useState({ 
    theme: 'amber', bgType: 'none', bgValue: '#1c1917', 
    customBgColor: '#ffffff', opacity: 30, fontSize: 16 
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
    const isMobile = window.innerWidth < 768;
    const startX = isMobile ? 10 : 50 + offset;
    const startW = isMobile ? window.innerWidth - 20 : 350;
    
    const newWidget = { 
      id: Date.now(), type, title: type.charAt(0).toUpperCase() + type.slice(1),
      x: startX, y: 50 + offset, zIndex: topZ + 1, width: startW, height: 320, isLocked: false
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
        existing.widgets = widgets; existing.topZ = topZ; existing.date = new Date().toLocaleDateString();
      } else {
        updatedTemplates.push({ id: Date.now(), name: templateName, image: templateImage, widgets, topZ, date: new Date().toLocaleDateString() });
      }
      localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
      setTemplateName(''); setTemplateImage(null);
      alert('Salvo com sucesso!');
    } catch (e) {
      alert('Erro ao salvar. Verifique se imagens não ultrapassam o limite do navegador.');
    }
  };

  const loadTemplate = (id) => { const template = templates.find(t => t.id === id); if (template) { setWidgets(template.widgets); setTopZ(template.topZ); setShowTemplateModal(false); } };
  const deleteTemplate = (id) => { const updatedTemplates = templates.filter(t => t.id !== id); localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates)); setTemplates(updatedTemplates); };
  const exportAllTemplates = () => { const a = document.createElement('a'); a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates)); a.download = `dmscreen_layouts.json`; a.click(); };
  const importTemplates = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try { const imported = JSON.parse(event.target.result); if (Array.isArray(imported)) { const merged = [...templates, ...imported]; localStorage.setItem('dmscreen_templates', JSON.stringify(merged)); setTemplates(merged); alert('Importado com sucesso!'); } } catch (err) { alert('Arquivo inválido.'); }
    }; reader.readAsText(file);
  };

  const renderNoteWidget = (widget) => {
    const activePage = (widget.pages || []).find(p => p.id === widget.activePageId) || (widget.pages && widget.pages[0]);
    if (!activePage) return <div className="text-xs text-stone-500">Erro na anotação. Recrie o widget.</div>;
    const addPage = () => { const newPage = { id: Date.now(), title: `Pág ${(widget.pages||[]).length + 1}`, content: '' }; updateWidget(widget.id, { pages: [...(widget.pages||[]), newPage], activePageId: newPage.id }); };

    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between bg-black/40 border-b border-white/5 p-1">
          <button onClick={() => updateWidget(widget.id, { showTools: !widget.showTools })} className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-stone-300 rounded-md text-xs font-bold transition-colors">
            {widget.showTools ? 'Ocultar Edição' : 'Formatar Texto'}
          </button>
        </div>
        {widget.showTools && (
          <div className="flex flex-wrap gap-1 p-2 bg-black/40 border-b border-white/5 items-center text-xs">
            <button onClick={() => document.execCommand('bold', false, null)} className="p-1.5 hover:bg-white/10 rounded-md text-stone-300 transition-colors" title="Negrito"><Bold size={14} /></button>
            <button onClick={() => document.execCommand('italic', false, null)} className="p-1.5 hover:bg-white/10 rounded-md text-stone-300 transition-colors" title="Itálico"><Italic size={14} /></button>
            <button onClick={() => document.execCommand('formatBlock', false, 'H2')} className="p-1.5 hover:bg-white/10 rounded-md text-stone-300 transition-colors" title="Título"><Heading size={14} /></button>
            <input type="color" onChange={(e) => document.execCommand('foreColor', false, e.target.value)} className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent hover:ring-1 ring-white/20 transition-all" title="Cor do Texto" />
            <select onChange={(e) => document.execCommand('fontSize', false, e.target.value)} className="bg-black/60 border border-white/10 rounded-md text-stone-200 outline-none p-1.5 ml-1" title="Tamanho do Texto">
              <option value="3">Normal</option><option value="1">Pequeno</option><option value="5">Grande</option><option value="7">Enorme</option>
            </select>
          </div>
        )}
        <div className="flex overflow-x-auto bg-black/20 border-b border-white/5 p-1 gap-1 custom-scrollbar">
          {widget.pages.map(page => (
            <div key={page.id} onClick={() => updateWidget(widget.id, { activePageId: page.id })} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md cursor-pointer group whitespace-nowrap transition-colors ${widget.activePageId === page.id ? 'bg-white/10 theme-text font-bold shadow-sm' : 'bg-transparent text-stone-400 hover:bg-white/5'}`}>
              <input type="text" value={page.title} onChange={e => updateWidget(widget.id, { pages: widget.pages.map(p => p.id === page.id ? { ...p, title: e.target.value } : p) })} className="bg-transparent outline-none w-20 text-center" onClick={e => e.stopPropagation()} />
              {widget.pages.length > 1 && ( <button onClick={(e) => { e.stopPropagation(); const newPages = widget.pages.filter(p => p.id !== page.id); updateWidget(widget.id, { pages: newPages, activePageId: widget.activePageId === page.id ? newPages[0].id : widget.activePageId }); }} className="opacity-0 group-hover:opacity-100 hover:text-red-400 ml-1 transition-opacity"><X size={12} /></button> )}
            </div>
          ))}
          <button onClick={addPage} className="px-2 py-1.5 text-stone-400 hover:theme-text transition-colors"><FilePlus size={14} /></button>
        </div>
        <div className="flex-1 w-full bg-black/10 p-3.5 rounded-b-lg text-sm text-stone-200 outline-none overflow-y-auto custom-scrollbar" contentEditable suppressContentEditableWarning onBlur={(e) => updateWidget(widget.id, { pages: widget.pages.map(p => p.id === activePage.id ? { ...p, content: e.currentTarget.innerHTML } : p) })} dangerouslySetInnerHTML={{ __html: activePage.content }} />
      </div>
    );
  };

  const renderDiceWidget = (widget) => {
    const roll = (sides) => {
      const q = parseInt(widget.qty) || 1; const m = parseInt(widget.mod) || 0;
      let sum = 0; let results = []; for(let i=0; i<q; i++) { const val = Math.floor(Math.random() * sides) + 1; sum += val; results.push(val); }
      const histStr = `${q}d${sides}${m !== 0 ? (m > 0 ? '+'+m : m) : ''} ➔ ${sum + m} [${results.join(',')}]`;
      updateWidget(widget.id, { result: sum + m, history: [histStr, ...(widget.history || [])].slice(0, 6) });
    };
    return (
      <div className="flex flex-col items-center h-full gap-2 relative p-1">
        <div className="text-6xl font-black theme-text bg-black/20 w-full text-center py-6 rounded-xl border border-white/5 flex-1 flex items-center justify-center shadow-inner" style={{ textShadow: '0 0 20px var(--theme-main)' }}>
          {widget.result}
        </div>
        <div className="flex gap-2 w-full justify-center bg-black/40 p-2.5 rounded-xl border border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-stone-400 mb-1">QTD</span>
            <input type="number" value={widget.qty || 1} onChange={e => updateWidget(widget.id, { qty: e.target.value })} className="w-14 bg-black/60 text-center rounded-md border border-white/10 text-sm py-1 outline-none theme-text font-bold focus:border-[var(--theme-main)] transition-colors" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-stone-400 mb-1">MOD</span>
            <input type="number" value={widget.mod || 0} onChange={e => updateWidget(widget.id, { mod: e.target.value })} className="w-14 bg-black/60 text-center rounded-md border border-white/10 text-sm py-1 outline-none theme-text font-bold focus:border-[var(--theme-main)] transition-colors" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 w-full">
          {[4, 6, 8, 10, 12, 20, 100].map(d => ( <button key={d} onClick={() => roll(d)} className="bg-white/5 hover:bg-white/10 px-2 py-2 rounded-lg font-bold border border-white/5 flex-1 min-w-[40px] text-center text-xs transition-colors shadow-sm hover:border-white/20">D{d}</button> ))}
        </div>
        <div className="w-full text-[10px] text-stone-500 bg-black/40 p-1.5 rounded-lg overflow-hidden max-h-16 overflow-y-auto custom-scrollbar border border-white/5">
          {(widget.history || []).map((h, i) => <div key={i} className="truncate px-1">{h}</div>)}
        </div>
      </div>
    );
  };

  const renderTableWidget = (widget) => {
    const updateCell = (rIdx, cIdx, val) => { const newRows = [...widget.rows]; newRows[rIdx][cIdx] = val; updateWidget(widget.id, { rows: newRows }); };
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center gap-2 bg-black/40 border-b border-white/5 p-1.5">
          <button onClick={() => updateWidget(widget.id, { isEditingStruct: !widget.isEditingStruct })} className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-stone-300 rounded-md text-xs font-bold transition-colors border border-white/5 flex items-center gap-1.5">
            {widget.isEditingStruct ? <Unlock size={12}/> : <Lock size={12}/>} Estrutura
          </button>
        </div>
        {widget.isEditingStruct && (
          <div className="flex gap-2 p-2 bg-black/40 border-b border-white/5 items-center">
             <button onClick={() => updateWidget(widget.id, { rows: [...widget.rows, Array(widget.rows[0].length).fill('')] })} className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"><PlusSquare size={12}/> Linha</button>
             <button onClick={() => updateWidget(widget.id, { rows: widget.rows.map(r => [...r, '']) })} className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"><PlusSquare size={12}/> Coluna</button>
          </div>
        )}
        <div className="flex-1 overflow-auto custom-scrollbar bg-black/10 p-2">
          <table className="w-full border-collapse border border-white/10 min-w-max rounded-lg overflow-hidden">
            <tbody>
              {widget.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="border border-white/10 p-0 relative bg-black/20 hover:bg-black/40 transition-colors">
                      <input type="text" value={cell} onChange={(e) => updateCell(rIdx, cIdx, e.target.value)} className="w-full h-full p-2.5 bg-transparent outline-none text-sm text-stone-200 placeholder-stone-700 min-w-[80px]" placeholder="..." />
                    </td>
                  ))}
                  {widget.isEditingStruct && widget.rows.length > 1 && (
                    <td className="border border-white/10 bg-black/60 text-center w-8">
                      <button onClick={() => updateWidget(widget.id, { rows: widget.rows.filter((_, i) => i !== rIdx) })} className="text-stone-500 hover:text-red-400 p-1.5 rounded-md hover:bg-red-400/10 transition-colors block mx-auto"><Trash2 size={14}/></button>
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

      <header className="flex flex-col md:flex-row justify-between items-center bg-stone-950/80 backdrop-blur-lg px-4 py-2.5 border-b border-white/10 z-50 flex-shrink-0 shadow-[0_4px_20px_rgb(0,0,0,0.3)] w-full gap-3 md:gap-0">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <h1 className="text-xl font-bold theme-text flex items-center gap-2 select-none tracking-tight"><Layout size={20} /> DM SCREEN</h1>
          <a href="https://pjlite.vercel.app/" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 text-[11px] bg-white/5 hover:bg-white/10 text-[var(--theme-main)] border border-[var(--theme-main)]/30 px-2.5 py-1.5 rounded-md transition-all font-bold shadow-sm" title="Acesse o PJ Lite - Criador de Fichas Dragonbane">
            PJ Lite <ExternalLink size={12} />
          </a>
        </div>
        
        <div className="flex overflow-x-auto custom-scrollbar pb-1 md:pb-0 md:flex-wrap justify-start md:justify-center gap-2 flex-1 w-full md:w-auto px-1">
          <button onClick={() => addWidget('note')} className="flex-shrink-0 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg flex items-center gap-2 border border-white/10 text-xs font-bold transition-all shadow-sm hover:border-white/20"><FileText size={14} /> Nota</button>
          <button onClick={() => addWidget('dice')} className="flex-shrink-0 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg flex items-center gap-2 border border-white/10 text-xs font-bold transition-all shadow-sm hover:border-white/20"><Dices size={14} /> Dados</button>
          <button onClick={() => addWidget('initiative')} className="flex-shrink-0 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg flex items-center gap-2 border border-white/10 text-xs font-bold transition-all shadow-sm hover:border-white/20"><Swords size={14} /> Init</button>
          <button onClick={() => addWidget('links')} className="flex-shrink-0 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg flex items-center gap-2 border border-white/10 text-xs font-bold transition-all shadow-sm hover:border-white/20"><Link2 size={14} /> Links</button>
          <button onClick={() => addWidget('image')} className="flex-shrink-0 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg flex items-center gap-2 border border-white/10 text-xs font-bold transition-all shadow-sm hover:border-white/20"><ImageIcon size={14} /> Imagem</button>
          <button onClick={() => addWidget('table')} className="flex-shrink-0 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg flex items-center gap-2 border border-white/10 text-xs font-bold transition-all shadow-sm hover:border-white/20"><TableIcon size={14} /> Tabela</button>
        </div>
        
        <div className="flex gap-2.5 items-center">
          <div className="flex items-center gap-1 bg-black/40 rounded-lg border border-white/10 p-1 shadow-inner" title="Zoom da Letra (Global)">
            <button onClick={() => setAppSettings({...appSettings, fontSize: Math.max(12, (appSettings.fontSize || 16) - 1)})} className="p-1.5 text-stone-400 hover:text-white rounded hover:bg-white/10 transition-colors"><Minus size={14} /></button>
            <span className="text-xs font-bold text-stone-300 px-1.5">Aa</span>
            <button onClick={() => setAppSettings({...appSettings, fontSize: Math.min(22, (appSettings.fontSize || 16) + 1)})} className="p-1.5 text-stone-400 hover:text-white rounded hover:bg-white/10 transition-colors"><Plus size={14} /></button>
          </div>
          <button onClick={() => setShowHelpModal(true)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-stone-300 transition-all shadow-sm" title="Guia de Uso">
            <HelpCircle size={16} />
          </button>
          <button onClick={() => setIsMobileMode(!isMobileMode)} className={`p-2 rounded-lg border transition-all shadow-sm ${isMobileMode ? 'bg-[var(--theme-main)] border-[var(--theme-main)] text-stone-900 shadow-[0_0_10px_var(--theme-main)]' : 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-300'}`} title="Modo Touch (Celular/Tablet)">
            <Smartphone size={16} />
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-stone-300 transition-all shadow-sm" title="Configurações e Sobre">
            <Settings size={16} />
          </button>
          <button onClick={() => setShowTemplateModal(true)} className="bg-white/5 hover:bg-white/10 text-stone-200 transition-all px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 text-xs font-bold shadow-sm hover:border-[var(--theme-main)]/50 group">
            <FolderOpen size={16} className="theme-text group-hover:scale-110 transition-transform" /> <span className="hidden md:inline tracking-wide">Layouts</span>
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
              <div className="flex flex-col h-full w-full gap-1.5">
                <div className="flex items-center justify-between bg-black/40 p-1.5 rounded-lg border border-white/5">
                  <button onClick={() => updateWidget(widget.id, { showUpload: !widget.showUpload })} className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-stone-300 rounded-md text-[11px] font-bold transition-colors">
                    {widget.showUpload ? 'Ocultar Opções' : 'Mudar Imagem'}
                  </button>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-300 font-bold bg-black/40 px-2 py-1 rounded-md border border-white/5">
                    Zoom:
                    <button onClick={() => updateWidget(widget.id, { zoom: Math.max(50, (widget.zoom || 100) - 15) })} className="bg-white/10 hover:bg-white/20 px-1.5 rounded transition-colors">-</button>
                    <span className="w-8 text-center">{widget.zoom || 100}%</span>
                    <button onClick={() => updateWidget(widget.id, { zoom: Math.min(300, (widget.zoom || 100) + 15) })} className="bg-white/10 hover:bg-white/20 px-1.5 rounded transition-colors">+</button>
                  </div>
                </div>
                {widget.showUpload && (
                  <div className="flex flex-col gap-2 bg-black/40 p-2.5 rounded-lg border border-white/5 text-xs animate-fade-in">
                    <div className="flex gap-1.5">
                      <input type="text" placeholder="Cole URL da imagem..." value={widget.imageUrlInput || ''} onChange={e => updateWidget(widget.id, { imageUrlInput: e.target.value })} className="flex-1 bg-black/60 border border-white/10 rounded-md px-2.5 py-1.5 outline-none text-stone-200 focus:border-[var(--theme-main)] transition-colors" />
                      <button onClick={() => updateWidget(widget.id, { imageData: widget.imageUrlInput, showUpload: false })} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md font-bold transition-colors">OK</button>
                    </div>
                    <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-stone-300 py-2 px-3 rounded-md text-center font-bold border border-white/10 block mt-1 transition-colors">
                      Ou faça Upload Local
                      <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => updateWidget(widget.id, { imageData: reader.result, showUpload: false }); reader.readAsDataURL(file); } }} className="hidden" />
                    </label>
                  </div>
                )}
                <div className="flex-1 overflow-auto rounded-lg bg-black/20 border border-white/5 flex items-center justify-center p-1.5 relative custom-scrollbar">
                  {widget.imageData ? (
                    <img src={widget.imageData} alt="Conteúdo" className="transition-all duration-200 object-contain shadow-lg rounded" style={{ width: `${widget.zoom || 100}%`, height: `${widget.zoom || 100}%` }} />
                  ) : (
                    <div className="text-xs text-stone-500 italic text-center flex flex-col items-center gap-2 opacity-50"><ImageIcon size={32}/>Nenhuma imagem carregada.</div>
                  )}
                </div>
              </div>
            )}
            {widget.type === 'table' && renderTableWidget(widget)}
          </WidgetCard>
        ))}
      </main>

      <footer className="flex items-center gap-2.5 bg-stone-950/80 backdrop-blur-lg border-t border-white/10 px-4 py-2 overflow-x-auto z-50 flex-shrink-0 w-full shadow-[0_-4px_20px_rgb(0,0,0,0.3)] custom-scrollbar">
        <div className="text-[11px] font-bold text-stone-400 uppercase flex-shrink-0 tracking-wider">Janelas Ativas ({widgets.length}):</div>
        {widgets.map(w => (
          <button key={`task-${w.id}`} onClick={() => bringToFront(w.id)} className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/10 truncate max-w-[140px] transition-all theme-text shadow-sm hover:border-[var(--theme-main)]/50">
            {w.title}
          </button>
        ))}
      </footer>

      {showHelpModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-stone-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgb(0,0,0,0.7)] w-full max-w-2xl p-5 flex flex-col gap-4 max-h-[85vh]">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold theme-text flex items-center gap-2 tracking-tight"><HelpCircle size={20}/> Guia de Uso - DM Screen</h2>
              <button onClick={() => setShowHelpModal(false)} className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"><X size={20}/></button>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 text-sm text-stone-300">
              <p>Bem-vindo ao <strong>DM Screen Architect</strong>! Uma ferramenta modular para você montar sua mesa de mestre perfeita.</p>
              
              <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <h3 className="font-bold text-stone-100 mb-2 flex items-center gap-2"><Layout size={16} className="text-[var(--theme-main)]"/> Como controlar as Janelas</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Mover:</strong> Clique e segure na barra superior escura de qualquer janela (onde fica o título) e arraste.</li>
                  <li><strong>Redimensionar:</strong> Arraste o ícone de setas duplas no canto inferior direito das janelas.</li>
                  <li><strong>Renomear:</strong> Clique no próprio título da janela para digitar um novo nome.</li>
                  <li><strong>Trancar:</strong> Clique no Cadeado para fixar a janela no lugar, evitando cliques acidentais e movê-la sem querer.</li>
                </ul>
              </div>

              <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <h3 className="font-bold text-stone-100 mb-2 flex items-center gap-2"><Smartphone size={16} className="text-[var(--theme-main)]"/> Dicas para Celular e Tablet</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ative o <strong>Modo Touch</strong> clicando no ícone de celular no topo. Isso deixa as barras maiores e os botões mais fáceis de tocar.</li>
                  <li>A barra de ferramentas superior pode ser arrastada para os lados (scroll horizontal) caso a tela do seu aparelho seja muito pequena.</li>
                  <li>Use a <strong>Barra de Tarefas</strong> (no rodapé inferior) para encontrar janelas escondidas. Clique no nome e ela pulará para a frente das outras!</li>
                </ul>
              </div>

              <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <h3 className="font-bold text-stone-100 mb-2 flex items-center gap-2"><FolderOpen size={16} className="text-[var(--theme-main)]"/> Salvando seu Progresso</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Clique no botão <strong>Layouts</strong> no canto superior direito para salvar a posição e o conteúdo de todas as suas janelas.</li>
                  <li>Tudo fica salvo <em>offline</em> no seu navegador. Para maior segurança (ou para mudar de PC), use o botão <strong>Exportar Todos</strong> para baixar um arquivo (.json) de backup.</li>
                  <li>Explore a vitrine da comunidade usando o botão do Drive para baixar escudos fantásticos criados por outras pessoas!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-stone-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgb(0,0,0,0.7)] w-full max-w-sm p-5 flex flex-col gap-4 max-h-[85vh]">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h2 className="text-base font-bold theme-text flex items-center gap-2 tracking-tight"><Settings size={18}/> Configurações e Sobre</h2>
              <button onClick={() => { setShowSettingsModal(false); localStorage.setItem('dmscreen_settings', JSON.stringify(appSettings)); }} className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"><X size={18}/></button>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
              <div className="flex flex-col gap-2 relative group">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Tema de Cores</label>
                <div className="flex gap-2.5">
                  {Object.keys(THEMES).map(t => (
                    <button key={t} onClick={() => setAppSettings({...appSettings, theme: t})} className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 shadow-md ${appSettings.theme === t ? 'border-white scale-110 shadow-white/20' : 'border-transparent'}`} style={{ backgroundColor: THEMES[t].main }} title={t === 'pjlite' ? 'Tema PJ Lite' : `Tema ${t}`} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 group">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                  Plano de Fundo (Mesa)
                  <span className="text-[10px] text-stone-500 font-normal">Opacidade: {appSettings.opacity}%</span>
                </label>
                <input type="range" min="10" max="100" value={appSettings.opacity} onChange={e => setAppSettings({...appSettings, opacity: e.target.value})} className="w-full accent-[var(--theme-main)] cursor-pointer" />
                <select value={appSettings.bgType} onChange={e => setAppSettings({...appSettings, bgType: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-stone-200 outline-none focus:border-[var(--theme-main)] transition-colors cursor-pointer appearance-none">
                  <option value="none">Cor do Tema (Padrão Escuro)</option>
                  <option value="custom_color">Cor Personalizada (Branco, Claro, etc)</option>
                  <option value="image">Imagem / GIF (URL)</option>
                  <option value="video">Vídeo MP4 (URL)</option>
                </select>
                {appSettings.bgType === 'custom_color' && (
                  <div className="flex items-center gap-2 mt-1 bg-black/40 border border-white/10 rounded-lg p-2 shadow-inner">
                    <input type="color" value={appSettings.customBgColor || '#ffffff'} onChange={e => setAppSettings({...appSettings, customBgColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                    <span className="text-xs text-stone-400 font-bold">Escolha a cor</span>
                  </div>
                )}
                {(appSettings.bgType === 'image' || appSettings.bgType === 'video') && (
                  <input type="text" value={appSettings.bgValue} onChange={e => setAppSettings({...appSettings, bgValue: e.target.value})} placeholder="Cole o Link (URL) aqui..." className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs outline-none w-full mt-1 focus:border-[var(--theme-main)] transition-colors" />
                )}
              </div>

              <div className="flex flex-col gap-2 bg-black/20 p-3.5 rounded-xl border border-white/5 text-sm shadow-inner mt-2">
                <div className="font-bold theme-text flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <span className="text-base tracking-tight">DM lite Alpha 0.2.4v</span>
                  <a href="https://pjlite.vercel.app/" target="_blank" rel="noreferrer" className="text-xs bg-[var(--theme-main)]/10 text-[var(--theme-main)] border border-[var(--theme-main)]/30 px-2 py-1 rounded-md hover:bg-[var(--theme-main)]/20 transition-colors text-center whitespace-nowrap">
                    Conheça o PJ Lite
                  </a>
                </div>
                
                <div className="text-xs text-stone-300 mt-2 leading-relaxed">
                  Criador de fichas virtuais simples, ideal para imprimir e usar na mesa. (Atualmente com suporte para Dragonbane).
                </div>

                <div className="text-[11px] font-bold text-stone-400 mt-3 uppercase tracking-wider">Últimas Novidades:</div>
                <ul className="list-disc pl-5 text-xs text-stone-400 space-y-1.5 mt-1 marker:text-[var(--theme-main)]">
                  <li><strong className="text-stone-200">NOVO:</strong> Guia de Uso (Tutorial interativo).</li>
                  <li><strong className="text-stone-200">NOVO:</strong> Otimização extrema para layout Mobile (Barras roláveis e criação inteligente).</li>
                  <li><strong className="text-stone-200">NOVO:</strong> Vitrine de Escudos da Comunidade integrada (Drive).</li>
                  <li><strong className="text-stone-200">NOVO:</strong> Remoção de senhas para uso mais ágil e direto.</li>
                  <li>Melhoria visual profunda (Glassmorphism e Glow).</li>
                  <li>Tema de Cores PJ Lite + Cor de Fundo Livre.</li>
                  <li>Anotações Multicores, Links, Iniciativa e Super Tabelas.</li>
                </ul>
                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-stone-400 bg-black/20 p-2 rounded-lg text-center">
                  <span className="font-bold text-stone-300 block mb-1">Desenvolvido por Nicck Queijo</span>
                  <div className="flex justify-center gap-3">
                    <span><span className="text-[var(--theme-main)]">Telegram:</span> @ralseibaiano</span>
                    <span><span className="text-[var(--theme-main)]">Discord:</span> inabakaoru</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-stone-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgb(0,0,0,0.7)] w-full max-w-md flex flex-col overflow-hidden max-h-[85vh]">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/40">
              <h2 className="text-base font-bold theme-text flex items-center gap-2 tracking-tight"><Save size={18} /> Gerenciar Layouts</h2>
              <button onClick={() => setShowTemplateModal(false)} className="text-stone-400 hover:text-red-400 p-1 rounded-md hover:bg-white/10 transition-colors"><X size={18} /></button>
            </div>
            
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-2.5 bg-black/20 p-3.5 rounded-xl border border-white/5 shadow-inner">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Salvar Layout Atual</label>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer bg-black/40 p-2.5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 shadow-sm" title="Adicionar Miniatura">
                    {templateImage ? <img src={templateImage} className="w-6 h-6 rounded-md object-cover" alt="" /> : <ImagePlus size={18} className="text-stone-400"/>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files[0]; if(f) { const r = new FileReader(); r.onloadend = () => setTemplateImage(r.result); r.readAsDataURL(f); } }}/>
                  </label>
                  <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Nome do Layout" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none text-stone-200 focus:border-[var(--theme-main)] transition-colors" />
                  <button onClick={() => saveTemplate(null)} className="bg-[var(--theme-main)] hover:brightness-110 text-stone-900 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-[0_0_15px_var(--theme-main)]">Salvar</button>
                </div>
              </div>

              <a href="https://drive.google.com/drive/folders/1aZe-IfaPEwp4JvIxBATxNIfZi630gAhL?usp=sharing" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 border border-white/10 rounded-xl p-3 text-xs text-stone-200 transition-all shadow-md group">
                <div className="bg-white/10 p-1.5 rounded-md group-hover:bg-[var(--theme-main)]/20 transition-colors"><FolderOpen size={16} className="text-[var(--theme-main)]" /></div>
                <span className="font-bold tracking-wide">Vitrine da Comunidade (Drive)</span> 
                <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity ml-1"/>
              </a>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="relative w-full sm:w-1/2">
                  <Search size={14} className="absolute left-3 top-2.5 text-stone-500" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar..." className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-[11px] outline-none text-stone-200 focus:border-[var(--theme-main)] transition-colors" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                   <label className="cursor-pointer text-[10px] bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg text-stone-300 font-bold flex items-center gap-1.5 border border-white/10 transition-colors shadow-sm">
                     <Upload size={12}/> Importar
                     <input type="file" accept=".json" onChange={importTemplates} className="hidden" />
                   </label>
                   <button onClick={exportAllTemplates} className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg text-stone-300 font-bold flex items-center gap-1.5 border border-white/10 transition-colors shadow-sm">
                     <Download size={12}/> Exportar
                   </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map(t => (
                  <div key={t.id} className="flex items-center justify-between bg-black/40 border border-white/5 hover:border-white/10 p-2.5 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {t.image ? <img src={t.image} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-sm" alt="" /> : <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5"><Layout size={16} className="text-stone-500"/></div>}
                      <div className="flex flex-col truncate">
                        <span className="font-bold text-xs text-stone-200 truncate group-hover:text-[var(--theme-main)] transition-colors">{t.name}</span>
                        <span className="text-[10px] text-stone-500">{t.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0 ml-2">
                      <button onClick={() => saveTemplate(t.id)} className="p-2 text-stone-400 hover:text-blue-400 rounded-lg hover:bg-blue-400/10 transition-colors" title="Salvar por Cima"><RefreshCw size={14} /></button>
                      <button onClick={() => loadTemplate(t.id)} className="px-3 py-1.5 bg-white/10 hover:bg-[var(--theme-main)] hover:text-stone-900 text-stone-200 rounded-lg text-[11px] font-bold transition-all shadow-sm">Carregar</button>
                      <button onClick={() => deleteTemplate(t.id)} className="p-2 text-stone-400 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors" title="Deletar"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                {templates.length === 0 && <div className="text-center text-xs text-stone-500 italic py-4">Nenhum layout salvo.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        html { font-size: ${appSettings.fontSize || 16}px !important; }
        .theme-text { color: var(--theme-main); }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--theme-main); }
      `}} />
    </div>
  );
};

export default App;
