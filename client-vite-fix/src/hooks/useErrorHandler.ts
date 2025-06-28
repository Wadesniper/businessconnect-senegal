import { useEffect } from 'react';
import { message } from 'antd';
import VersionService from '../services/versionService';

export const useErrorHandler = () => {
  useEffect(() => {
    // Gestionnaire d'erreurs globales
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Erreur globale détectée:', event.error);
      
      // Détecter les erreurs de chargement de modules (mise à jour)
      if (event.error?.message?.includes('ChunkLoadError') || 
          event.error?.message?.includes('Loading chunk') ||
          event.error?.message?.includes('Unexpected token')) {
        
        message.warning('Une mise à jour est disponible. Rechargement automatique...');
        
        setTimeout(() => {
          VersionService.getInstance().performUpdate();
        }, 2000);
        
        return;
      }
      
      // Détecter les erreurs de compatibilité
      if (event.error?.message?.includes('Cannot read property') ||
          event.error?.message?.includes('is not a function')) {
        
        console.warn('Erreur de compatibilité détectée');
        VersionService.getInstance().forceCheck();
      }
    };

    // Gestionnaire pour les promesses rejetées
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Promesse rejetée non gérée:', event.reason);
      
      // Détecter les erreurs de réseau
      if (event.reason?.code === 'NETWORK_ERROR' || 
          event.reason?.message?.includes('fetch')) {
        
        message.error('Problème de connexion. Vérification de la version...');
        VersionService.getInstance().forceCheck();
      }
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Nettoyer les écouteurs
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}; 