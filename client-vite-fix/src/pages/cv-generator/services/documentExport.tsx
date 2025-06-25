import React from 'react';
import { createRoot } from 'react-dom/client';
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
  template?: Template;
  data?: CVData;
  customization?: CustomizationOptions;
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

/**
 * Fonction d'exportation PDF 100% fiable.
 * Elle ne s'appuie plus sur le DOM visible.
 * 1. Crée un conteneur invisible.
 * 2. Y "rend" une copie propre du template de CV avec les bonnes données.
 * 3. Mesure la hauteur de ce rendu propre (qui est forcément correcte).
 * 4. Capture le conteneur avec html2canvas.
 * 5. Génère le PDF.
 */
export const exportToPDF = async (
  _originalElement: HTMLElement,
  options: ExportOptions = defaultOptions
): Promise<void> => {
  const {
    filename = 'cv.pdf',
    quality = 3,
    template,
    data,
    customization
  } = options;

  if (!template || !data || !customization) {
    message.error("Données manquantes pour l'export PDF.");
    console.error("Erreur export PDF: template, data, ou customization manquant.");
    return;
  }
  
  // 1. Création de la "Salle Blanche"
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px'; // Hors de l'écran
  container.style.top = '0';
  container.style.width = '210mm'; // Largeur A4 fixe
  container.style.background = 'white';
  document.body.appendChild(container);

  try {
    // 2. Rendu propre du CV dans la salle blanche
    const TemplateComponent = template.component;
    const cvElement = (
      <React.StrictMode>
        <TemplateComponent 
          data={data} 
          customization={customization} 
          isMiniature={false} 
        />
      </React.StrictMode>
    );

    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(cvElement);
      // On attend un instant pour s'assurer que le rendu est terminé
      setTimeout(resolve, 100); 
    });

    // 3. Mesure du rendu propre
    const height = container.scrollHeight;
    const width = container.offsetWidth;

    // 4. Capture avec html2canvas
    const canvas = await html2canvas(container, {
      scale: quality,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: width,
      height: height,
      windowWidth: width,
      windowHeight: height,
    });

    // 5. Génération du PDF (logique inchangée)
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasAspectRatio = canvas.width / canvas.height;
    const imgHeight = pdfWidth / canvasAspectRatio;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = -heightLeft;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save(`${filename}.pdf`);
    message.success('CV exporté avec succès en PDF');

  } catch (error) {
    console.error("Erreur lors de l'export PDF :", error);
    message.error("Une erreur est survenue lors de l'export du CV.");
    throw error;
  } finally {
    // 6. Nettoyage
    document.body.removeChild(container);
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
  const finalFilename = generateFileName(data);
  const finalOptions = { 
    ...defaultOptions, 
    ...options, 
    filename: finalFilename,
    template,
    data,
    customization
  };

  if (finalOptions.format === 'pdf') {
    await exportToPDF(element, finalOptions);
  } else if (finalOptions.format === 'docx') {
    await exportToWord(data, customization);
  } else {
    console.error('Format d\'export non supporté:', finalOptions.format);
    message.error("Format d'export non supporté");
  }
};

// Utilitaire pour diviser un tableau en groupes de taille n
// Syntaxe de fonction classique pour éviter les conflits avec JSX dans un fichier .tsx
function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
} 