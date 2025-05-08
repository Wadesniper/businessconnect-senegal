import { CVData, Template, CustomizationOptions } from '../types';

const CV_STORAGE_KEY = 'cv-generator-data';

interface StoredCVData {
  cvData: CVData;
  selectedTemplate: Template;
  customization: CustomizationOptions;
  lastModified: string;
}

export const saveCV = (data: CVData, template: Template, customization: CustomizationOptions): void => {
  try {
    const storedData: StoredCVData = {
      cvData: data,
      selectedTemplate: template,
      customization,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(storedData));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du CV:', error);
    throw new Error('Impossible de sauvegarder le CV. Veuillez réessayer.');
  }
};

export const loadCV = (): StoredCVData | null => {
  try {
    const storedData = localStorage.getItem(CV_STORAGE_KEY);
    if (!storedData) return null;
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Erreur lors du chargement du CV:', error);
    return null;
  }
};

export const deleteCV = (): void => {
  try {
    localStorage.removeItem(CV_STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression du CV:', error);
    throw new Error('Impossible de supprimer le CV. Veuillez réessayer.');
  }
};

export const validateCVData = (data: CVData): boolean => {
  // Validation des informations personnelles
  if (!data.personalInfo.firstName || !data.personalInfo.lastName || !data.personalInfo.email) {
    return false;
  }

  // Validation de l'expérience professionnelle
  if (data.experience.some(exp => !exp.title || !exp.company || !exp.startDate)) {
    return false;
  }

  // Validation de la formation
  if (data.education.some(edu => !edu.degree || !edu.institution || !edu.startDate)) {
    return false;
  }

  // Validation des compétences
  if (data.skills.some(skill => !skill.name || !skill.level)) {
    return false;
  }

  return true;
};

export const generateCVFileName = (data: CVData): string => {
  const { firstName, lastName } = data.personalInfo;
  const date = new Date().toISOString().split('T')[0];
  const sanitizedName = `${firstName}_${lastName}`.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  return `cv_${sanitizedName}_${date}`;
};

export const getAutoSaveStatus = (): boolean => {
  try {
    return localStorage.getItem('cv-autosave') === 'true';
  } catch {
    return true; // Par défaut, l'auto-sauvegarde est activée
  }
};

export const setAutoSaveStatus = (enabled: boolean): void => {
  try {
    localStorage.setItem('cv-autosave', enabled.toString());
  } catch (error) {
    console.error('Erreur lors de la configuration de l\'auto-sauvegarde:', error);
  }
}; 