import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from './ProfilePage';

// Mock du contexte d'authentification
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user1',
      firstName: 'Jean',
      lastName: 'Dupont',
      fullName: 'Jean Dupont',
      email: 'jean.dupont@mail.com',
      phoneNumber: '221771234567',
      role: 'etudiant',
      avatar: '',
      isVerified: true
    },
    logout: jest.fn()
  })
}));

describe('ProfilePage', () => {
  it('affiche les infos utilisateur et le bouton de déconnexion', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('jean.dupont@mail.com')).toBeInTheDocument();
    expect(screen.getByText(/Rôle/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /déconnexion/i })).toBeInTheDocument();
  });

  it('affiche un message si aucun utilisateur n\'est connecté', () => {
    const { useAuth } = require('../../context/AuthContext');
    const spy = jest.spyOn(require('../../context/AuthContext'), 'useAuth');
    spy.mockReturnValue({ user: null, logout: jest.fn() });
    render(<ProfilePage />);
    expect(screen.getByText(/veuillez vous connecter/i)).toBeInTheDocument();
    spy.mockRestore();
  });
}); 