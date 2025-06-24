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
    // 1. Définir les dimensions de la page A4 en mm
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    const margin = options.margin || 0;
    
    // Largeur utile de la page
    const pdfWidth = A4_WIDTH_MM - margin * 2;

    // 2. Options robustes pour html2canvas
    const canvas = await html2canvas(element, {
      scale: 3, // Augmenter la résolution pour une meilleure qualité
      useCORS: true,
      logging: false,
      width: element.offsetWidth, // Forcer la capture à la largeur réelle de l'élément
      height: element.offsetHeight, // Forcer la capture à la hauteur réelle de l'élément
      windowWidth: element.offsetWidth,
      windowHeight: element.offsetHeight,
      backgroundColor: '#ffffff',
    });

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // 3. Calculer le ratio pour l'insertion dans le PDF
    const canvasAspectRatio = canvasWidth / canvasHeight;
    const pdfHeight = pdfWidth / canvasAspectRatio;

    // 4. Créer le document PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let position = margin;
    let remainingCanvasHeight = canvasHeight;

    // Convertir les dimensions du canvas en mm pour le PDF
    const A4_RATIO = A4_HEIGHT_MM / A4_WIDTH_MM;
    const canvasHeightInMM = canvas.height * (pdfWidth / canvas.width);
    
    let canvasSliceY = 0;

    // 5. Gérer les CV plus longs qu'une page
    while (remainingCanvasHeight > 0) {
      // Hauteur de la tranche de canvas à ajouter sur la page actuelle
      const pageCanvasHeight = Math.min(
        remainingCanvasHeight,
        canvas.width * A4_RATIO
      );

      const pageCanvasSlice = document.createElement('canvas');
      pageCanvasSlice.width = canvas.width;
      pageCanvasSlice.height = pageCanvasHeight;
      pageCanvasSlice
        .getContext('2d')
        ?.drawImage(canvas, 0, canvasSliceY, canvas.width, pageCanvasHeight, 0, 0, canvas.width, pageCanvasHeight);
      
      const pageHeight = (pageCanvasSlice.height * pdfWidth) / pageCanvasSlice.width;
      
      pdf.addImage(
        pageCanvasSlice.toDataURL('image/jpeg', 1.0),
        'JPEG',
        margin,
        position,
        pdfWidth,
        pageHeight
      );

      remainingCanvasHeight -= pageCanvasHeight;
      canvasSliceY += pageCanvasHeight;

      if (remainingCanvasHeight > 0) {
        pdf.addPage();
        position = margin; // Réinitialiser la position pour la nouvelle page
      }
    }
    
    // 6. Télécharger le PDF
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