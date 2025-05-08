import React, { createContext, useContext, useState, useEffect } from 'react';
import { CVData, Template, CustomizationOptions } from '../types';
import { CV_TEMPLATES } from '../data/templates';
import { validateCVData } from '../services/cvService';

interface CVContextType {
  cvData: CVData | null;
  setCVData: (data: CVData) => void;
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template) => void;
  customization: CustomizationOptions;
  setCustomization: (options: CustomizationOptions) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  saveProgress: () => void;
  loadProgress: () => void;
  isValid: boolean;
}

const defaultCustomization: CustomizationOptions = {
  primaryColor: '#1890ff',
  secondaryColor: '#52c41a',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  spacing: 'comfortable'
};

const defaultCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  interests: []
};

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cvData, setCVData] = useState<CVData | null>(defaultCVData);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(CV_TEMPLATES[0]);
  const [customization, setCustomization] = useState<CustomizationOptions>(defaultCustomization);
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (cvData) {
      setIsValid(validateCVData(cvData));
    }
  }, [cvData]);

  const saveProgress = () => {
    if (!cvData || !selectedTemplate) return;
    
    const dataToSave = {
      cvData,
      selectedTemplate,
      customization,
      currentStep
    };
    localStorage.setItem('cv-generator-progress', JSON.stringify(dataToSave));
  };

  const loadProgress = () => {
    try {
      const savedData = localStorage.getItem('cv-generator-progress');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setCVData(parsed.cvData);
        setSelectedTemplate(parsed.selectedTemplate);
        setCustomization(parsed.customization);
        setCurrentStep(parsed.currentStep);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    saveProgress();
  }, [cvData, selectedTemplate, customization, currentStep]);

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
        saveProgress,
        loadProgress,
        isValid
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
}; 