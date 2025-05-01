import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Paragraph, TextRun, HeadingLevel, Packer, SectionType, IStylesOptions, IDefaultStylesOptions } from 'docx';
import { saveAs } from 'file-saver';
import { CVData, Template, CustomizationOptions } from '../types';
import { formatDate } from '../../../utils/dateUtils';

export type ExportFormat = 'pdf' | 'docx';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  paperFormat?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  quality?: number;
  scale?: number;
}

const defaultOptions: ExportOptions = {
  format: 'pdf',
  filename: 'cv',
  paperFormat: 'a4',
  orientation: 'portrait',
  margin: 10,
  quality: 1,
  scale: 2
};

const getWordStyles = (customization: CustomizationOptions): IDefaultStylesOptions => ({
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
    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const pdf = new jsPDF({
      format: options.paperFormat,
      orientation: options.orientation,
      unit: 'mm',
      compress: true
    });

    const imgWidth = pdf.internal.pageSize.getWidth() - (options.margin || 0) * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(
      canvas.toDataURL('image/jpeg', options.quality || 1.0),
      'JPEG',
      options.margin || 0,
      options.margin || 0,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );

    pdf.save(`${options.filename}.pdf`);
  } catch (error) {
    console.error('Erreur lors de l\'export en PDF:', error);
    throw new Error('Impossible d\'exporter le CV en PDF. Veuillez réessayer.');
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

          ...(data.summary ? [
            new Paragraph({
              text: 'Résumé professionnel',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: data.summary }),
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
            ...(exp.description ? exp.description.map(desc => new Paragraph({ text: desc })) : []),
            ...(exp.achievements ? [
              new Paragraph({ text: 'Réalisations:', bold: true }),
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
                new TextRun({ text: edu.school }),
                ...(edu.location ? [new TextRun(` - ${edu.location}`)] : []),
              ]
            }),
            new Paragraph({
              text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
            }),
            ...(edu.description ? [new Paragraph({ text: edu.description })] : []),
            ...(edu.achievements ? [
              new Paragraph({ text: 'Réalisations:', bold: true }),
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
          ...data.skills.map(skill => 
            new Paragraph({
              children: [
                new TextRun({ text: skill.name, bold: true }),
                new TextRun(` - Niveau ${skill.level}`),
                ...(skill.category ? [new TextRun(` (${skill.category})`)] : []),
              ],
            })
          ),
          new Paragraph({ text: '' }),

          new Paragraph({
            text: 'Langues',
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.languages.map(lang => 
            new Paragraph({
              text: `${lang.name} - ${lang.level}`,
            })
          ),

          ...(data.certifications && data.certifications.length > 0 ? [
            new Paragraph({
              text: 'Certifications',
              heading: HeadingLevel.HEADING_2,
            }),
            ...data.certifications.map(cert => 
              new Paragraph({
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
                text: project.title,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({ text: project.description }),
              ...(project.technologies ? [
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
  data: CVData,
  template: Template,
  customization: CustomizationOptions,
  containerRef: React.RefObject<HTMLDivElement>,
  options: Partial<ExportOptions> = {}
): Promise<void> => {
  const finalOptions: ExportOptions = {
    ...defaultOptions,
    ...options,
    filename: options.filename || generateFileName(data)
  };

  try {
    if (finalOptions.format === 'pdf') {
      if (!containerRef.current) {
        throw new Error('Élément de CV non trouvé');
      }
      await exportToPDF(containerRef.current, finalOptions, customization);
    } else {
      await exportToWord(data, customization);
    }
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    throw error;
  }
}; 