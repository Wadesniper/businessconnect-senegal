import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Paragraph, TextRun, HeadingLevel, Packer, SectionType, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import type { IStylesOptions } from 'docx';
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
  try {
    const {
      format = 'pdf',
      quality = 2,
      filename = `CV_export`.replace(/\s+/g, '_')
    } = options;

    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    if (format === 'pdf') {
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      pdf.setProperties({
        title: `CV exporté`,
        subject: '',
        author: '',
        keywords: `cv`,
        creator: 'BusinessConnect Sénégal'
      });

      let position = 0;
      let page = 0;
      let remainingHeight = imgHeight;
      const pageCanvasHeight = (canvas.width * pageHeight) / imgWidth;

      while (remainingHeight > 0) {
        // Crée un sous-canvas pour chaque page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageCanvasHeight, canvas.height - page * pageCanvasHeight);
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            page * pageCanvasHeight,
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height
          );
        }
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 1.0);
        if (page > 0) pdf.addPage();
        pdf.addImage(
          pageImgData,
          'JPEG',
          0,
          0,
          imgWidth,
          (pageCanvas.height * imgWidth) / canvas.width
        );
        remainingHeight -= pageCanvasHeight;
        page++;
      }

      pdf.save(`${filename}.pdf`);
      message.success('CV exporté avec succès en PDF');
    } else if (format === 'docx') {
      message.info('Export Word bientôt disponible');
    }
  } catch (error) {
    console.error('Erreur lors de l\'export :', error);
    message.error('Une erreur est survenue lors de l\'export du CV');
    throw error;
  }
};

export const exportToWord = async (
  data: CVData,
  customization: CustomizationOptions
): Promise<void> => {
  try {
    const doc = new Document({
      styles: getWordStyles(customization),
      sections: [{
        properties: {
          type: SectionType.CONTINUOUS
        },
        children: [
          new Paragraph({
            text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: data.personalInfo.title,
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun(`${data.personalInfo.email} | ${data.personalInfo.phone}`),
              ...(data.personalInfo.address ? [new TextRun(` | ${data.personalInfo.address}`)] : []),
            ],
          }),
          new Paragraph({ text: '' }),

          ...(data.personalInfo.summary || (data as any).summary ? [
            new Paragraph({
              text: 'Résumé professionnel',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: data.personalInfo.summary || (data as any).summary }),
            new Paragraph({ text: '' }),
          ] : []),

          new Paragraph({
            text: 'Expérience professionnelle',
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.title, bold: true }),
                new TextRun(' - '),
                new TextRun({ text: exp.company }),
                ...(exp.location ? [new TextRun(` - ${exp.location}`)] : []),
              ],
            }),
            new Paragraph({
              text: `${formatDate(exp.startDate)} - ${exp.current ? 'Présent' : formatDate(exp.endDate || '')}`,
            }),
            ...(exp.description ? [new Paragraph({ text: exp.description })] : []),
            ...(exp.achievements ? [
              new Paragraph({ text: 'Réalisations:' }),
              ...exp.achievements.map(achievement =>
                new Paragraph({
                  text: `• ${achievement}`,
                  bullet: { level: 0 }
                })
              )
            ] : []),
            new Paragraph({ text: '' }),
          ]),

          new Paragraph({
            text: 'Formation',
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true }),
                ...(edu.field ? [new TextRun(` en ${edu.field}`)] : []),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: edu.institution }),
                ...(edu.location ? [new TextRun(` - ${edu.location}`)] : []),
              ]
            }),
            new Paragraph({
              text: `${formatDate(edu.startDate || '')} - ${formatDate(edu.endDate || '')}`,
            }),
            ...(edu.description ? [new Paragraph({ text: edu.description })] : []),
            ...(edu.achievements ? [
              new Paragraph({ text: 'Réalisations:' }),
              ...edu.achievements.map(achievement =>
                new Paragraph({
                  text: `• ${achievement}`,
                  bullet: { level: 0 }
                })
              )
            ] : []),
            new Paragraph({ text: '' }),
          ]),

          new Paragraph({
            text: 'Compétences',
            heading: HeadingLevel.HEADING_2,
          }),
          ...(Array.isArray(data.skills) ? data.skills.map(skill =>
            new Paragraph({
              children: [
                new TextRun({ text: skill.name, bold: true }),
                ...(skill.level ? [new TextRun(` - Niveau ${skill.level}`)] : []),
                ...(skill.category ? [new TextRun(` (${skill.category})`)] : []),
              ],
            })
          ) : []),
          new Paragraph({ text: '' }),

          new Paragraph({
            text: 'Langues',
            heading: HeadingLevel.HEADING_2,
          }),
          ...(Array.isArray(data.languages) ? data.languages.map(lang =>
            new Paragraph({
              text: `${lang.name} - ${lang.level}`,
            })
          ) : []),

          ...(data.certifications && data.certifications.length > 0 ? [
            new Paragraph({
              text: 'Certifications',
              heading: HeadingLevel.HEADING_2,
            }),
            ...data.certifications.map(cert =>
              typeof cert === 'string'
                ? new Paragraph({ text: cert })
                : new Paragraph({
                    children: [
                      new TextRun({ text: cert.name, bold: true }),
                      new TextRun(` - ${cert.issuer} (${formatDate(cert.date)})`),
                    ],
                  })
            ),
          ] : []),

          ...(data.projects && data.projects.length > 0 ? [
            new Paragraph({
              text: 'Projets',
              heading: HeadingLevel.HEADING_2,
            }),
            ...data.projects.flatMap(project => [
              new Paragraph({
                text: typeof project === 'string' ? project : project.name,
                heading: HeadingLevel.HEADING_3,
              }),
              ...(typeof project !== 'string' && project.description ? [new Paragraph({ text: project.description })] : []),
              ...(typeof project !== 'string' && project.technologies ? [
                new Paragraph({
                  children: project.technologies.map(tech =>
                    new TextRun({ text: tech, color: customization.primaryColor })
                  ),
                })
              ] : []),
              new Paragraph({ text: '' }),
            ]),
          ] : []),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `CV_${data.personalInfo.firstName}_${data.personalInfo.lastName}.docx`);
  } catch (error) {
    console.error('Erreur lors de l\'export en Word:', error);
    throw new Error('Impossible d\'exporter le CV en Word. Veuillez réessayer.');
  }
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