import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MarketplacePage from './MarketplacePage';

// Mock du service marketplace
jest.mock('../../services/marketplaceService', () => ({
  marketplaceService: {
    getItems: jest.fn(() => Promise.resolve([
      {
        id: '1',
        title: 'PC Portable',
        description: 'Ordinateur performant',
        price: 250000,
        location: 'Dakar',
        category: 'Informatique',
        images: ['https://via.placeholder.com/200'],
        userId: 'user1',
        contactInfo: { email: 'vendeur@mail.com', phone: '771234567' },
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Service de traduction',
        description: 'Traduction pro',
        price: 5000,
        location: 'Kaolack',
        category: 'Services',
        images: [],
        userId: 'user2',
        contactInfo: { email: 'trad@mail.com', phone: '' },
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    ])),
    createItem: jest.fn(),
    uploadImage: jest.fn(),
  },
}));

// Mock des hooks d'auth et d'abonnement
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user1', email: 'test@mail.com' } }),
}));
jest.mock('../../hooks/useSubscription', () => ({
  useSubscription: () => ({ hasActiveSubscription: true, loading: false, subscription: { isActive: true, expiresAt: new Date().toISOString() } }),
}));

// Mock du service d'auth
jest.mock('../../services/authService', () => ({
  authService: {
    getCurrentUser: () => ({ id: 'user1', email: 'test@mail.com' }),
    getCurrentUserSubscription: () => ({ isActive: true, expiresAt: new Date().toISOString() }),
    renewCurrentUserSubscription: jest.fn(),
    expireCurrentUserSubscription: jest.fn(),
  },
}));

describe('MarketplacePage', () => {
  it('affiche les annonces et les filtres', async () => {
    render(
      <BrowserRouter>
        <MarketplacePage />
      </BrowserRouter>
    );
    // Attendre le chargement
    expect(await screen.findByText('PC Portable')).toBeInTheDocument();
    expect(screen.getByText('Service de traduction')).toBeInTheDocument();
    // Vérifier la présence des filtres
    expect(screen.getByPlaceholderText('Catégorie')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Localisation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Rechercher...')).toBeInTheDocument();
  });

  // Note : l'interaction avec le Select Ant Design (filtrage) n'est pas testable en Jest/JSDOM avec AntD 5+ sans mock complexe.
  // Ce comportement doit être validé par des tests e2e (Cypress) ou manuellement.
}); 