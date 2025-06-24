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
    const { filename = 'cv.pdf', format = 'a4', orientation = 'portrait' } = options;

    const canvas = await html2canvas(element, {
      scale: 2, // Une échelle de 2 est un bon compromis qualité/performance
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculer le ratio pour conserver les proportions de l'image
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;

    let heightLeft = imgHeight;
    let position = 0;

    // Ajouter la première page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Ajouter des pages supplémentaires si le contenu dépasse
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; // Décaler l'image vers le haut sur la nouvelle page
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Erreur lors de l'export en PDF:", error);
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