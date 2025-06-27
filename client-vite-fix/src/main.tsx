import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GA_ID } from './config/monitoring';
// import 'antd/dist/reset.css'; // SUPPRIMÉ - trop lourd
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
if (window && window.localStorage && !window.localStorage.getItem('purge_done')) {
  window.localStorage.clear();
  window.localStorage.setItem('purge_done', '1');
  window.location.reload();
} 