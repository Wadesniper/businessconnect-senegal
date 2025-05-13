import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';

// Mock react-spring pour éviter les erreurs d'animation en test
jest.mock('react-spring', () => ({
  useSpring: () => ({ number: { to: (fn: any) => 0 } }),
  animated: { span: (props: any) => <span>{props.children || 0}</span> }
}));

// Mock des services pour éviter les appels réseau
jest.mock('../services/jobService', () => ({
  JobService: { getJobs: () => Promise.resolve([
    { id: '1', title: 'Développeur', company: 'Sénégal Tech', location: 'Dakar', createdAt: new Date().toISOString() },
    { id: '2', title: 'Designer', company: 'DesignPro', location: 'Thiès', createdAt: new Date().toISOString() },
    { id: '3', title: 'Chef de projet', company: 'ProjetX', location: 'Saint-Louis', createdAt: new Date().toISOString() }
  ]) }
}));
jest.mock('../services/marketplaceService', () => ({
  marketplaceService: { getItems: () => Promise.resolve([
    { id: '1', title: 'Coaching', contactInfo: { email: 'coach@mail.com' }, location: 'Dakar' },
    { id: '2', title: 'Traduction', contactInfo: { email: 'trad@mail.com' }, location: 'Kaolack' },
    { id: '3', title: 'Rédaction', contactInfo: { email: 'redac@mail.com' }, location: 'Ziguinchor' }
  ]) }
}));

describe('Page d\'accueil (Home)', () => {
  beforeEach(async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    // Attendre le rendu asynchrone
    await screen.findByText('Offres d\'emploi récentes');
  });

  it('affiche le Hero avec le titre principal', () => {
    expect(screen.getByText(/plateforme n°1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /découvrir nos services/i })).toBeInTheDocument();
  });

  it('affiche les 3 dernières offres d\'emploi', async () => {
    expect(await screen.findAllByTestId('job-preview')).toHaveLength(3);
    expect(await screen.findAllByRole('button', { name: /voir toutes les offres/i })).toHaveLength(3);
  });

  it('affiche le bouton "Créer mon CV maintenant"', () => {
    expect(screen.getByRole('button', { name: /créer mon cv professionnel/i })).toBeInTheDocument();
  });

  it('affiche le carrousel des secteurs', async () => {
    jest.doMock('antd', () => {
      const antd = jest.requireActual('antd');
      return {
        ...antd,
        Carousel: ({ children, ...props }: any) => <div data-testid={props['data-testid']}>{children}</div>,
      };
    });
    expect(await screen.findByTestId('sector-carousel')).toBeInTheDocument();
  });

  // it('affiche les 4 cartes statistiques', () => {
  //   expect(screen.getAllByTestId('stat-card')).toHaveLength(4);
  // });
}); 