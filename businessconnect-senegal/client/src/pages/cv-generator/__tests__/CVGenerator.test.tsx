import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CVGenerator from '..';
import { CVProvider } from '../context/CVContext';
import { message } from 'antd';

// Mock des dépendances
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    message: {
      error: jest.fn(),
      success: jest.fn(),
    },
  };
});

// Mock du service d'export
jest.mock('../services/documentExport', () => ({
  exportCV: jest.fn().mockResolvedValue(undefined),
}));

// Mock du service d'image
jest.mock('../services/imageService', () => ({
  processProfileImage: jest.fn().mockResolvedValue('data:image/jpeg;base64,mock'),
}));

describe('CVGenerator', () => {
  const renderWithSubscription = (isSubscribed = true) => {
    return render(
      <CVProvider>
        <CVGenerator isSubscribed={isSubscribed} />
      </CVProvider>
    );
  };

  beforeEach(() => {
    // Nettoyer le localStorage avant chaque test
    localStorage.clear();
    // Reset tous les mocks
    jest.clearAllMocks();
  });

  it('devrait afficher le sélecteur de template initialement', () => {
    renderWithSubscription();
    expect(screen.getByText('Choisissez votre modèle de CV')).toBeInTheDocument();
  });

  it('devrait empêcher la navigation si aucun template n\'est sélectionné', async () => {
    renderWithSubscription();
    
    fireEvent.click(screen.getByText('Suivant'));
    
    expect(message.error).toHaveBeenCalledWith('Veuillez sélectionner un modèle');
  });

  it('devrait permettre la navigation après la sélection d\'un template', async () => {
    renderWithSubscription();
    
    // Sélectionner un template
    const firstTemplate = screen.getByText('Corporate Pro');
    fireEvent.click(firstTemplate);
    
    // Naviguer à l'étape suivante
    fireEvent.click(screen.getByText('Suivant'));
    
    // Vérifier qu'on est sur le formulaire
    expect(screen.getByText('Informations personnelles')).toBeInTheDocument();
  });

  it('devrait valider les champs obligatoires du formulaire', async () => {
    renderWithSubscription();
    
    // Aller à l'étape du formulaire
    const firstTemplate = screen.getByText('Corporate Pro');
    fireEvent.click(firstTemplate);
    fireEvent.click(screen.getByText('Suivant'));
    
    // Essayer de passer à l'étape suivante sans remplir les champs
    fireEvent.click(screen.getByText('Suivant'));
    
    expect(message.error).toHaveBeenCalledWith('Veuillez remplir correctement tous les champs obligatoires');
  });

  it('devrait permettre l\'upload d\'une photo de profil', async () => {
    renderWithSubscription();
    
    // Aller à l'étape du formulaire
    const firstTemplate = screen.getByText('Corporate Pro');
    fireEvent.click(firstTemplate);
    fireEvent.click(screen.getByText('Suivant'));
    
    // Simuler l'upload d'une image
    const file = new File(['mock'], 'photo.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Photo de profil');
    
    await userEvent.upload(input, file);
    
    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
  });

  it('devrait sauvegarder automatiquement les données', async () => {
    renderWithSubscription();
    
    // Remplir quelques données
    const firstTemplate = screen.getByText('Corporate Pro');
    fireEvent.click(firstTemplate);
    fireEvent.click(screen.getByText('Suivant'));
    
    // Remplir le formulaire
    await userEvent.type(screen.getByLabelText('Prénom'), 'John');
    await userEvent.type(screen.getByLabelText('Nom'), 'Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    
    // Vérifier que les données sont dans le localStorage
    const savedData = JSON.parse(localStorage.getItem('cv-generator-progress') || '{}');
    expect(savedData.cvData.personalInfo.firstName).toBe('John');
  });

  it('devrait permettre l\'export en PDF et Word', async () => {
    renderWithSubscription();
    
    // Remplir les données nécessaires et aller jusqu'à l'aperçu
    const firstTemplate = screen.getByText('Corporate Pro');
    fireEvent.click(firstTemplate);
    fireEvent.click(screen.getByText('Suivant'));
    
    // Remplir le formulaire avec les données minimales requises
    await userEvent.type(screen.getByLabelText('Prénom'), 'John');
    await userEvent.type(screen.getByLabelText('Nom'), 'Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    
    // Aller à l'étape de personnalisation
    fireEvent.click(screen.getByText('Suivant'));
    
    // Aller à l'aperçu
    fireEvent.click(screen.getByText('Suivant'));
    
    // Tester l'export PDF
    fireEvent.click(screen.getByText('Exporter en PDF'));
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith('CV exporté avec succès en format PDF');
    });
    
    // Tester l'export Word
    fireEvent.click(screen.getByText('Exporter en Word'));
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith('CV exporté avec succès en format DOCX');
    });
  });

  it('devrait charger les données sauvegardées au rechargement', async () => {
    // Préparer des données mockées
    const mockData = {
      cvData: {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }
      },
      selectedTemplate: { id: 'corporate-pro', name: 'Corporate Pro' },
      customization: {
        primaryColor: '#000000',
        fontSize: '14px'
      },
      currentStep: 1
    };
    
    localStorage.setItem('cv-generator-progress', JSON.stringify(mockData));
    
    // Monter le composant
    renderWithSubscription();
    
    // Vérifier que les données sont chargées
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  });
}); 