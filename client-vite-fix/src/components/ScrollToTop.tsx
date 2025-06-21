import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Défilement automatique et instantané vers le haut
    // Force le défilement sur tous les conteneurs possibles
    try {
      // 1. Fenêtre principale - défilement instantané
      window.scrollTo(0, 0);
      
      // 2. Conteneur de contenu Ant Design Pro
      const proLayoutContent = document.querySelector('.ant-pro-layout-content');
      if (proLayoutContent) {
        proLayoutContent.scrollTop = 0;
      }
      
      // 3. Body et HTML pour être sûr
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // 4. Tous les conteneurs avec overflow
      const scrollableElements = document.querySelectorAll('[style*="overflow"], [class*="scroll"]');
      scrollableElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.scrollTop = 0;
        }
      });
      
    } catch (error) {
      console.error('Erreur lors du défilement vers le haut:', error);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop; 