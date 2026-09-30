import { createRoot } from 'react-dom/client';
import App from './AppV2.jsx';
import './styles-v2.css';
import './styles-v3.css';
import './styles-v4.css';
import './styles-v5.css';
import './styles-v6.css';
import './styles-v7.css';
import './styles-v8.css';
import { installEnhancements } from './enhancements-v053.js';
import { installEnhancementsV055 } from './enhancements-v055.js';
import { installEnhancementsV056 } from './enhancements-v056.js';

// DM Lite 0.5.3 Alpha — acabamento final antes da publicação principal.
createRoot(document.getElementById('root')).render(<App />);
queueMicrotask(() => {
  installEnhancements();
  installEnhancementsV055();
  installEnhancementsV056();
});
