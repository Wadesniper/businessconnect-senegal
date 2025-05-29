import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GA_ID } from './config/monitoring';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import frFR from 'antd/locale/fr_FR';
import { AuthProvider } from './context/AuthContext';

// Google Analytics (gtag.js)
declare global {
  interface Window { dataLayer: any[]; gtag: (...args: any[]) => void; }
}

function gtag(...args: any[]) {
  window.dataLayer.push(args);
}

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() { return false; }
    };
  };
}

console.log('Démarrage de l’application React');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log('Avant le rendu ReactDOM');
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ConfigProvider locale={frFR}>
        <App />
      </ConfigProvider>
    </AuthProvider>
  </React.StrictMode>
);
console.log('Après le rendu ReactDOM');

// Purge automatique du localStorage au premier chargement pour forcer la reconnexion propre
if (window && window.localStorage && !window.localStorage.getItem('purge_done')) {
  window.localStorage.clear();
  window.localStorage.setItem('purge_done', '1');
  window.location.reload();
} 