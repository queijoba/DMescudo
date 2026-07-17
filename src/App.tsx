import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Dices, Layout, Image as ImageIcon, 
  Table as TableIcon, FileText, Bold, Italic, 
  Heading, FilePlus, PlusSquare, X,
  GripHorizontal, Scaling,
  Save, FolderOpen, Lock, KeyRound,
  Search, ImagePlus, RefreshCw, Download, Upload,
  Unlock, Settings, Smartphone, Palette,
  Swords, ChevronLeft, ChevronRight,
  Link2, ArrowUp, ArrowDown, ExternalLink, Minus, Type
} from 'lucide-react';

const THEMES = {
  amber: { main: '#d97706', bg: '#1c1917', text: '#fef3c7' },
  emerald: { main: '#059669', bg: '#064e3b', text: '#d1fae5' },
  blue: { main: '#2563eb', bg: '#1e3a8a', text: '#dbeafe' },
  purple: { main: '#7c3aed', bg: '#4c1d95', text: '#ede9fe' },
  rose: { main: '#e11d48', bg: '#881337', text: '#ffe4e6' }
};

const WidgetCard = ({ widget, updateWidget, removeWidget, bringToFront, isMobileMode, children }) => {
  const cardRef = useRef(null);

  const handleDragStart = (e) => {
    if (widget.isLocked) return;
    e.preventDefault();
    bringToFront(widget.id);
    
    const startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const startPosX = widget.x || 0;
    const startPosY = widget.y || 0;

    const onMove = (moveEvent) => {
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX) || 0;
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY) || 0;
      
      const dx = clientX - startX;
      const dy = clientY - startY;
      
      let newX = startPosX + dx;
      let newY = startPosY + dy;
      
      const maxX = window.innerWidth - (widget.width || 300);
      const maxY = window.innerHeight - 80; 
      
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

    const startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const startW = widget.width || 300;
    const startH = widget.height || 300;

    const onMove = (moveEvent) => {
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX) || 0;
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY) || 0;
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
      style={{ 
        left: widget.x, top: widget.y, 
        width: widget.width, height: widget.height, 
        zIndex: widget.zIndex || 1 
      }}
    >
      <div 
        className={`flex justify-between items-center bg-stone-950 px-3 py-2 border-b border-stone-700 ${widget.isLocked ? 'cursor-default' : 'cursor-move'} ${isMobileMode ? 'py-3' : 'py-2'}`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="flex items-center gap-2 w-full overflow-hidden">
          {!widget.isLocked && <GripHorizontal size={isMobileMode ? 18 : 14} className="text-stone-500 flex-shrink-0" />}
          <input 
            type="text" 
            value={widget.title || ''}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
            className={`font-bold theme-text bg-transparent outline-none w-full px-1 truncate hover:bg-stone-800/80 focus:bg-stone-900 focus:ring-1 focus:ring-stone-600 rounded cursor-text transition-colors ${isMobileMode ? 'text-base py-1' : 'text-sm py-0.5'}`}
            title="Clique para renomear esta janela"
          />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button onPointerDown={e => e.stopPropagation()} onClick={() => updateWidget(widget.id, { isLocked: !widget.isLocked })} className={`text-stone-500 hover:text-white p-1 transition-colors ${isMobileMode ? 'p-2' : ''}`}>
            {widget.isLocked ? <Lock size={isMobileMode ? 18 : 14}/> : <Unlock size={isMobileMode ? 18 : 14}/>}
          </button>
          <button onPointerDown={e => e.stopPropagation()} onClick={() => removeWidget(widget.id)} className={`text-red-500 hover:text-red-400 p-1 transition-colors ${isMobileMode ? 'p-2' : ''}`}>
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

const InitiativeWidget = ({ widget, updateWidget, isMobileMode }) => {
  const combatants = widget.combatants || [];

  const addCombatant = () => {
    const newCombatant = { id: Date.now() + Math.random(), name: 'Personagem', init: '', hp: '' };
    updateWidget(widget.id, { combatants: [...combatants, newCombatant] });
  };

  const updateCombatant = (id, field, value) => {
    const newCombatants = combatants.map(c => c.id === id ? { ...c, [field]: value } : c);
    updateWidget(widget.id, { combatants: newCombatants });
  };

  const removeCombatant = (id) => {
    updateWidget(widget.id, { combatants: combatants.filter(c => c.id !== id) });
  };

  const sortInitiative = () => {
    const sorted = [...combatants].sort((a, b) => (Number(b.init) || 0) - (Number(a.init) || 0));
    updateWidget(widget.id, { combatants: sorted });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className={`flex gap-2 mb-2 ${isMobileMode ? 'p-1' : ''}`}>
        <button onClick={addCombatant} className={`bg-stone-700 hover:bg-stone-600 rounded font-bold flex items-center gap-1 ${isMobileMode ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'}`}>
          <PlusSquare size={14}/> Add
        </button>
        <button onClick={sortInitiative} className={`bg-stone-700 hover:bg-stone-600 rounded font-bold flex items-center gap-1 ${isMobileMode ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'}`}>
          <RefreshCw size={14}/> Sort
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-stone-900 border border-stone-700 rounded p-1">
        {combatants.map((c, i) => (
          <div key={c.id} className={`flex items-center gap-1 p-1 mb-1 rounded border transition-colors ${widget.activeTurn === i ? 'border-[var(--theme-main)] bg-stone-800' : 'border-stone-700 bg-stone-800/50'}`}>
            {widget.activeTurn === i && <ChevronRight size={14} className="theme-text flex-shrink-0" />}
            <input type="text" value={c.name} onChange={(e) => updateCombatant(c.id, 'name', e.target.value)} className={`flex-1 bg-transparent outline-none font-bold placeholder-stone-600 ${isMobileMode ? 'text-base' : 'text-sm'}`} placeholder="Nome" />
            <div className="flex items-center gap-1 w-16" title="Iniciativa">
              <Swords size={12} className="text-stone-500" />
              <input type="number" value={c.init} onChange={(e) => updateCombatant(c.id, 'init', e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded px-1 text-sm outline-none text-center" placeholder="0" />
            </div>
            <div className="flex items-center gap-1 w-16" title="Pontos de Vida">
              <span className="text-[10px] text-red-500 font-bold">HP</span>
              <input type="text" value={c.hp} onChange={(e) => updateCombatant(c.id, 'hp', e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded px-1 text-sm outline-none text-center" placeholder="-" />
            </div>
            <button onClick={() => removeCombatant(c.id)} className="text-stone-500 hover:text-red-400 p-1 flex-shrink-0">
              <Trash2 size={16}/>
            </button>
          </div>
        ))}
      </div>
      {combatants.length > 0 && (
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-stone-700 bg-stone-950 p-1 rounded">
          <button onClick={() => updateWidget(widget.id, { activeTurn: Math.max(0, (widget.activeTurn || 0) - 1) })} className="p-1 text-stone-400 hover:text-white hover:bg-stone-800 rounded"><ChevronLeft size={20}/></button>
          <span className="text-sm font-bold theme-text truncate px-2">Turno: {combatants[widget.activeTurn || 0]?.name || '-'}</span>
          <button onClick={() => updateWidget(widget.id, { activeTurn: ((widget.activeTurn || 0) + 1) % combatants.length })} className="p-1 text-stone-400 hover:text-white hover:bg-stone-800 rounded"><ChevronRight size={20}/></button>
        </div>
      )}
    </div>
  );
};

const LinksWidget = ({ widget, updateWidget, isMobileMode }) => {
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const links = widget.links || [];

  const addLink = () => {
    if (!urlInput.trim()) return;
    const newLink = { 
      id: Date.now() + Math.random(), 
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
          placeholder="Nome (Ex: Ficha do Bárbaro, Trilha Épica)" 
          className="bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs outline-none w-full placeholder-stone-600 focus:border-[var(--theme-main)]"
        />
        <div className="flex gap-1">
          <input 
            type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)} 
            placeholder="Cole o Link (URL)..." 
            className="flex-1 bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs outline-none placeholder-stone-600 focus:border-[var(--theme-main)]"
            onKeyDown={e => e.key === 'Enter' && addLink()}
          />
          <button onClick={addLink} className="bg-stone-700 hover:bg-stone-600 px-3 rounded text-xs font-bold flex items-center justify-center transition-colors">
            <Plus size={14}/>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-stone-950 rounded border border-stone-700 p-1 flex flex-col gap-1">
        {links.map((link, index) => (
          <div key={link.id} className="flex items-center justify-between p-2 rounded bg-stone-900 border border-stone-800 hover:border-stone-600 group transition-colors">
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              <a href={link.url} target="_blank" rel="noreferrer" className="text-stone-400 hover:theme-text transition-colors flex-shrink-0">
                <ExternalLink size={14} />
              </a>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-stone-200 truncate">{link.title}</span>
                <span className="text-[9px] text-stone-500 truncate">{link.url}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
              <div className="flex flex-col">
                <button onClick={() => moveLink(index, 'up')} className="p-0.5 text-stone-500 hover:text-white disabled:opacity-30"><ArrowUp size={12}/></button>
                <button onClick={() => moveLink(index, 'down')} className="p-0.5 text-stone-500 hover:text-white disabled:opacity-30"><ArrowDown size={12}/></button>
              </div>
              <button onClick={() => removeLink(link.id)} className="text-stone-500 hover:text-red-500 p-1 ml-1"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TableWidget = ({ widget, updateWidget }) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Safe defaults if missing
  const rows = widget.rows || [['', ''], ['', '']];
  const colWidths = widget.colWidths || Array(rows[0].length).fill(120);
  const rowHeights = widget.rowHeights || Array(rows.length).fill(40);

  const updateCell = (rIdx, cIdx, html) => {
    const newRows = [...rows];
    newRows[rIdx][cIdx] = html;
    updateWidget(widget.id, { rows: newRows });
  };

  const addRow = () => updateWidget(widget.id, { 
    rows: [...rows, Array(rows[0].length).fill('')],
    rowHeights: [...rowHeights, 40]
  });

  const addCol = () => updateWidget(widget.id, { 
    rows: rows.map(r => [...r, '']), 
    colWidths: [...colWidths, 120] 
  });
  
  const removeRow = (rIdx) => {
     if (rows.length <= 1) return;
     updateWidget(widget.id, { 
       rows: rows.filter((_, i) => i !== rIdx),
       rowHeights: rowHeights.filter((_, i) => i !== rIdx)
     });
  };

  const removeCol = (cIdx) => {
     if (rows[0].length <= 1) return;
     updateWidget(widget.id, { 
       rows: rows.map(r => r.filter((_, i) => i !== cIdx)),
       colWidths: colWidths.filter((_, i) => i !== cIdx)
     });
  };

  const changeColWidth = (cIdx, delta) => {
     const newWidths = [...colWidths];
     newWidths[cIdx] = Math.max(50, (newWidths[cIdx] || 120) + delta);
     updateWidget(widget.id, { colWidths: newWidths });
  };

  const changeRowHeight = (rIdx, delta) => {
     const newHeights = [...rowHeights];
     newHeights[rIdx] = Math.max(30, (newHeights[rIdx] || 40) + delta);
     updateWidget(widget.id, { rowHeights: newHeights });
  };

  const execCmd = (cmd, val = null) => document.execCommand(cmd, false, val);

  return (
    <div className="flex flex-col h-full w-full bg-stone-900 rounded overflow-hidden border border-stone-800">
      <div className="flex justify-between p-1 bg-stone-950 border-b border-stone-700 text-xs">
         <button onClick={() => setShowToolbar(!showToolbar)} className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${showToolbar ? 'bg-[var(--theme-main)] text-stone-900 font-bold' : 'text-stone-400 hover:text-white hover:bg-stone-800'}`}>
           <Palette size={12}/> Formatar
         </button>
         <button onClick={() => setEditMode(!editMode)} className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${editMode ? 'bg-[var(--theme-main)] text-stone-900 font-bold' : 'text-stone-400 hover:text-white hover:bg-stone-800'}`}>
           {editMode ? <Unlock size={12}/> : <Lock size={12}/>} Estrutura
         </button>
      </div>

      {showToolbar && (
        <div className="flex flex-wrap gap-2 p-1 bg-stone-800 border-b border-stone-700 items-center text-xs shadow-inner">
          <button onPointerDown={(e) => { e.preventDefault(); execCmd('bold'); }} className="p-1.5 bg-stone-700 hover:bg-stone-600 rounded text-stone-200" title="Negrito"><Bold size={14}/></button>
          <button onPointerDown={(e) => { e.preventDefault(); execCmd('italic'); }} className="p-1.5 bg-stone-700 hover:bg-stone-600 rounded text-stone-200" title="Itálico"><Italic size={14}/></button>
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded border border-stone-700">
            <span className="text-stone-400 px-1 font-bold">Cor:</span>
            <input type="color" onChange={(e) => execCmd('foreColor', e.target.value)} className="w-5 h-5 bg-transparent rounded cursor-pointer" title="Cor do Texto" />
          </div>
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded border border-stone-700">
            <span className="text-stone-400 px-1 font-bold">Fundo:</span>
            <input type="color" onChange={(e) => execCmd('backColor', e.target.value)} className="w-5 h-5 bg-transparent rounded cursor-pointer" title="Cor de Fundo" />
          </div>
        </div>
      )}

      {editMode && (
         <div className="flex gap-2 p-1 bg-stone-900 border-b border-stone-700 text-xs">
            <button onClick={addRow} className="px-2 py-1 bg-stone-800 hover:bg-stone-700 rounded flex items-center gap-1 border border-stone-700"><PlusSquare size={12}/> Nova Linha</button>
            <button onClick={addCol} className="px-2 py-1 bg-stone-800 hover:bg-stone-700 rounded flex items-center gap-1 border border-stone-700"><PlusSquare size={12}/> Nova Coluna</button>
         </div>
      )}

      <div className="flex-1 overflow-auto custom-scrollbar p-2 bg-stone-950">
        <table className="border-collapse border border-stone-700 bg-stone-900 table-fixed">
           {editMode && (
             <thead>
               <tr>
                 {colWidths.map((w, i) => (
                   <th key={`col-${i}`} className="border border-stone-700 bg-stone-800 p-1" style={{ width: w }}>
                      <div className="flex flex-col items-center gap-1 text-[10px] font-normal text-stone-400">
                         <div className="flex items-center gap-1 w-full justify-between bg-stone-900 rounded px-1">
                           <button onClick={() => changeColWidth(i, -20)} className="hover:text-white py-1 px-1.5 bg-stone-700 rounded m-0.5">-</button>
                           <span>{w}px</span>
                           <button onClick={() => changeColWidth(i, 20)} className="hover:text-white py-1 px-1.5 bg-stone-700 rounded m-0.5">+</button>
                         </div>
                         <button onClick={() => removeCol(i)} className="text-stone-500 hover:text-red-400 flex items-center gap-1 mt-1"><Trash2 size={10}/> Coluna</button>
                      </div>
                   </th>
                 ))}
                 {editMode && <th className="w-10 border border-stone-700 bg-stone-900"></th>}
               </tr>
             </thead>
           )}
           <tbody>
              {rows.map((r, rIdx) => (
                <tr key={`row-${rIdx}`}>
                   {r.map((c, cIdx) => (
                      <td key={`cell-${rIdx}-${cIdx}`} className="border border-stone-700 p-0 align-top focus-within:bg-stone-800 transition-colors" style={{ width: colWidths[cIdx], minWidth: colWidths[cIdx], maxWidth: colWidths[cIdx], height: rowHeights[rIdx] || 40 }}>
                         <div 
                           className="w-full h-full p-2 outline-none overflow-y-auto custom-scrollbar"
                           contentEditable suppressContentEditableWarning
                           onBlur={(e) => updateCell(rIdx, cIdx, e.currentTarget.innerHTML)}
                           dangerouslySetInnerHTML={{ __html: c || '' }}
                           style={{ minHeight: rowHeights[rIdx] || 40 }}
                         />
                      </td>
                   ))}
                   {editMode && (
                     <td className="border border-stone-700 bg-stone-800 p-1 align-middle w-12">
                        <div className="flex flex-col items-center gap-1 text-[10px] text-stone-400 h-full justify-center">
                           <div className="flex flex-col items-center bg-stone-900 rounded w-full gap-0.5 p-0.5">
                             <button onClick={() => changeRowHeight(rIdx, 20)} className="hover:text-white py-0.5 bg-stone-700 rounded w-full">+</button>
                             <button onClick={() => changeRowHeight(rIdx, -20)} className="hover:text-white py-0.5 bg-stone-700 rounded w-full">-</button>
                           </div>
                           <button onClick={() => removeRow(rIdx)} className="text-stone-500 hover:text-red-400 mt-1"><Trash2 size={12}/></button>
                        </div>
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

const NoteWidget = ({ widget, updateWidget }) => {
  const [showToolbar, setShowToolbar] = useState(false);
  // Security fallback if pages array doesn't exist in older saves
  const pages = widget.pages || [{ id: Date.now() + Math.random(), title: 'Pág 1', content: '' }];
  const activePage = pages.find(p => p.id === widget.activePageId) || pages[0];
  
  const addPage = () => {
    const newPage = { id: Date.now() + Math.random(), title: `Pág ${pages.length + 1}`, content: '' };
    updateWidget(widget.id, { pages: [...pages, newPage], activePageId: newPage.id });
  };
  
  const updatePageTitle = (pageId, newTitle) => {
    updateWidget(widget.id, { pages: pages.map(p => p.id === pageId ? { ...p, title: newTitle } : p) });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex bg-stone-900 rounded-t-lg border-b border-stone-700 p-1 justify-between items-center gap-1">
        <div className="flex overflow-x-auto custom-scrollbar gap-1 flex-1">
          {pages.map(page => (
            <div 
              key={page.id} onClick={() => updateWidget(widget.id, { activePageId: page.id })}
              className={`flex items-center gap-1 px-2 py-1 text-sm rounded cursor-pointer group whitespace-nowrap ${widget.activePageId === page.id ? 'bg-stone-700 theme-text' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}
            >
              <input type="text" value={page.title || ''} onChange={e => updatePageTitle(page.id, e.target.value)} className="bg-transparent outline-none w-20 text-center font-bold" onClick={e => e.stopPropagation()} />
              {pages.length > 1 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const newPages = pages.filter(p => p.id !== page.id);
                    updateWidget(widget.id, { pages: newPages, activePageId: widget.activePageId === page.id ? newPages[0].id : widget.activePageId });
                  }} 
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 ml-1"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addPage} className="px-2 py-1 text-stone-400 hover:theme-text flex-shrink-0"><FilePlus size={16} /></button>
        </div>
        <button onClick={() => setShowToolbar(!showToolbar)} className={`px-2 py-1 rounded flex items-center gap-1 transition-colors text-xs flex-shrink-0 ${showToolbar ? 'bg-[var(--theme-main)] text-stone-900 font-bold' : 'text-stone-400 hover:text-white hover:bg-stone-800'}`}>
          <Palette size={12}/> {showToolbar ? 'Ocultar' : 'Formatar'}
        </button>
      </div>
      {showToolbar && (
        <div className="flex gap-2 p-1 bg-stone-800 border-b border-stone-700 flex-wrap items-center">
          <button onPointerDown={(e) => { e.preventDefault(); document.execCommand('bold', false, null); }} className="p-1 hover:bg-stone-700 rounded text-stone-300"><Bold size={14} /></button>
          <button onPointerDown={(e) => { e.preventDefault(); document.execCommand('italic', false, null); }} className="p-1 hover:bg-stone-700 rounded text-stone-300"><Italic size={14} /></button>
          <button onPointerDown={(e) => { e.preventDefault(); document.execCommand('formatBlock', false, 'H2'); }} className="p-1 hover:bg-stone-700 rounded text-stone-300" title="Criar Título"><Heading size={14} /></button>
          
          <div className="w-px h-4 bg-stone-600 mx-1"></div>
          
          <select 
            onChange={(e) => { document.execCommand('fontSize', false, e.target.value); e.target.value = "0"; }} 
            className="bg-stone-900 border border-stone-700 text-stone-300 text-xs rounded px-1 py-0.5 outline-none cursor-pointer"
            title="Tamanho do Texto Selecionado"
          >
            <option value="0">Tamanho...</option>
            <option value="1">Micro</option>
            <option value="2">Pequeno</option>
            <option value="3">Normal</option>
            <option value="4">Grande</option>
            <option value="5">Enorme</option>
            <option value="6">Gigante</option>
            <option value="7">Titânico</option>
          </select>

          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded border border-stone-700">
            <span className="text-stone-400 px-1 font-bold text-xs">Cor:</span>
            <input type="color" onChange={(e) => document.execCommand('foreColor', false, e.target.value)} className="w-5 h-5 bg-transparent rounded cursor-pointer" title="Cor do Texto Selecionado" />
          </div>
        </div>
      )}
      <div 
        className="flex-1 w-full bg-stone-900 p-3 rounded-b-lg text-sm text-stone-200 outline-none overflow-y-auto"
        contentEditable suppressContentEditableWarning
        onBlur={(e) => updateWidget(widget.id, { pages: pages.map(p => p.id === activePage.id ? { ...p, content: e.currentTarget.innerHTML } : p) })}
        dangerouslySetInnerHTML={{ __html: activePage.content || '' }}
      />
    </div>
  );
};

const ImageWidget = ({ widget, updateWidget }) => {
  const [showTools, setShowTools] = useState(false);
  
  return (
    <div className="flex flex-col h-full w-full rounded overflow-hidden relative">
      <div className="flex justify-between items-center p-1 bg-stone-950 border-b border-stone-700 text-xs gap-1 flex-wrap">
        <button onClick={() => setShowTools(!showTools)} className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${showTools ? 'bg-[var(--theme-main)] text-stone-900 font-bold' : 'text-stone-400 hover:text-white hover:bg-stone-800'}`}>
          <ImageIcon size={12}/> {showTools ? 'Ocultar Origem' : 'Mudar Imagem'}
        </button>
        <div className="flex items-center bg-stone-800 rounded px-1 gap-1 ml-auto">
          <span className="text-stone-500 text-[10px] uppercase font-bold mr-1 hidden md:inline">Zoom</span>
          <button onClick={()=> updateWidget(widget.id, {imageScale: Math.max(10, (widget.imageScale || 100) - 10)})} className="hover:text-white px-1.5 py-0.5 bg-stone-700 rounded font-bold">-</button>
          <span className="w-10 text-center font-bold text-stone-300">{widget.imageScale || 100}%</span>
          <button onClick={()=> updateWidget(widget.id, {imageScale: Math.min(500, (widget.imageScale || 100) + 10)})} className="hover:text-white px-1.5 py-0.5 bg-stone-700 rounded font-bold">+</button>
        </div>
      </div>
      
      {showTools && (
        <div className="flex items-center p-1 bg-stone-900 border-b border-stone-800 text-xs gap-1 flex-wrap">
          <div className="flex flex-1 gap-1 min-w-[150px]">
            <input type="text" value={widget.imageUrlInput || ''} onChange={(e)=> updateWidget(widget.id, {imageUrlInput: e.target.value})} placeholder="URL da imagem..." className="flex-1 bg-stone-950 border border-stone-700 px-2 rounded outline-none placeholder-stone-600 focus:border-[var(--theme-main)]"/>
            <button onClick={()=> updateWidget(widget.id, {imageData: widget.imageUrlInput})} className="px-3 py-1 bg-stone-700 hover:bg-stone-600 rounded text-stone-200 font-bold">OK</button>
          </div>
          <label className="px-3 py-1 bg-stone-700 hover:bg-stone-600 rounded cursor-pointer flex items-center gap-1 font-bold text-stone-200">
            <FolderOpen size={12} /> Local
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if(file) {
                const reader = new FileReader();
                reader.onloadend = () => updateWidget(widget.id, { imageData: reader.result });
                reader.readAsDataURL(file);
              }
            }} className="hidden" />
          </label>
        </div>
      )}
      
      <div className="flex-1 overflow-auto custom-scrollbar relative flex items-center justify-center p-2 bg-stone-900/50">
        {widget.imageData ? (
          <img src={widget.imageData} alt="Mapa/Arte" style={{ width: `${widget.imageScale || 100}%`, minWidth: `${widget.imageScale || 100}%`, transition: 'width 0.2s ease-out' }} className="max-w-none" />
        ) : (
          <span className="text-stone-500 text-xs text-center flex flex-col items-center gap-2">
            <ImageIcon size={32} className="opacity-50" />
            Clique em "Mudar Imagem" para carregar
          </span>
        )}
      </div>
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
    theme: 'amber', bgType: 'none', bgValue: '#1c1917', opacity: 30, fontSize: 16 
  });
  
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templatePassword, setTemplatePassword] = useState('');
  const [templateImage, setTemplateImage] = useState(null);
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' });
  const [search, setSearch] = useState('');
  
  const UNIVERSAL_PASS = "71996813993";

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dmscreen_layout');
      if (saved) setWidgets(JSON.parse(saved));
      const savedTemplates = localStorage.getItem('dmscreen_templates');
      if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
      const savedSettings = localStorage.getItem('dmscreen_settings');
      if (savedSettings) setAppSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.warn("Could not load previous settings from cache.", e);
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
      id: Date.now() + Math.random(), type, title: type.charAt(0).toUpperCase() + type.slice(1),
      x: 50 + offset, y: 50 + offset, zIndex: topZ + 1,
      width: 350, height: 300, isLocked: false
    };
    
    if (type === 'note') {
      newWidget.title = 'Anotações';
      newWidget.pages = [{ id: Date.now() + Math.random(), title: 'Nova Página', content: '' }];
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
      newWidget.imageScale = 100;
      newWidget.imageUrlInput = '';
    } else if (type === 'table') {
      newWidget.title = 'Tabela';
      newWidget.rows = [['', ''], ['', '']];
    }
    
    setWidgets([...widgets, newWidget]);
    setTopZ(topZ + 1);
  };

  const saveTemplate = (existingId = null) => {
    if (!existingId && !templateName.trim()) {
      setModalMessage({ type: 'error', text: 'Digite um nome para o modelo.' });
      return;
    }
    try {
      let updatedTemplates = [...templates];
      if (existingId) {
        const existing = updatedTemplates.find(t => t.id === existingId);
        if (existing.password && existing.password !== UNIVERSAL_PASS) {
          const pass = prompt("Este modelo está protegido. Digite a senha para sobrescrever:");
          if (pass !== existing.password && pass !== UNIVERSAL_PASS) {
            alert("Senha Incorreta!"); return;
          }
        }
        existing.widgets = widgets;
        existing.topZ = topZ;
        existing.date = new Date().toLocaleDateString();
      } else {
        const newTemplate = {
          id: Date.now() + Math.random(),
          name: templateName, password: templatePassword, image: templateImage,
          widgets: widgets, topZ: topZ, date: new Date().toLocaleDateString()
        };
        updatedTemplates.push(newTemplate);
      }
      localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
      setModalMessage({ type: 'success', text: 'Modelo salvo com sucesso!' });
      setTimeout(() => setModalMessage({ type: '', text: '' }), 3000);
      setTemplateName(''); setTemplatePassword(''); setTemplateImage(null);
    } catch (error) {
      setModalMessage({ type: 'error', text: 'Erro ao salvar. Pode ser que imagens estejam acima do limite do navegador.' });
    }
  };

  const loadTemplate = (id) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      if (template.password && template.password !== UNIVERSAL_PASS) {
        const pass = prompt("Este modelo requer senha:");
        if (pass !== template.password && pass !== UNIVERSAL_PASS) {
          alert("Senha incorreta!"); return;
        }
      }
      setWidgets(template.widgets || []);
      setTopZ(template.topZ || 10);
      setShowTemplateModal(false);
    }
  };

  const deleteTemplate = (id) => {
    const template = templates.find(t => t.id === id);
    if (template.password && template.password !== UNIVERSAL_PASS) {
      const pass = prompt("Este modelo requer senha para ser deletado:");
      if (pass !== template.password && pass !== UNIVERSAL_PASS) {
        alert("Senha incorreta!"); return;
      }
    }
    const updatedTemplates = templates.filter(t => t.id !== id);
    localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  const exportAllTemplates = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `dmscreen_backup.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click(); downloadAnchorNode.remove();
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
          alert('Modelos importados com sucesso!');
        }
      } catch (err) { alert('Arquivo inválido.'); }
    };
    reader.readAsText(file);
  };

  const renderDiceWidget = (widget) => {
    const roll = (sides) => {
      const q = parseInt(widget.qty) || 1;
      const m = parseInt(widget.mod) || 0;
      let sum = 0; let results = [];
      for(let i=0; i<q; i++) { const val = Math.floor(Math.random() * sides) + 1; sum += val; results.push(val); }
      const total = sum + m;
      const histStr = `${q}d${sides}${m !== 0 ? (m > 0 ? '+'+m : m) : ''} ➔ ${total} [${results.join(',')}]`;
      updateWidget(widget.id, { result: total, history: [histStr, ...(widget.history || [])].slice(0, 5) });
    };

    return (
      <div className="flex flex-col items-center h-full gap-2 relative">
        <div className="text-5xl font-black theme-text bg-stone-950 w-full text-center py-4 rounded border border-stone-700 flex-1 flex items-center justify-center shadow-inner">
          {widget.result || '---'}
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
            <button key={d} onClick={() => roll(d)} className="bg-stone-700 hover:bg-stone-600 transition-colors px-2 py-2 rounded font-bold border border-stone-600 flex-1 min-w-[35px] text-center text-xs shadow">D{d}</button>
          ))}
        </div>

        <div className="w-full text-[10px] text-stone-500 bg-stone-950 p-1 rounded overflow-hidden max-h-16 overflow-y-auto custom-scrollbar">
          {(widget.history || []).map((h, i) => <div key={i} className="truncate">{h}</div>)}
        </div>
      </div>
    );
  };

  const currentTheme = THEMES[appSettings.theme] || THEMES.amber;
  const fontSize = appSettings.fontSize || 16;
  const bgOpacity = appSettings.opacity || 30;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden text-stone-100 font-sans w-full h-full m-0 p-0" style={{ '--theme-main': currentTheme.main, backgroundColor: currentTheme.bg }}>
      
      {appSettings.bgType === 'image' && <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${appSettings.bgValue})`, opacity: bgOpacity / 100 }} />}
      {appSettings.bgType === 'video' && (
        <video autoPlay loop muted className="absolute inset-0 z-0 w-full h-full object-cover" style={{ opacity: bgOpacity / 100 }}>
          <source src={appSettings.bgValue} type="video/mp4" />
        </video>
      )}

      <header className="flex flex-col md:flex-row justify-between items-center bg-stone-950/90 p-3 border-b border-stone-700 z-50 flex-shrink-0 shadow-md gap-3 backdrop-blur-sm">
        <h1 className="text-xl font-bold theme-text flex items-center gap-2 select-none"><Layout size={20} /> DM SCREEN</h1>
        
        <div className="flex flex-wrap justify-center gap-1.5 flex-1">
          <button onClick={() => addWidget('note')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><FileText size={14} /> Nota</button>
          <button onClick={() => addWidget('dice')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><Dices size={14} /> Dados</button>
          <button onClick={() => addWidget('initiative')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><Swords size={14} /> Init</button>
          <button onClick={() => addWidget('links')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><Link2 size={14} /> Links</button>
          <button onClick={() => addWidget('image')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><ImageIcon size={14} /></button>
          <button onClick={() => addWidget('table')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><TableIcon size={14} /></button>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1 bg-stone-900 rounded border border-stone-700 p-0.5">
            <button onClick={() => setAppSettings({...appSettings, fontSize: Math.max(12, fontSize - 1)})} className="p-1.5 text-stone-400 hover:text-white transition-colors" title="Diminuir Fonte"><Minus size={14} /></button>
            <Type size={14} className="text-stone-500" />
            <button onClick={() => setAppSettings({...appSettings, fontSize: Math.min(24, fontSize + 1)})} className="p-1.5 text-stone-400 hover:text-white transition-colors" title="Aumentar Fonte"><Plus size={14} /></button>
          </div>

          <button onClick={() => setIsMobileMode(!isMobileMode)} className={`p-2 rounded border transition-colors ${isMobileMode ? 'bg-[var(--theme-main)] border-[var(--theme-main)] text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-400'}`} title="Modo Mobile">
            <Smartphone size={16} />
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="p-2 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 text-stone-400 transition-colors" title="Configurações">
            <Settings size={16} />
          </button>
          <button onClick={() => setShowTemplateModal(true)} className="bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors px-3 py-1.5 rounded flex items-center gap-2 border border-stone-600 text-xs font-bold">
            <FolderOpen size={14} className="theme-text" /> <span className="hidden md:inline">Layouts</span>
          </button>
        </div>
      </header>

      <main className="relative flex-1 w-full overflow-hidden z-10" id="desktop-area">
        {widgets.map((widget) => (
          <WidgetCard key={widget.id} widget={widget} updateWidget={updateWidget} removeWidget={removeWidget} bringToFront={bringToFront} isMobileMode={isMobileMode}>
            {widget.type === 'note' && <NoteWidget widget={widget} updateWidget={updateWidget} />}
            {widget.type === 'dice' && renderDiceWidget(widget)}
            {widget.type === 'initiative' && <InitiativeWidget widget={widget} updateWidget={updateWidget} isMobileMode={isMobileMode} />}
            {widget.type === 'links' && <LinksWidget widget={widget} updateWidget={updateWidget} isMobileMode={isMobileMode} />}
            {widget.type === 'image' && <ImageWidget widget={widget} updateWidget={updateWidget} />}
            {widget.type === 'table' && <TableWidget widget={widget} updateWidget={updateWidget} />}
          </WidgetCard>
        ))}
      </main>

      <footer className="flex items-center gap-2 bg-stone-950 border-t border-stone-700 px-2 py-1 overflow-x-auto z-50 flex-shrink-0 custom-scrollbar">
        <div className="text-[10px] font-bold text-stone-500 uppercase px-2">Janelas: {widgets.length}</div>
        {widgets.map(w => (
          <button key={`task-${w.id}`} onClick={() => bringToFront(w.id)} className="px-3 py-1 bg-stone-800 hover:bg-stone-700 rounded text-xs font-bold border border-stone-700 truncate max-w-[120px] transition-colors theme-text">
            {w.title}
          </button>
        ))}
      </footer>

      {showSettingsModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-stone-900 border border-stone-600 rounded-lg shadow-2xl w-full max-w-sm p-4 flex flex-col gap-3 max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-stone-700 pb-2">
              <h2 className="text-sm font-bold theme-text flex items-center gap-2"><Settings size={16}/> Configurações</h2>
              <button onClick={() => { setShowSettingsModal(false); localStorage.setItem('dmscreen_settings', JSON.stringify(appSettings)); }} className="text-red-400"><X size={16}/></button>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-stone-400 uppercase">Tema de Cores</label>
              <div className="flex gap-2">
                {Object.keys(THEMES).map(t => (
                  <button key={t} onClick={() => setAppSettings({...appSettings, theme: t})} className={`w-6 h-6 rounded-full border-2 ${appSettings.theme === t ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: THEMES[t].main }} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase flex items-center justify-between">
                Fundo de Tela
                <div className="flex items-center gap-2 text-stone-200">
                  <span className="text-[9px]">Opacidade</span>
                  <input type="range" min="10" max="100" value={bgOpacity} onChange={e => setAppSettings({...appSettings, opacity: e.target.value})} className="w-16"/>
                </div>
              </label>
              <select value={appSettings.bgType} onChange={e => setAppSettings({...appSettings, bgType: e.target.value})} className="bg-stone-950 border border-stone-700 rounded p-1.5 text-xs text-stone-200 outline-none">
                <option value="none">Cor Sólida do Tema</option>
                <option value="image">Imagem (URL)</option>
                <option value="video">Vídeo / GIF (URL)</option>
              </select>
              {appSettings.bgType !== 'none' && (
                <input type="text" value={appSettings.bgValue || ''} onChange={e => setAppSettings({...appSettings, bgValue: e.target.value})} placeholder="URL do arquivo..." className="bg-stone-950 border border-stone-700 rounded p-1.5 text-xs outline-none w-full" />
              )}
            </div>

            <div className="w-full h-px bg-stone-700 my-1"></div>
            
            <div className="flex flex-col gap-1 overflow-hidden">
              <h3 className="text-xs font-bold theme-text">Sobre o DM Screen</h3>
              <div className="bg-stone-950 border border-stone-700 p-2 rounded text-[10px] text-stone-400 flex flex-col gap-1 max-h-32 overflow-y-auto custom-scrollbar">
                <div className="border-b border-stone-800 pb-1 mb-1">
                  <strong className="text-stone-200">DM lite Alpha 0.2.3v</strong>
                </div>
                <p className="italic leading-relaxed mb-1">Primeira versão aberta definitiva. Funções básicas de escudo:</p>
                <ul className="list-disc list-inside leading-relaxed text-stone-300 space-y-0.5">
                  <li>Anotações flexíveis com formatação</li>
                  <li>Dados (modificadores, qtde e histórico)</li>
                  <li>Iniciativa Tracker de combate</li>
                  <li>Anexo de links para fácil acesso</li>
                  <li>Importação de imagens com Zoom</li>
                  <li>Tabela/planilhas formatáveis</li>
                  <li>Suporte básico para mobile (trava e redimensionamento)</li>
                  <li>Ajuste dinâmico de fontes globais</li>
                  <li>Customização básica do escudo (temas e fundos)</li>
                  <li>Sistema de janelas com Lock ON/OFF</li>
                  <li>Correção de bugs e estabilidade de cache</li>
                </ul>
                <div className="mt-2 pt-1 border-t border-stone-800 flex flex-col gap-0.5">
                  <span>Criado por Dev <strong className="text-stone-200">Nicck Queijo</strong></span>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="flex items-center gap-1">📱 Telegram: <strong className="text-stone-200">@ralseibaiano</strong></span>
                    <span className="flex items-center gap-1">🎮 Discord: <strong className="text-stone-200">inabakaoru</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-stone-900 border border-stone-600 rounded-lg shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-stone-700 bg-stone-950">
              <h2 className="text-lg font-bold theme-text flex items-center gap-2"><Save size={20} /> Modelos de Escudo</h2>
              <button onClick={() => setShowTemplateModal(false)} className="text-stone-400 hover:text-red-400"><X size={20} /></button>
            </div>
            
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-2 bg-stone-950 p-3 rounded border border-stone-700">
                <label className="text-xs font-bold text-stone-400 uppercase">Salvar Novo Modelo</label>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer bg-stone-800 p-2 rounded hover:bg-stone-700 transition" title="Imagem de Capa">
                    {templateImage ? <img src={templateImage} className="w-8 h-8 rounded object-cover" alt="capa" /> : <ImagePlus size={24} className="text-stone-500"/>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const f = e.target.files[0]; if(f) { const r = new FileReader(); r.onloadend = () => setTemplateImage(r.result); r.readAsDataURL(f); }
                    }}/>
                  </label>
                  <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Nome do Layout" className="flex-1 bg-stone-800 border border-stone-600 rounded px-2 py-2 text-sm outline-none" />
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-2 top-3 text-stone-500" />
                    <input type="password" value={templatePassword} onChange={(e) => setTemplatePassword(e.target.value)} placeholder="Senha (Opcional)" className="w-32 bg-stone-800 border border-stone-600 rounded pl-7 pr-2 py-2 text-sm outline-none" />
                  </div>
                  <button onClick={() => saveTemplate(null)} className="bg-[var(--theme-main)] text-stone-900 font-bold px-3 py-2 rounded text-sm hover:opacity-80">Salvar</button>
                </div>
                {modalMessage.text && (
                  <div className={`text-xs p-2 rounded mt-1 font-bold flex items-center gap-1 ${modalMessage.type === 'error' ? 'text-red-400 bg-red-950/50' : 'text-green-400 bg-green-950/50'}`}>
                    {modalMessage.text}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="relative w-1/2">
                  <Search size={14} className="absolute left-2 top-2 text-stone-500" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar..." className="w-full bg-stone-950 border border-stone-700 rounded pl-7 pr-2 py-1 text-xs outline-none" />
                </div>
                <div className="flex gap-2">
                   <label className="cursor-pointer text-[10px] bg-stone-800 hover:bg-stone-700 px-2 py-1 rounded text-stone-300 font-bold flex items-center gap-1">
                     <Upload size={12}/> Importar Backup
                     <input type="file" accept=".json" onChange={importTemplates} className="hidden" />
                   </label>
                   <button onClick={exportAllTemplates} className="text-[10px] bg-stone-800 hover:bg-stone-700 px-2 py-1 rounded text-stone-300 font-bold flex items-center gap-1">
                     <Download size={12}/> Exportar Backup
                   </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {templates.filter(t => (t.name || '').toLowerCase().includes(search.toLowerCase())).map(t => (
                  <div key={t.id} className="flex items-center justify-between bg-stone-800 border border-stone-700 p-2 rounded group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {t.image ? <img src={t.image} className="w-10 h-10 rounded object-cover flex-shrink-0" alt="" /> : <div className="w-10 h-10 rounded bg-stone-900 flex items-center justify-center flex-shrink-0"><Layout size={16} className="text-stone-600"/></div>}
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-stone-200 flex items-center gap-1">
                          {t.name} {t.password && <Lock size={12} className="text-[var(--theme-main)]"/>}
                        </span>
                        <span className="text-[10px] text-stone-500">{t.date} • {(t.widgets || []).length} janelas</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => saveTemplate(t.id)} className="p-2 text-stone-400 hover:text-blue-400 hover:bg-stone-700 rounded transition-colors" title="Atualizar (Sobrescrever)">
                        <RefreshCw size={14} />
                      </button>
                      <button onClick={() => loadTemplate(t.id)} className="px-3 py-1.5 bg-stone-700 hover:bg-[var(--theme-main)] hover:text-stone-900 text-stone-200 rounded text-xs font-bold transition-colors">
                        Carregar
                      </button>
                      <button onClick={() => deleteTemplate(t.id)} className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-700 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        html { font-size: ${fontSize}px !important; }
        .theme-text { color: var(--theme-main); }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #44403c; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--theme-main); }
      `}} />
    </div>
  );
};

export default App;
