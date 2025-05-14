import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  try {
    // Capture le contenu HTML en tant qu'image
    const canvas = await html2canvas(element, {
      scale: 2, // Meilleure qualité
      useCORS: true, // Permet le chargement d'images externes
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Crée un nouveau document PDF
    const pdf = new jsPDF({
      format: options.format,
      orientation: options.orientation,
      unit: 'mm',
    });

    // Calcule les dimensions
    const imgWidth = pdf.internal.pageSize.getWidth() - (options.margin || 0) * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Ajoute l'image au PDF
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      options.margin || 0,
      options.margin || 0,
      imgWidth,
      imgHeight
    );

    // Télécharge le PDF
    pdf.save(options.filename || 'cv.pdf');
  } catch (error) {
    console.error('Erreur lors de l\'export en PDF:', error);
    throw error;
  }
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
  if (!containerRef.current) {
    throw new Error('Élément de CV non trouvé');
  }

  const options: ExportOptions = {
    filename: generateFileName(data),
    format: 'a4',
    orientation: 'portrait',
    margin: 10,
  };

  await exportToPDF(containerRef.current, options);
}; 