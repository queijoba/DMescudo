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
import { installEnhancements } from './enhancements-v053.js';
import { installEnhancementsV055 } from './enhancements-v055.js';
import { installEnhancementsV056 } from './enhancements-v056.js';
import { installEnhancementsV058 } from './enhancements-v058.js';

// DM Lite 0.5.4 Alpha — versão principal, com migração completa dos saves antigos.
createRoot(document.getElementById('root')).render(<App />);
queueMicrotask(() => {
  installEnhancements();
  installEnhancementsV055();
  installEnhancementsV056();
  installEnhancementsV058();
});
