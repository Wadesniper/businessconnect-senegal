import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CGU from '../CGU';
import CGV from '../CGV';
import MentionsLegales from '../MentionsLegales';
import Privacy from '../Privacy';
import Cookies from '../Cookies';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Pages Légales', () => {
  describe('CGU', () => {
    it('affiche le contenu des CGU', () => {
      renderWithRouter(<CGU />);
      expect(screen.getByText(/Conditions Générales d'Utilisation/i)).toBeInTheDocument();
    });
  });

  describe('CGV', () => {
    it('affiche le contenu des CGV', () => {
      renderWithRouter(<CGV />);
      expect(screen.getByText(/Conditions Générales de Vente/i)).toBeInTheDocument();
    });
  });

  describe('Mentions Légales', () => {
    it('affiche les mentions légales', () => {
      renderWithRouter(<MentionsLegales />);
      expect(screen.getByText(/Mentions Légales/i)).toBeInTheDocument();
    });
  });

  describe('Politique de confidentialité', () => {
    it('affiche la politique de confidentialité', () => {
      renderWithRouter(<Privacy />);
      expect(screen.getByText(/Politique de Confidentialité/i)).toBeInTheDocument();
    });
  });

  describe('Politique des cookies', () => {
    it('affiche la politique des cookies', () => {
      renderWithRouter(<Cookies />);
      expect(screen.getByText(/Politique des Cookies/i)).toBeInTheDocument();
    });
  });
}); 