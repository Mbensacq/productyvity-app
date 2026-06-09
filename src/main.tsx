import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { installGlobalErrorHandlers } from './lib/logger';
import './index.css';

installGlobalErrorHandlers();

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
