// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { Document, Paragraph, TextRun, HeadingLevel, Packer, SectionType, IStylesOptions, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { CVData, Template, CustomizationOptions } from '../../../types/cv';
import { formatDate } from '../../../utils/dateUtils';
import { message } from 'antd';

export type ExportFormat = 'pdf' | 'docx';

export interface ExportOptions {
  format?: 'pdf' | 'docx';
  quality?: number;
  filename?: string;
}

const defaultOptions: ExportOptions = {
  format: 'pdf',
  filename: 'cv',
  quality: 2
};

const getWordStyles = (customization: CustomizationOptions): any => ({
  document: {
    run: {
      font: customization.fontFamily,
      size: parseInt(customization.fontSize) * 2
    }
  },
  heading1: {
    run: {
      font: customization.fontFamily,
      size: 36,
      color: customization.primaryColor
    }
  },
  heading2: {
    run: {
      font: customization.fontFamily,
      size: 28,
      color: customization.primaryColor
    }
  }
});

export const exportToPDF = async (
  element: HTMLElement,
  options: ExportOptions = defaultOptions,
  customization: CustomizationOptions
): Promise<void> => {
  // Désactivation temporaire pour test CSP
  return;
};

export const exportToWord = async (
  data: CVData,
  customization: CustomizationOptions
): Promise<void> => {
  // (Je commente tout le code Word (docx) qui utilise SectionType, Paragraph, HeadingLevel, TextRun, etc. dans ce fichier)
};

export const generateFileName = (data: CVData): string => {
  const { firstName, lastName } = data.personalInfo;
  const date = new Date().toISOString().split('T')[0];
  const sanitizedName = `${firstName}_${lastName}`.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  return `cv_${sanitizedName}_${date}`;
};

export const exportCV = async (
  element: HTMLElement,
  data: CVData,
  template: Template,
  customization: CustomizationOptions,
  options: ExportOptions = {}
) => {
  try {
    await exportToPDF(element, options, customization);
  } catch (error) {
    console.error('Erreur lors de l\'export :', error);
    message.error('Une erreur est survenue lors de l\'export du CV');
    throw error;
  }
};

// Utilitaire pour diviser un tableau en groupes de taille n
const chunk = <T>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}; 