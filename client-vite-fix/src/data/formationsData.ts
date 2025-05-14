export interface StaticFormation {
  id: string;
  title: string;
  description: string;
  url: string;
}

export const formationsData: StaticFormation[] = [
  {
    id: 'informatique',
    title: 'Informatique',
    description: "Découvrez des cours en ligne gratuits en informatique, couvrant programmation web, IA, bases de données et plus. Chaque cours inclut un certificat numérique gratuit pour valider vos compétences acquises.",
    url: 'https://cursa.app/cours-online-linformatique-gratuits'
  },
  {
    id: 'langues',
    title: 'Langues et communication',
    description: "Découvrez des cours en ligne gratuits sur les langues et la communication : Japonais, Anglais, Espagnol, Italien, Français, Chinois, Allemand, Russe, Portugais, Coréen. Obtenez un certificat numérique gratuit!",
    url: 'https://cursa.app/cours-online-langues-et-communication-gratuits'
  },
  {
    id: 'business',
    title: 'Gestion et affaires',
    description: "Administration des études, cours de gestion d'entreprise et même cours de commerce tels que les investissements, l'entrepreneuriat ou les cours pour vos finances personnelles.",
    url: 'https://cursa.app/cours-online-gestion-et-affaires-gratuits'
  },
  {
    id: 'pro',
    title: 'Professionnalisation',
    description: "Avec ces cours professionnels, vous vous préparez au marché du travail. Consultez ici les cours professionnels d'agents de sécurité, de courtiers immobiliers, d'entretien automobile et bien d'autres et gagnez vos qualifications professionnelles.",
    url: 'https://cursa.app/cours-online-professionnaliser-gratuits'
  },
  {
    id: 'design',
    title: 'Art et désign',
    description: "Découvrez des cours en ligne gratuits sur l'Art et le Design, incluant montage vidéo, UX, graphisme, édition d'image, modélisation 3D et animations. Également, obtenez un certificat numérique gratuit !",
    url: 'https://cursa.app/cours-online-art-et-design-gratuits'
  },
  {
    id: 'education',
    title: 'Éducation de base',
    description: "Découvrez une large gamme de cours gratuits sur l'éducation de base : mathématiques, physique, histoire, philosophie, biologie, chimie, rédaction et géographie. Certificat numérique gratuit inclus !",
    url: 'https://cursa.app/cours-online-education-de-base-gratuits'
  },
  {
    id: 'esthetique',
    title: 'Esthétique',
    description: "Cours en ligne gratuits pour améliorer vos connaissances en esthétique, comme le maquillage, la conception des sourcils et plus encore.",
    url: 'https://cursa.app/cours-online-esthetique-gratuits'
  },
  {
    id: 'sante',
    title: 'Santé',
    description: "Plusieurs cours en ligne et gratuits dans le domaine de la santé, tels que les soins infirmiers, les premiers soins, la psychologie, la nutrition, anatomie et autres, tous avec certificat.",
    url: 'https://cursa.app/cours-online-sante-gratuits'
  },
  {
    id: 'autres',
    title: 'Autres',
    description: "Différents types de sujets pour ajouter beaucoup de connaissances.",
    url: 'https://cursa.app/cours-online-autres-gratuits'
  }
]; 