import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update safely
try {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    registerSW({ immediate: true });
  }
} catch (err) {
  console.info('PWA registration skipped in current frame context:', err);
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
