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
  isValid: boolean;
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

  // Validation simple : toutes les sections obligatoires doivent être remplies
  const isValid = Boolean(
    cvData &&
    cvData.personalInfo &&
    cvData.personalInfo.firstName &&
    cvData.personalInfo.lastName &&
    cvData.personalInfo.title &&
    cvData.experience && cvData.experience.length > 0 &&
    cvData.education && cvData.education.length > 0
  );

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
        isValid,
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