import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobsPage from '../JobsPage';
import { BrowserRouter } from 'react-router-dom';

// Mock global d'axios pour contourner le problème ESM avec Jest
jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  const mockApi = {
    create: () => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    }),
    ...actualAxios,
  };
  return mockApi;
});

// Mock du service d'offres d'emploi
jest.mock('../../../services/jobService', () => ({
  JobService: {
    getJobs: () => Promise.resolve([
      {
        id: '1',
        title: 'Développeur Fullstack',
        company: 'Sénégal Tech',
        location: 'Dakar',
        type: 'CDI',
        sector: 'Informatique',
        description: "Développement d'applications web.",
        requirements: [],
        skills: [],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: '2',
        title: 'Chargé de Communication',
        company: 'Com & Co',
        location: 'Thiès',
        type: 'CDD',
        sector: 'Communication',
        description: 'Gestion de la communication interne et externe.',
        requirements: [],
        skills: [],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      }
    ])
  }
}));

describe('Page Offres d\'emploi (Jobs)', () => {
  it('affiche les offres d\'emploi et permet le filtrage', async () => {
    render(
      <BrowserRouter>
        <JobsPage />
      </BrowserRouter>
    );
    // Attendre le chargement
    expect(await screen.findByText(/Développeur Fullstack/i)).toBeInTheDocument();
    expect(screen.getByText(/Chargé de Communication/i)).toBeInTheDocument();
    // Filtrer par secteur
    fireEvent.change(screen.getByLabelText(/secteur/i), { target: { value: 'Informatique' } });
    expect(await screen.findByText(/Développeur Fullstack/i)).toBeInTheDocument();
    expect(screen.queryByText(/Chargé de Communication/i)).not.toBeInTheDocument();
    // Réinitialiser le filtre
    fireEvent.change(screen.getByLabelText(/secteur/i), { target: { value: '' } });
    expect(await screen.findByText(/Chargé de Communication/i)).toBeInTheDocument();
  });
}); 