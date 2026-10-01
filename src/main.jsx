import { createRoot } from 'react-dom/client';
import App from './AppV2.jsx';
import './styles-v2.css';
import './styles-v3.css';
import './styles-v4.css';
import './styles-v5.css';
import './styles-v6.css';
import './styles-v7.css';
import './styles-v8.css';
import './styles-v9.css';
import './styles-v10.css';
import './styles-v11.css';
import './styles-v12.css';
import './styles-v13.css';
import './styles-v14.css';
import './styles-v15.css';
import './styles-v16.css';
import './styles-v17.css';
import './styles-v18.css';
import { installEnhancements } from './enhancements-v053.js';
import { installEnhancementsV055 } from './enhancements-v055.js';
import { installEnhancementsV056 } from './enhancements-v056.js';
import { installEnhancementsV058 } from './enhancements-v058.js';
import { installEnhancementsV059 } from './enhancements-v059.js';
import { installEnhancementsV060 } from './enhancements-v060.js';
import { installEnhancementsV061 } from './enhancements-v061.js';
import { installEnhancementsV062 } from './enhancements-v062.js';
import { installEnhancementsV064 } from './enhancements-v064.js';
import { installEnhancementsV065 } from './enhancements-v065.js';
import { installEnhancementsV066 } from './enhancements-v066.js';

// A Home é sempre a tela de entrada. Removemos apenas a referência ao último
// escudo aberto; os escudos e todo o conteúdo salvo permanecem intactos.
try {
  localStorage.removeItem('dmlite_last_shield_v2');
  localStorage.removeItem('dmlite_current_shield_v1');
} catch {
  // O app continua normalmente caso o armazenamento esteja bloqueado.
}

// DM Lite 0.5.5 Alpha — contraste mais suave, segundo quadro opcional,
// atalhos e barra de ferramentas fixos no desktop, tema concentrado nos Ajustes
// e novos recursos centralizados em primeiro plano.
createRoot(document.getElementById('root')).render(<App />);
queueMicrotask(() => {
  installEnhancements();
  installEnhancementsV055();
  installEnhancementsV056();
  installEnhancementsV058();
  installEnhancementsV059();
  installEnhancementsV060();
  installEnhancementsV061();
  installEnhancementsV062();
  installEnhancementsV064();
  installEnhancementsV065();
  installEnhancementsV066();
});
