import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';

console.log('!!! СВЯЗЬ С БРАУЗЕРОМ ЕСТЬ !!!');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
