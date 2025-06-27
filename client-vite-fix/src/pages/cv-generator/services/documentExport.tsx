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

// Helper function pour attendre que toutes les images dans un élément soient chargées
const waitForImages = (element: HTMLElement): Promise<void[]> => {
  const images = Array.from(element.getElementsByTagName('img'));
  const promises = images.map(img => {
    return new Promise<void>((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // On résout même en cas d'erreur
      }
    });
  });
  return Promise.all(promises);
};

/**
 * Fonction d'exportation PDF Page par Page. C'est la seule méthode fiable.
 * 1. Le CV est rendu intégralement dans un conteneur invisible.
 * 2. On calcule le nombre de pages A4 nécessaires.
 * 3. On boucle sur chaque page, on "scrolle" le CV avec une transformation CSS
 *    pour n'exposer que le contenu de la page en cours.
 * 4. On capture cette vue de la taille d'une page avec html2canvas.
 * 5. On l'ajoute au PDF.
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
    return;
  }

  // --- 1. Création de la Salle Blanche ---
  const a4WidthPx = 794; // 210mm à 96dpi
  const a4HeightPx = 1123; // 297mm à 96dpi

  // Viewport de taille A4
  const viewport = document.createElement('div');
  Object.assign(viewport.style, {
    position: 'absolute',
    left: '-9999px',
    top: '0',
    width: `${a4WidthPx}px`,
    height: `${a4HeightPx}px`,
    overflow: 'hidden',
    background: 'white',
    boxSizing: 'border-box',
  });

  // Contenu du CV (non transformé)
  const content = document.createElement('div');
  content.style.width = `${a4WidthPx}px`;
  content.style.background = 'white';
  content.className = 'cv-preview-for-export';
  // Injection du style de retour à la ligne
  const style = document.createElement('style');
  style.innerHTML = `
    .cv-preview-for-export, .cv-preview-for-export * {
      box-sizing: border-box;
    }
    .cv-preview-for-export p,
    .cv-preview-for-export div,
    .cv-preview-for-export span,
    .cv-preview-for-export li {
      word-break: break-word;
      overflow-wrap: break-word;
      white-space: pre-line;
    }
    .cv-preview-for-export div,
    .cv-preview-for-export li,
    .cv-preview-for-export section,
    .cv-preview-for-export article,
    .cv-preview-for-export .cv-section,
    .cv-preview-for-export .cv-block,
    .cv-preview-for-export .cv-experience,
    .cv-preview-for-export .cv-education,
    .cv-preview-for-export .cv-skill,
    .cv-preview-for-export .cv-certification,
    .cv-preview-for-export .cv-language,
    .cv-preview-for-export .cv-project,
    .cv-preview-for-export .cv-interest {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `;
  content.appendChild(style);
  viewport.appendChild(content);
  document.body.appendChild(viewport);

  try {
    // --- 2. Rendu du CV complet ---
    const TemplateComponent = template.component;
    const root = createRoot(content);
    root.render(
      <React.StrictMode>
        <TemplateComponent data={data} customization={customization} isMiniature={false} />
      </React.StrictMode>
    );

    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(resolve));

    const totalHeight = content.scrollHeight;
    const pageCount = Math.ceil(totalHeight / a4HeightPx);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [a4WidthPx, a4HeightPx],
    });

    for (let i = 0; i < pageCount; i++) {
      // Décaler le contenu à la bonne position
      content.style.marginTop = `-${i * a4HeightPx}px`;
      await new Promise(r => requestAnimationFrame(r));

      const canvas = await html2canvas(viewport, {
        scale: quality,
        useCORS: true,
        logging: false,
        width: a4WidthPx,
        height: a4HeightPx,
        windowWidth: a4WidthPx,
        windowHeight: a4HeightPx,
        scrollY: 0,
        scrollX: 0,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      if (i > 0) {
        pdf.addPage([a4WidthPx, a4HeightPx], 'portrait');
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, a4WidthPx, a4HeightPx);
    }

    pdf.save(`${filename}.pdf`);
    message.success('CV exporté avec succès en PDF');

  } catch (error) {
    console.error("Erreur lors de l'export PDF :", error);
    message.error("Une erreur est survenue lors de l'export du CV.");
    throw error;
  } finally {
    document.body.removeChild(viewport);
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
              text: exp.description,
            }),
            new Paragraph({ text: '' }),
          ])
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'cv.docx');
    message.success('CV exporté avec succès en DOCX');

  } catch (error) {
    console.error("Erreur lors de l'export DOCX :", error);
    message.error("Une erreur est survenue lors de l'export du CV.");
    throw error;
  }
};

// Réexport de la fonction exportCV attendue par le reste du projet
export const exportCV = () => {
  throw new Error('exportCV is not implemented.');
};