import React from 'react';

const GlobalFetchError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <div style={{
    color: 'red',
    padding: 40,
    textAlign: 'center',
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <h2>Une erreur réseau est survenue</h2>
    <p style={{ fontSize: 18, margin: '16px 0' }}>
      Impossible de récupérer les données.<br/>
      Veuillez vérifier votre connexion internet ou réessayer.
    </p>
    <button
      style={{
        marginTop: 24,
        padding: '10px 24px',
        fontSize: 18,
        background: '#1890ff',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer'
      }}
      onClick={onRetry || (() => window.location.reload())}
    >
      Réessayer
    </button>
    <div style={{marginTop: 24, fontSize: 16, color: '#333'}}>
      Si le problème persiste, essayez de vous connecter sur un autre appareil<br/>
      ou contactez le support à l'adresse <b>contact@businessconnectsenegal.com</b>.
    </div>
  </div>
);

export default GlobalFetchError; 