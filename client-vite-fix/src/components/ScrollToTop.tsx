import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      // Force le défilement de la fenêtre principale en haut
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });

      // Trouve et force le défilement du conteneur de contenu de ProLayout
      // C'est la solution robuste pour les layouts Ant Design
      const proLayoutContent = document.querySelector('.ant-pro-layout-content');
      if (proLayoutContent) {
        proLayoutContent.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto',
        });
      }
    } catch (error) {
      console.error('Erreur lors du défilement vers le haut:', error);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop; 