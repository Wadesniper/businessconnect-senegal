import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GA_ID } from './config/monitoring';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import frFR from 'antd/locale/fr_FR';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Google Analytics (gtag.js)
// @ts-ignore
window.dataLayer = window.dataLayer || [];
function gtag(...args: any[]) {
  // @ts-ignore
  window.dataLayer.push(args);
}
gtag('js', new Date());
gtag('config', 'G-N909TR188M');

console.log('Démarrage de l’application React');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log('Avant le rendu ReactDOM');

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider locale={frFR}>
          <App />
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

console.log('Après le rendu ReactDOM');

// Polyfill pour matchMedia
window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

// Purge automatique du localStorage au premier chargement pour forcer la reconnexion propre
// Ne se déclenche qu'une seule fois par session, pas à chaque retour sur le site
if (window && window.localStorage && !window.localStorage.getItem('purge_done')) {
  // Vérifier si c'est vraiment le premier chargement de la session
  const sessionStart = sessionStorage.getItem('session_start');
  if (!sessionStart) {
    // Première visite de la session
    sessionStorage.setItem('session_start', Date.now().toString());
    window.localStorage.clear();
    window.localStorage.setItem('purge_done', '1');
    window.location.reload();
  } else {
    // Session déjà commencée, pas de purge
    window.localStorage.setItem('purge_done', '1');
  }
}

// Gestion automatique des erreurs critiques de chargement (zéro régression)
window.addEventListener('error', (event) => {
  if (event?.error && typeof event.error.message === 'string') {
    if (
      event.error.message.includes('ChunkLoadError') ||
      event.error.message.includes('Loading chunk') ||
      event.error.message.includes('Unexpected token')
    ) {
      window.location.reload();
    }
  }
}); 