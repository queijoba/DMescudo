import { createRoot } from 'react-dom/client';
import App from './AppV2.jsx';
import './styles-v2.css';
import './styles-v3.css';
import './styles-v4.css';
import { installEnhancements } from './enhancements-v052.js';

createRoot(document.getElementById('root')).render(<App />);
queueMicrotask(installEnhancements);
