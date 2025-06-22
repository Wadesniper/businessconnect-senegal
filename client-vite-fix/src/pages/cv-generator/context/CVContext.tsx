import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CVData, CustomizationOptions, Template } from '../../../types/cv';

interface CVContextType {
  cvData: CVData | null;
  setCVData: (data: CVData) => void;
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template | null) => void;
  customization: CustomizationOptions;
  setCustomization: (options: CustomizationOptions) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isStepValid: (step: number) => boolean;
  isFormValid: () => boolean;
}

export const defaultCustomization: CustomizationOptions = {
  primaryColor: '#1a237e',
  secondaryColor: '#f50057',
  fontFamily: 'Roboto, Arial, sans-serif',
  fontSize: '16px',
  spacing: 'comfortable',
};

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>(defaultCustomization);
  const [currentStep, setCurrentStep] = useState(0);

  // Validation granulaire par étape
  const isStepValid = (step: number): boolean => {
    if (!cvData) return false;

    switch (step) {
      case 1: // Informations personnelles
        const { firstName, lastName, title, email, phone, summary } = cvData.personalInfo || {};
        return !!(firstName && lastName && title && email && phone && summary);
      case 2: // Expérience
        return cvData.experience.length > 0 && cvData.experience.every(e => e.title && e.company && e.startDate);
      case 3: // Formation
        return cvData.education.length > 0 && cvData.education.every(e => e.degree && e.institution && e.startDate);
      // Les autres étapes sont considérées comme facultatives pour la validation de base
      default:
        return true;
    }
  };

  // Validation globale pour l'export
  const isFormValid = () => {
    // On ne valide que l'étape 1 (informations personnelles) pour l'export.
    // Les autres sections sont optionnelles.
    return isStepValid(1);
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        setCVData,
        selectedTemplate,
        setSelectedTemplate,
        customization,
        setCustomization,
        currentStep,
        setCurrentStep,
        isStepValid,
        isFormValid,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
}; 