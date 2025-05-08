import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from '../ContactPage';
import { message } from 'antd';
import { sendContactEmail } from '../../../services/emailService';

// Mock des dépendances
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

jest.mock('../../../services/emailService', () => ({
  sendContactEmail: jest.fn(),
}));

describe('ContactPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche tous les éléments requis', () => {
    render(<ContactPage />);
    
    // Vérification du titre et sous-titre
    expect(screen.getByText('Contactez-nous')).toBeInTheDocument();
    expect(screen.getByText('Nous sommes là pour vous aider et répondre à toutes vos questions')).toBeInTheDocument();
    
    // Vérification des informations de contact
    expect(screen.getByText('Informations de contact')).toBeInTheDocument();
    expect(screen.getByText(/Adresse/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText('contact@businessconnectsenegal.com')).toBeInTheDocument();
    expect(screen.getByText(/Heures d'ouverture/i)).toBeInTheDocument();
    
    // Vérification que le téléphone n'est pas affiché
    expect(screen.queryByText(/Téléphone/i)).not.toBeInTheDocument();
    
    // Vérification du formulaire
    expect(screen.getByText('Envoyez-nous un message')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /nom complet/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /sujet/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
  });

  it('affiche la carte Google Maps', () => {
    render(<ContactPage />);
    const iframe = screen.getByTitle(/google maps/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('google.com/maps'));
  });

  it('envoie le formulaire avec succès', async () => {
    (sendContactEmail as jest.Mock).mockResolvedValueOnce(undefined);
    
    render(<ContactPage />);
    
    // Remplir le formulaire
    await userEvent.type(screen.getByRole('textbox', { name: /nom complet/i }), 'John Doe');
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'john@example.com');
    await userEvent.type(screen.getByRole('textbox', { name: /sujet/i }), 'Test Message');
    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Ceci est un message de test');
    
    // Soumettre le formulaire
    fireEvent.click(screen.getByText('Envoyer le message'));
    
    await waitFor(() => {
      expect(sendContactEmail).toHaveBeenCalledWith({
        nom: 'John Doe',
        email: 'john@example.com',
        sujet: 'Test Message',
        message: 'Ceci est un message de test'
      });
      expect(message.success).toHaveBeenCalledWith('Votre message a été envoyé avec succès !');
    });
  });

  it('affiche une erreur en cas d\'échec d\'envoi', async () => {
    (sendContactEmail as jest.Mock).mockRejectedValueOnce(new Error('Erreur d\'envoi'));
    
    render(<ContactPage />);
    
    // Remplir le formulaire
    await userEvent.type(screen.getByRole('textbox', { name: /nom complet/i }), 'John Doe');
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'john@example.com');
    await userEvent.type(screen.getByRole('textbox', { name: /sujet/i }), 'Test Message');
    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Ceci est un message de test');
    
    // Soumettre le formulaire
    fireEvent.click(screen.getByText('Envoyer le message'));
    
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
    });
  });

  it('affiche des erreurs pour les champs requis', async () => {
    render(<ContactPage />);
    
    // Soumettre le formulaire vide
    fireEvent.click(screen.getByText('Envoyer le message'));
    
    await waitFor(() => {
      expect(screen.getAllByText('Veuillez saisir votre nom')).toHaveLength(1);
      expect(screen.getAllByText('Veuillez saisir votre email')).toHaveLength(1);
      expect(screen.getAllByText('Veuillez saisir le sujet')).toHaveLength(1);
      expect(screen.getAllByText('Veuillez saisir votre message')).toHaveLength(1);
    });
  });

  it('valide le format de l\'email', async () => {
    render(<ContactPage />);
    
    // Saisir un email invalide
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'invalid-email');
    fireEvent.click(screen.getByText('Envoyer le message'));
    
    await waitFor(() => {
      expect(screen.getByText('Veuillez saisir un email valide')).toBeInTheDocument();
    });
  });

  it('est responsive et s\'adapte aux différentes tailles d\'écran', () => {
    const { container } = render(<ContactPage />);
    
    // Vérifier que les classes de responsive design sont présentes
    const mainContent = container.querySelector('.mainContent');
    expect(mainContent).toHaveClass('mainContent');
    
    const columns = container.querySelectorAll('.ant-col');
    columns.forEach(column => {
      expect(column).toHaveClass('ant-col-xs-24');
    });
  });
}); 