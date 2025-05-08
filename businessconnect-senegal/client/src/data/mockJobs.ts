// Données factices pour les offres d'emploi
export const mockJobs = [
  {
    id: '1',
    title: 'Développeur Fullstack',
    company: 'Tech Solutions',
    location: 'Dakar',
    jobType: 'CDI',
    sector: 'Informatique',
    description: 'Développement d’applications web.',
    requirements: ['React', 'Node.js'],
    keywords: ['web', 'fullstack'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  }
];

export const mockSectors = [
  'Informatique',
  'Marketing',
  'Finance',
  'Santé',
  'Éducation'
]; 