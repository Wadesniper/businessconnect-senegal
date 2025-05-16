// Correction profils de démo CV : version stable, tableaux toujours présents (expérience, éducation, skills) - commit forçage 2024-05-16

import React from 'react';
import { useParams } from 'react-router-dom';
import { CV_TEMPLATES } from './components/data/templates';
import { Card, Typography, Alert } from 'antd';

const { Title } = Typography;

const DEMO_PROFILES: Record<string, any> = {
  finance: {
    personalInfo: {
      firstName: 'Mamadou',
      lastName: 'Ndiaye',
      title: 'Analyste Financier Senior',
      email: 'mamadou.ndiaye@email.com',
      phone: '+221 77 123 45 67',
      address: 'Dakar, Sénégal',
      photo: '/images/avatars/man-1.png',
      profileImage: '/images/avatars/man-1.png',
      linkedin: 'https://www.linkedin.com/in/mamadoundiaye',
      portfolio: 'https://portfolio-mamadou.sn',
    },
    summary: 'Analyste financier sénior avec plus de 8 ans d\'expérience dans la gestion de portefeuilles, l\'analyse de risques et l\'optimisation des investissements pour des institutions majeures au Sénégal. Excellente maîtrise des outils financiers, reporting, et pilotage de projets transverses.',
    experience: [
      {
        company: 'Société Générale Sénégal',
        title: 'Analyste Financier Senior',
        startDate: '2019',
        endDate: '2024',
        current: true,
        description: 'Gestion de portefeuilles institutionnels, analyse de risques, reporting avancé, encadrement d\'une équipe de 4 analystes.',
        achievements: [
          'Mise en place d\'un nouveau modèle d\'évaluation des risques',
          'Optimisation des process de reporting (gain de 20% de temps)',
          'Formation de 10 jeunes analystes',
        ],
      },
      {
        company: 'CBAO',
        title: "Charge d'Analyse Crédit",
        startDate: '2016',
        endDate: '2019',
        current: false,
        description: 'Analyse des dossiers de crédit entreprises, scoring, suivi des encours.',
        achievements: [
          'Réduction du taux de défaut de 15%',
          'Automatisation du scoring crédit',
        ],
      },
      {
        company: 'BNP Paribas Dakar',
        title: 'Assistant Analyste',
        startDate: '2014',
        endDate: '2016',
        current: false,
        description: 'Support à l\'équipe analyse, préparation de rapports financiers.',
        achievements: [
          'Digitalisation des archives financières',
        ],
      },
    ],
    education: [
      {
        degree: 'Master',
        field: 'Finance',
        institution: 'UCAD',
        startDate: '2012',
        endDate: '2014',
        description: 'Major de promotion, spécialisation en gestion d\'actifs.',
      },
      {
        degree: 'Licence',
        field: 'Économie',
        institution: 'UCAD',
        startDate: '2009',
        endDate: '2012',
        description: 'Mention Bien.',
      },
    ],
    skills: [
      { name: 'Analyse financière', level: 5 },
      { name: 'Gestion de portefeuille', level: 4 },
      { name: 'Excel & Power BI', level: 5 },
      { name: 'Reporting', level: 4 },
      { name: 'Management', level: 4 },
      { name: 'Anglais professionnel', level: 3 },
    ],
    certifications: [
      { name: 'CFA Level 1', issuer: 'CFA Institute', date: '2022' },
      { name: 'Certification AMF', issuer: 'Autorité des Marchés Financiers', date: '2021' },
    ],
    languages: [
      { name: 'Français', level: 'Courant' },
      { name: 'Anglais', level: 'Professionnel' },
      { name: 'Wolof', level: 'Notions' },
    ]
  },
  marketing: {
    personalInfo: {
      firstName: 'Fatou',
      lastName: 'Ba',
      title: 'Chargée de Communication',
      email: 'fatou.ba@email.com',
      phone: '+221 77 234 56 78',
      photo: '/images/avatars/woman-1.png',
      profileImage: '/images/avatars/woman-1.png',
    },
    summary: 'Passionnée par le marketing digital et la communication.',
    experience: [
      { company: 'Orange Sénégal', title: 'Community Manager', years: '2020-2023', description: 'Gestion des réseaux sociaux et campagnes.' }
    ],
    education: [
      { school: 'ISM Dakar', degree: 'Licence Marketing', years: '2016-2019' }
    ],
    skills: ['Réseaux sociaux', 'Créativité', 'Stratégie'],
  },
  health: {
    personalInfo: {
      firstName: 'Awa',
      lastName: 'Diop',
      title: 'Infirmière',
      email: 'awa.diop@email.com',
      phone: '+221 77 345 67 89',
      photo: '/images/avatars/woman-2.png',
      profileImage: '/images/avatars/woman-2.png',
    },
    summary: 'Professionnelle de santé expérimentée.',
    experience: [
      { company: 'Hôpital Principal', title: 'Infirmière', years: '2019-2023', description: 'Soins et accompagnement des patients.' }
    ],
    education: [
      { school: 'ENSP Dakar', degree: 'Diplôme Infirmière', years: '2015-2018' }
    ],
    skills: ['Soins', 'Empathie', 'Organisation'],
  },
  education: {
    personalInfo: {
      firstName: 'Abdoulaye',
      lastName: 'Sarr',
      title: 'Professeur de Mathématiques',
      email: 'abdoulaye.sarr@email.com',
      phone: '+221 77 456 78 90',
      photo: '/images/avatars/man-2.png',
      profileImage: '/images/avatars/man-2.png',
    },
    summary: 'Enseignant passionné par la pédagogie.',
    experience: [
      { company: 'Lycée Blaise Diagne', title: 'Professeur', years: '2015-2023', description: 'Enseignement des mathématiques.' }
    ],
    education: [
      { school: 'FASTEF', degree: 'CAPES Mathématiques', years: '2012-2015' }
    ],
    skills: ['Pédagogie', 'Mathématiques', 'Patience'],
  },
  commerce: {
    personalInfo: {
      firstName: 'Astou',
      lastName: 'Faye',
      title: 'Responsable Commerciale',
      email: 'astou.faye@email.com',
      phone: '+221 77 567 89 01',
      photo: '/images/avatars/woman-3.png',
      profileImage: '/images/avatars/woman-3.png',
    },
    summary: 'Spécialiste de la vente et négociation.',
    experience: [
      { company: 'CFAO', title: 'Responsable Commerciale', years: '2018-2023', description: 'Développement du portefeuille clients.' }
    ],
    education: [
      { school: 'Supdeco', degree: 'Master Commerce', years: '2014-2018' }
    ],
    skills: ['Négociation', 'Vente', 'Leadership'],
  },
  admin: {
    personalInfo: {
      firstName: 'Cheikh',
      lastName: 'Fall',
      title: 'Assistant RH',
      email: 'cheikh.fall@email.com',
      phone: '+221 77 678 90 12',
      photo: '/images/avatars/man-3.png',
      profileImage: '/images/avatars/man-3.png',
    },
    summary: 'Gestion administrative et ressources humaines.',
    experience: [
      { company: 'Senelec', title: 'Assistant RH', years: '2020-2023', description: 'Gestion des dossiers du personnel.' }
    ],
    education: [
      { school: 'UCAD', degree: 'Licence RH', years: '2016-2019' }
    ],
    skills: ['RH', 'Organisation', 'Gestion'],
  },
  tech: {
    personalInfo: {
      firstName: 'Moussa',
      lastName: 'Gaye',
      title: 'Développeur Web',
      email: 'moussa.gaye@email.com',
      phone: '+221 77 789 01 23',
      photo: '/images/avatars/man-4.png',
      profileImage: '/images/avatars/man-4.png',
    },
    summary: 'Développeur passionné par la tech.',
    experience: [
      { company: 'Wave', title: 'Développeur', years: '2021-2023', description: 'Développement d\'applications web.' }
    ],
    education: [
      { school: 'ESMT', degree: 'Ingénieur Logiciel', years: '2017-2021' }
    ],
    skills: ['React', 'Node.js', 'API'],
  },
  logistics: {
    personalInfo: {
      firstName: 'Khady',
      lastName: 'Sow',
      title: 'Logisticienne',
      email: 'khady.sow@email.com',
      phone: '+221 77 890 12 34',
      photo: '/images/avatars/woman-4.png',
      profileImage: '/images/avatars/woman-4.png',
    },
    summary: 'Gestion de la chaîne logistique.',
    experience: [
      { company: 'DHL Sénégal', title: 'Logisticienne', years: '2019-2023', description: 'Gestion des flux et stocks.' }
    ],
    education: [
      { school: 'ISM', degree: 'Master Logistique', years: '2015-2019' }
    ],
    skills: ['Logistique', 'Gestion', 'Organisation'],
  },
  btp: {
    personalInfo: {
      firstName: 'Ibrahima',
      lastName: 'Kane',
      title: 'Ingénieur BTP',
      email: 'ibrahima.kane@email.com',
      phone: '+221 77 901 23 45',
      photo: '/images/avatars/man-5.png',
      profileImage: '/images/avatars/man-5.png',
    },
    summary: 'Spécialiste en génie civil et chantiers.',
    experience: [
      { company: 'Eiffage Sénégal', title: 'Ingénieur BTP', years: '2018-2023', description: 'Gestion de projets de construction.' }
    ],
    education: [
      { school: 'ESP Dakar', degree: 'Ingénieur BTP', years: '2013-2018' }
    ],
    skills: ['Chantiers', 'Gestion', 'Technique'],
  },
  art: {
    personalInfo: {
      firstName: 'Seynabou',
      lastName: 'Diallo',
      title: 'Graphiste',
      email: 'seynabou.diallo@email.com',
      phone: '+221 77 234 12 34',
      photo: '/images/avatars/woman-5.png',
      profileImage: '/images/avatars/woman-5.png',
    },
    summary: 'Créative passionnée par le design.',
    experience: [
      { company: 'Studio Dakar', title: 'Graphiste', years: '2020-2023', description: 'Création de visuels et illustrations.' }
    ],
    education: [
      { school: 'Ecole des Arts', degree: 'Licence Design', years: '2016-2019' }
    ],
    skills: ['Design', 'Créativité', 'Illustration'],
  },
  hotel: {
    personalInfo: {
      firstName: 'Mame Diarra',
      lastName: 'Sy',
      title: 'Réceptionniste',
      email: 'mame.diarra@email.com',
      phone: '+221 77 345 12 34',
      photo: '/images/avatars/woman-2.png',
      profileImage: '/images/avatars/woman-2.png',
    },
    summary: 'Accueil et gestion hôtelière.',
    experience: [
      { company: 'Radisson Blu Dakar', title: 'Réceptionniste', years: '2019-2023', description: 'Accueil des clients et gestion des réservations.' }
    ],
    education: [
      { school: 'Ecole Hôtelière', degree: 'BTS Hôtellerie', years: '2016-2019' }
    ],
    skills: ['Accueil', 'Organisation', 'Langues'],
  },
  law: {
    personalInfo: {
      firstName: 'Serigne',
      lastName: 'Mbaye',
      title: 'Juriste',
      email: 'serigne.mbaye@email.com',
      phone: '+221 77 456 12 34',
      photo: '/images/avatars/man-2.png',
      profileImage: '/images/avatars/man-2.png',
    },
    summary: 'Expert en droit sénégalais.',
    experience: [
      { company: 'Cabinet Ba', title: 'Juriste', years: '2017-2023', description: 'Conseil et rédaction d\'actes juridiques.' }
    ],
    education: [
      { school: 'UCAD', degree: 'Master Droit', years: '2012-2017' }
    ],
    skills: ['Droit', 'Rédaction', 'Conseil'],
  },
  com: {
    personalInfo: {
      firstName: 'Aminata',
      lastName: 'Cissé',
      title: 'Journaliste',
      email: 'aminata.cisse@email.com',
      phone: '+221 77 567 12 34',
      photo: '/images/avatars/woman-1.png',
      profileImage: '/images/avatars/woman-1.png',
    },
    summary: 'Passionnée par la communication et les médias.',
    experience: [
      { company: 'RTS', title: 'Journaliste', years: '2018-2023', description: 'Rédaction et présentation de reportages.' }
    ],
    education: [
      { school: 'CESTI', degree: 'Licence Journalisme', years: '2014-2018' }
    ],
    skills: ['Communication', 'Rédaction', 'Interview'],
  },
  agro: {
    personalInfo: {
      firstName: 'Modou',
      lastName: 'Sarr',
      title: 'Agronome',
      email: 'modou.sarr@email.com',
      phone: '+221 77 678 12 34',
      photo: '/images/avatars/man-1.png',
      profileImage: '/images/avatars/man-1.png',
    },
    summary: 'Expert en agriculture durable.',
    experience: [
      { company: 'SODEFITEX', title: 'Agronome', years: '2016-2023', description: 'Gestion de projets agricoles.' }
    ],
    education: [
      { school: 'ENSA Thiès', degree: 'Ingénieur Agronome', years: '2011-2016' }
    ],
    skills: ['Agriculture', 'Gestion', 'Développement rural'],
  },
  human: {
    personalInfo: {
      firstName: 'Mariama',
      lastName: 'Diallo',
      title: 'Chargée de Mission Humanitaire',
      email: 'mariama.diallo@email.com',
      phone: '+221 77 789 12 34',
      photo: '/images/avatars/woman-5.png',
      profileImage: '/images/avatars/woman-5.png',
    },
    summary: 'Engagée pour l\'aide humanitaire.',
    experience: [
      { company: 'Croix-Rouge', title: 'Chargée de Mission', years: '2019-2023', description: 'Coordination de projets humanitaires.' }
    ],
    education: [
      { school: 'UCAD', degree: 'Master Action Humanitaire', years: '2014-2019' }
    ],
    skills: ['Humanitaire', 'Gestion', 'Coordination'],
  },
  bank: {
    personalInfo: {
      firstName: 'Papa',
      lastName: 'Sow',
      title: 'Conseiller Bancaire',
      email: 'papa.sow@email.com',
      phone: '+221 77 890 23 45',
      photo: '/images/avatars/man-5.png',
      profileImage: '/images/avatars/man-5.png',
    },
    summary: 'Conseiller clientèle expérimenté.',
    experience: [
      { company: 'CBAO', title: 'Conseiller Bancaire', years: '2015-2023', description: 'Gestion de portefeuilles clients.' }
    ],
    education: [
      { school: 'ISM', degree: 'Licence Banque', years: '2011-2015' }
    ],
    skills: ['Banque', 'Conseil', 'Relation client'],
  },
};

const CVPreviewGallery: React.FC = () => {
  const { templateId } = useParams();
  const template = CV_TEMPLATES.find(t => t.id === templateId);

  const demoData = DEMO_PROFILES[templateId || ''] || DEMO_PROFILES['finance'];

  if (!template) {
    return <Alert type="error" message="Modèle introuvable" description="Aucun template ne correspond à cet identifiant." showIcon style={{ margin: 40 }} />;
  }

  const TemplateComponent = template.component;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <Card style={{ borderRadius: 18, boxShadow: '0 4px 24px #1890ff11' }}>
        <Title level={2} style={{ textAlign: 'center', color: '#1890ff', fontWeight: 800, marginBottom: 32 }}>
          Aperçu du modèle : {template.name}
        </Title>
        <div style={{ background: '#f7faff', padding: 32, borderRadius: 16, minHeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TemplateComponent data={demoData} customization={{}} />
        </div>
      </Card>
    </div>
  );
};

export default CVPreviewGallery; 