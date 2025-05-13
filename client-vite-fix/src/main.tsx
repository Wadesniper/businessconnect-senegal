import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GA_ID } from './config/monitoring';
import 'antd/dist/reset.css';

// Google Analytics (gtag.js)
declare global {
  interface Window { dataLayer: any[]; gtag: (...args: any[]) => void; }
}

function gtag(...args: any[]) {
  window.dataLayer.push(args);
}

if (GA_ID) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag;
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
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
    <App />
  </React.StrictMode>
);
console.log('Après le rendu ReactDOM'); 