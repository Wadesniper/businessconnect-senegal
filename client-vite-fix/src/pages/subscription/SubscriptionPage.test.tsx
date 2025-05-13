import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import SubscriptionPage from './SubscriptionPage';
import { BrowserRouter } from 'react-router-dom';
import '../../setupTests';
import { AuthProvider } from '../../context/AuthContext';

// Mock du contexte utilisateur
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'user1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@mail.com',
      phoneNumber: '221771234567',
      role: 'etudiant',
      isVerified: true
    },
    isAuthenticated: true,
    loading: false,
    logout: jest.fn()
  })
}));

// Mock d'axios pour éviter tout appel réseau réel
jest.mock('axios', () => {
  const mockAxios: any = {
    post: jest.fn(() => Promise.resolve({ data: { data: { payment_url: 'https://cinetpay.com/test' } } })),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  mockAxios.create = () => mockAxios;
  return mockAxios;
});

describe('SubscriptionPage', () => {
  it('affiche les 3 offres et les boutons S\'abonner', async () => {
    const { container } = render(
      <AuthProvider>
        <BrowserRouter>
          <SubscriptionPage />
        </BrowserRouter>
      </AuthProvider>
    );
    // Log du DOM pour debug
    // eslint-disable-next-line no-console
    console.log(container.innerHTML);
    // Vérifie la présence des titres
    expect(await screen.findByText(/Étudiant/)).toBeInTheDocument();
    expect(await screen.findByText(/Annonceur/)).toBeInTheDocument();
    expect(await screen.findByText(/Recruteur/)).toBeInTheDocument();
    // Vérifie la présence des prix (tolère les espaces insécables)
    expect(await screen.findByText(/1.?000 FCFA/)).toBeInTheDocument();
    expect(await screen.findByText(/5.?000 FCFA/)).toBeInTheDocument();
    expect(await screen.findByText(/9.?000 FCFA/)).toBeInTheDocument();
    // Vérifie la présence des boutons S'abonner (tolère apostrophe typographique)
    expect(await screen.findAllByRole('button', { name: /s.?abonner/i })).toHaveLength(3);
  });
}); 