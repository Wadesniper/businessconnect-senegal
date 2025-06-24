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

    // 1. Capture haute résolution
    const canvas = await html2canvas(element, {
      scale: 3, // Résolution plus élevée pour une netteté maximale
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.offsetWidth, // Forcer la capture à la largeur réelle de l'élément
      height: element.offsetHeight, // Forcer la capture à la hauteur réelle de l'élément
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98); // JPEG de haute qualité

    // 2. Initialisation du PDF au format A4
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // 3. Calcul du ratio pour un ajustement parfait à la largeur de la page
    const ratio = canvasHeight / canvasWidth;
    const imgHeight = pdfWidth * ratio;

    let heightLeft = imgHeight;
    let position = 0;

    // 4. Ajout de l'image (et des pages suivantes si nécessaire)
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = -heightLeft; // La position est négative pour remonter l'image
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // 5. Sauvegarde
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