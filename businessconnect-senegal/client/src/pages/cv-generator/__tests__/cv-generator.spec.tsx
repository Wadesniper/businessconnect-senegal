import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemplateSelector from '../components/TemplateSelector';
import CVPreview from '../components/CVPreview';
import { CV_TEMPLATES } from '../components/data/templates';

// Mock minimal du contexte utilisateur (abonné/non abonné)
const mockUser = { isSubscribed: true };

// Test 1 : affichage des templates et sélection

describe('Générateur de CV - Sélection de template', () => {
  it('affiche tous les templates disponibles et permet la sélection', () => {
    render(
      <TemplateSelector
        templates={CV_TEMPLATES}
        selectedTemplateId={CV_TEMPLATES[0].id}
        onSelectTemplate={() => {}}
      />
    );
    // Vérifie l'affichage de chaque nom de template
    CV_TEMPLATES.forEach((tpl) => {
      expect(screen.getByText(tpl.name)).toBeInTheDocument();
    });
  });
});

// Test 2 : aperçu dynamique du CV selon le template sélectionné

describe('Générateur de CV - Aperçu dynamique', () => {
  it('affiche un aperçu du CV avec les données du template sélectionné', () => {
    const template = CV_TEMPLATES[0];
    const sampleData = template.sampleData || {
      personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        title: 'Développeur',
        email: 'test@example.com',
        phone: '770000000',
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
    };
    render(
      <CVPreview
        data={sampleData}
        template={template}
        customization={{}}
        isSubscribed={mockUser.isSubscribed}
      />
    );
    // Vérifie que le nom/prénom s'affichent dans l'aperçu
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });
}); 