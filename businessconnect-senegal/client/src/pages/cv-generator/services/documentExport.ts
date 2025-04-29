import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { CVData, Template, CustomizationOptions } from '../types';

export type ExportFormat = 'pdf' | 'docx';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  paperFormat?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
}

const defaultOptions: ExportOptions = {
  format: 'pdf',
  filename: 'cv',
  paperFormat: 'a4',
  orientation: 'portrait',
  margin: 10,
};

export const exportToPDF = async (
  element: HTMLElement,
  options: ExportOptions = defaultOptions
): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF({
      format: options.paperFormat,
      orientation: options.orientation,
      unit: 'mm',
    });

    const imgWidth = pdf.internal.pageSize.getWidth() - (options.margin || 0) * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      options.margin || 0,
      options.margin || 0,
      imgWidth,
      imgHeight
    );

    pdf.save(`${options.filename}.pdf`);
  } catch (error) {
    console.error('Erreur lors de l\'export en PDF:', error);
    throw error;
  }
};

export const exportToWord = async (
  data: CVData,
  template: Template,
  customization: CustomizationOptions,
  options: ExportOptions = defaultOptions
): Promise<void> => {
  try {
    const doc = new Document({
      styles: {
        default: {
          heading1: {
            run: {
              font: customization.fontFamily.split(',')[0],
              size: parseInt(customization.fontSize) * 2,
              color: customization.primaryColor,
            },
          },
          heading2: {
            run: {
              font: customization.fontFamily.split(',')[0],
              size: parseInt(customization.fontSize) * 1.5,
              color: customization.secondaryColor,
            },
          },
        },
      },
    });

    // En-tête avec informations personnelles
    doc.addSection({
      children: [
        new Paragraph({
          text: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: data.personalInfo.title,
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun(`${data.personalInfo.email} | ${data.personalInfo.phone}`),
            data.personalInfo.address ? new TextRun(` | ${data.personalInfo.address}`) : undefined,
          ].filter(Boolean) as TextRun[],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({}),
      ],
    });

    // Résumé
    doc.addParagraph(
      new Paragraph({
        text: 'Résumé professionnelle',
        heading: HeadingLevel.HEADING_2,
      })
    );
    doc.addParagraph(new Paragraph({ text: data.summary }));
    doc.addParagraph(new Paragraph({}));

    // Expérience professionnelle
    doc.addParagraph(
      new Paragraph({
        text: 'Expérience professionnelle',
        heading: HeadingLevel.HEADING_2,
      })
    );
    data.experience.forEach((exp) => {
      doc.addParagraph(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true }),
            new TextRun(' - '),
            new TextRun({ text: exp.company }),
          ],
        })
      );
      doc.addParagraph(
        new Paragraph({
          text: `${new Date(exp.startDate).toLocaleDateString()} - ${
            exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Présent'
          }`,
        })
      );
      if (exp.description) {
        doc.addParagraph(new Paragraph({ text: exp.description }));
      }
      doc.addParagraph(new Paragraph({}));
    });

    // Formation
    doc.addParagraph(
      new Paragraph({
        text: 'Formation',
        heading: HeadingLevel.HEADING_2,
      })
    );
    data.education.forEach((edu) => {
      doc.addParagraph(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
            new TextRun(' - '),
            new TextRun({ text: edu.school }),
          ],
        })
      );
      doc.addParagraph(
        new Paragraph({
          text: `${new Date(edu.startDate).toLocaleDateString()} - ${
            edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Présent'
          }`,
        })
      );
      if (edu.description) {
        doc.addParagraph(new Paragraph({ text: edu.description }));
      }
      doc.addParagraph(new Paragraph({}));
    });

    // Compétences
    doc.addParagraph(
      new Paragraph({
        text: 'Compétences',
        heading: HeadingLevel.HEADING_2,
      })
    );
    data.skills.forEach((skill) => {
      doc.addParagraph(
        new Paragraph({
          text: `${skill.name} - ${skill.level}/5`,
        })
      );
    });
    doc.addParagraph(new Paragraph({}));

    // Langues
    doc.addParagraph(
      new Paragraph({
        text: 'Langues',
        heading: HeadingLevel.HEADING_2,
      })
    );
    data.languages.forEach((lang) => {
      doc.addParagraph(
        new Paragraph({
          text: `${lang.name} - ${lang.level}`,
        })
      );
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `${options.filename}.docx`);
  } catch (error) {
    console.error('Erreur lors de l\'export en Word:', error);
    throw error;
  }
};

export const generateFileName = (data: CVData): string => {
  const { firstName, lastName } = data.personalInfo;
  const date = new Date().toISOString().split('T')[0];
  return `cv_${firstName.toLowerCase()}_${lastName.toLowerCase()}_${date}`;
};

export const exportCV = async (
  data: CVData,
  template: Template,
  customization: CustomizationOptions,
  containerRef: React.RefObject<HTMLDivElement>,
  format: ExportFormat = 'pdf'
): Promise<void> => {
  const options: ExportOptions = {
    format,
    filename: generateFileName(data),
    paperFormat: 'a4',
    orientation: 'portrait',
    margin: 10,
  };

  if (format === 'pdf') {
    if (!containerRef.current) {
      throw new Error('Élément de CV non trouvé');
    }
    await exportToPDF(containerRef.current, options);
  } else {
    await exportToWord(data, template, customization, options);
  }
}; 