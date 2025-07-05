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

// Enregistrement du Service Worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

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

// Gestion automatique des erreurs critiques de chargement (zéro régression)
window.addEventListener('error', (event) => {
  if (event?.error && typeof event.error.message === 'string') {
    if (
      event.error.message.includes('ChunkLoadError') ||
      event.error.message.includes('Loading chunk') ||
      event.error.message.includes('Unexpected token') ||
      event.error.message.includes('Failed to fetch') ||
      event.error.message.includes('NetworkError') ||
      event.error.message.includes('dynamically imported module') ||
      event.error.message.includes('import()') ||
      event.error.message.includes('Module not found')
    ) {
      console.error('Erreur de chargement détectée:', event.error.message);
      // Empêcher l'affichage de l'erreur à l'utilisateur
      event.preventDefault();
      // Attendre un peu avant de recharger pour éviter les boucles
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
});

// Gestion des erreurs de réseau et imports dynamiques
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && typeof event.reason.message === 'string') {
    if (
      event.reason.message.includes('Failed to fetch') ||
      event.reason.message.includes('NetworkError') ||
      event.reason.message.includes('ChunkLoadError') ||
      event.reason.message.includes('dynamically imported module') ||
      event.reason.message.includes('import()') ||
      event.reason.message.includes('Module not found') ||
      event.reason.message.includes('Loading chunk')
    ) {
      console.error('Erreur réseau/import détectée:', event.reason.message);
      // Empêcher l'affichage de l'erreur à l'utilisateur
      event.preventDefault();
      // Attendre un peu avant de recharger
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }
}); 