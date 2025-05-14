// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import type { CVData, Template, CustomizationOptions } from '../../../types/cv';

export interface ExportOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
}

const defaultOptions: ExportOptions = {
  filename: 'cv.pdf',
  format: 'a4',
  orientation: 'portrait',
  margin: 10,
};

export const exportToPDF = async (
  element: HTMLElement,
  options: ExportOptions = defaultOptions
): Promise<void> => {
  // Désactivation temporaire pour test CSP
  return;
};

export const generateFileName = (data: CVData): string => {
  const { firstName, lastName } = data.personalInfo;
  const date = new Date().toISOString().split('T')[0];
  return `cv_${firstName.toLowerCase()}_${lastName.toLowerCase()}_${date}.pdf`;
};

export const exportCV = async (
  data: CVData,
  template: Template,
  customization: CustomizationOptions,
  containerRef: React.RefObject<HTMLDivElement>
): Promise<void> => {
  // Désactivation temporaire pour test CSP
  return;
}; 