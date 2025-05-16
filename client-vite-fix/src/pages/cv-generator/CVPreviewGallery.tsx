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
      title: 'Analyste Financier',
      email: 'mamadou.ndiaye@email.com',
      phone: '+221 77 123 45 67',
      photo: '/images/avatars/man-1.png',
      profileImage: '/images/avatars/man-1.png',
    },
    summary: 'Expert en finance et gestion de portefeuille.',
    experience: [
      {
        company: 'Société Générale Sénégal',
        title: 'Analyste',
        years: '2021-2023',
        description: 'Analyse financière et gestion de risques.',
        achievements: [],
        startDate: '2021',
        endDate: '2023',
        current: false
      }
    ],
    education: [
      {
        degree: 'Master Finance',
        field: 'Finance',
        institution: 'UCAD',
        startDate: '2017',
        endDate: '2021',
        description: 'Formation en finance, gestion de portefeuille, analyse financière.'
      }
    ],
    skills: [
      { name: 'Gestion', level: 'Avancé' },
      { name: 'Analyse', level: 'Avancé' },
      { name: 'Excel', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' },
      { name: 'Anglais', level: 'Intermédiaire' }
    ],
    certifications: [
      { name: 'Certification Finance', issuer: 'UCAD', date: '2021' }
    ],
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
      {
        company: 'Orange Sénégal',
        title: 'Community Manager',
        years: '2020-2023',
        description: 'Gestion des réseaux sociaux et campagnes.',
        achievements: [],
        startDate: '2020',
        endDate: '2023',
        current: false
      }
    ],
    education: [
      {
        degree: 'Licence Marketing',
        field: 'Marketing',
        institution: 'ISM Dakar',
        startDate: '2016',
        endDate: '2019',
        description: 'Formation en marketing digital, communication et stratégie.'
      }
    ],
    skills: [
      { name: 'Réseaux sociaux', level: 'Avancé' },
      { name: 'Créativité', level: 'Avancé' },
      { name: 'Stratégie', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' },
      { name: 'Anglais', level: 'Débutant' }
    ],
    certifications: [
      { name: 'Certification Marketing Digital', issuer: 'ISM Dakar', date: '2019' }
    ],
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
      {
        company: 'Hôpital Principal',
        title: 'Infirmière',
        years: '2019-2023',
        description: 'Soins et accompagnement des patients.',
        achievements: [],
        startDate: '2019',
        endDate: '2023',
        current: false
      }
    ],
    education: [
      {
        degree: 'Diplôme Infirmière',
        field: 'Santé',
        institution: 'ENSP Dakar',
        startDate: '2015',
        endDate: '2018',
        description: 'Formation en soins infirmiers et accompagnement des patients.'
      }
    ],
    skills: [
      { name: 'Soins', level: 'Avancé' },
      { name: 'Empathie', level: 'Avancé' },
      { name: 'Organisation', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' }
    ],
    certifications: [
      { name: 'Diplôme d’État Infirmière', issuer: 'ENSP Dakar', date: '2018' }
    ],
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
      { company: 'Lycée Blaise Diagne', title: 'Professeur', years: '2015-2023', description: 'Enseignement des mathématiques.', achievements: [] }
    ],
    education: [
      {
        degree: 'CAPES Mathématiques',
        field: 'Mathématiques',
        institution: 'FASTEF',
        startDate: '2012',
        endDate: '2015',
        description: 'Formation en pédagogie et enseignement des mathématiques.'
      }
    ],
    skills: [
      { name: 'Pédagogie', level: 'Avancé' },
      { name: 'Mathématiques', level: 'Avancé' },
      { name: 'Patience', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' },
      { name: 'Anglais', level: 'Débutant' }
    ],
    certifications: [],
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
      { company: 'CFAO', title: 'Responsable Commerciale', years: '2018-2023', description: 'Développement du portefeuille clients.', achievements: [] }
    ],
    education: [
      {
        degree: 'Master Commerce',
        field: 'Commerce',
        institution: 'Supdeco',
        startDate: '2014',
        endDate: '2018',
        description: 'Formation en vente, négociation et gestion commerciale.'
      }
    ],
    skills: [
      { name: 'Négociation', level: 'Avancé' },
      { name: 'Vente', level: 'Avancé' },
      { name: 'Leadership', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' }
    ],
    certifications: [],
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
      { company: 'Senelec', title: 'Assistant RH', years: '2020-2023', description: 'Gestion des dossiers du personnel.', achievements: [] }
    ],
    education: [
      {
        degree: 'Licence RH',
        field: 'Ressources Humaines',
        institution: 'UCAD',
        startDate: '2016',
        endDate: '2019',
        description: 'Formation en gestion administrative et ressources humaines.'
      }
    ],
    skills: [
      { name: 'RH', level: 'Avancé' },
      { name: 'Organisation', level: 'Avancé' },
      { name: 'Gestion', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' }
    ],
    certifications: [],
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
      { company: 'Wave', title: 'Développeur', years: '2021-2023', description: "Développement d'applications web.", achievements: [] }
    ],
    education: [
      {
        degree: 'Ingénieur Logiciel',
        field: 'Informatique',
        institution: 'ESMT',
        startDate: '2017',
        endDate: '2021',
        description: 'Formation en développement logiciel, web et mobile.'
      }
    ],
    skills: [
      { name: 'React', level: 'Avancé' },
      { name: 'Node.js', level: 'Avancé' },
      { name: 'API', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' },
      { name: 'Anglais', level: 'Intermédiaire' }
    ],
    certifications: [],
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
      { company: 'DHL Sénégal', title: 'Logisticienne', years: '2019-2023', description: 'Gestion des flux et stocks.', achievements: [] }
    ],
    education: [
      {
        degree: 'Master Logistique',
        field: 'Logistique',
        institution: 'ISM',
        startDate: '2015',
        endDate: '2019',
        description: 'Formation en gestion de la chaîne logistique.'
      }
    ],
    skills: [
      { name: 'Logistique', level: 'Avancé' },
      { name: 'Gestion', level: 'Avancé' },
      { name: 'Organisation', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' }
    ],
    certifications: [],
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
      { company: 'Eiffage Sénégal', title: 'Ingénieur BTP', years: '2018-2023', description: 'Gestion de projets de construction.', achievements: [] }
    ],
    education: [
      {
        degree: 'Ingénieur BTP',
        field: 'BTP',
        institution: 'ESP Dakar',
        startDate: '2013',
        endDate: '2018',
        description: 'Formation en génie civil et gestion de chantiers.'
      }
    ],
    skills: [
      { name: 'Chantiers', level: 'Avancé' },
      { name: 'Gestion', level: 'Avancé' },
      { name: 'Technique', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' }
    ],
    certifications: [],
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
      { company: 'Studio Dakar', title: 'Graphiste', years: '2020-2023', description: 'Création de visuels et illustrations.', achievements: [] }
    ],
    education: [
      {
        degree: 'Licence Design',
        field: 'Design',
        institution: 'Ecole des Arts',
        startDate: '2016',
        endDate: '2019',
        description: 'Formation en design graphique et illustration.'
      }
    ],
    skills: [
      { name: 'Design', level: 'Avancé' },
      { name: 'Créativité', level: 'Avancé' },
      { name: 'Illustration', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' }
    ],
    certifications: [],
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
      { company: 'Radisson Blu Dakar', title: 'Réceptionniste', years: '2019-2023', description: 'Accueil des clients et gestion des réservations.', achievements: [] }
    ],
    education: [
      {
        degree: 'BTS Hôtellerie',
        field: 'Hôtellerie',
        institution: 'Ecole Hôtelière',
        startDate: '2016',
        endDate: '2019',
        description: 'Formation en accueil, gestion hôtelière et langues.'
      }
    ],
    skills: [
      { name: 'Accueil', level: 'Avancé' },
      { name: 'Organisation', level: 'Avancé' },
      { name: 'Langues', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' },
      { name: 'Anglais', level: 'Débutant' }
    ],
    certifications: [],
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
      { company: 'Cabinet Ba', title: 'Juriste', years: '2017-2023', description: "Conseil et rédaction d'actes juridiques.", achievements: [] }
    ],
    education: [
      {
        degree: 'Master Droit',
        field: 'Droit',
        institution: 'UCAD',
        startDate: '2012',
        endDate: '2017',
        description: 'Formation en droit sénégalais, conseil et rédaction d\'actes.'
      }
    ],
    skills: [
      { name: 'Droit', level: 'Avancé' },
      { name: 'Rédaction', level: 'Avancé' },
      { name: 'Conseil', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' }
    ],
    certifications: [],
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
      { company: 'RTS', title: 'Journaliste', years: '2018-2023', description: 'Rédaction et présentation de reportages.', achievements: [] }
    ],
    education: [
      {
        degree: 'Licence Journalisme',
        field: 'Journalisme',
        institution: 'CESTI',
        startDate: '2014',
        endDate: '2018',
        description: 'Formation en communication, médias et rédaction.'
      }
    ],
    skills: [
      { name: 'Communication', level: 'Avancé' },
      { name: 'Rédaction', level: 'Avancé' },
      { name: 'Interview', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' },
      { name: 'Anglais', level: 'Débutant' }
    ],
    certifications: [],
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
      { company: 'SODEFITEX', title: 'Agronome', years: '2016-2023', description: 'Gestion de projets agricoles.', achievements: [] }
    ],
    education: [
      {
        degree: 'Ingénieur Agronome',
        field: 'Agriculture',
        institution: 'ENSA Thiès',
        startDate: '2011',
        endDate: '2016',
        description: 'Formation en agriculture durable et gestion de projets.'
      }
    ],
    skills: [
      { name: 'Agriculture', level: 'Avancé' },
      { name: 'Gestion', level: 'Avancé' },
      { name: 'Développement rural', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' }
    ],
    certifications: [],
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
      { company: 'Croix-Rouge', title: 'Chargée de Mission', years: '2019-2023', description: 'Coordination de projets humanitaires.', achievements: [] }
    ],
    education: [
      {
        degree: 'Master Action Humanitaire',
        field: 'Action Humanitaire',
        institution: 'UCAD',
        startDate: '2014',
        endDate: '2019',
        description: 'Formation en gestion de projets humanitaires.'
      }
    ],
    skills: [
      { name: 'Humanitaire', level: 'Avancé' },
      { name: 'Gestion', level: 'Avancé' },
      { name: 'Coordination', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' }
    ],
    certifications: [],
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
      { company: 'CBAO', title: 'Conseiller Bancaire', years: '2015-2023', description: 'Gestion de portefeuilles clients.', achievements: [] }
    ],
    education: [
      {
        degree: 'Licence Banque',
        field: 'Banque',
        institution: 'ISM',
        startDate: '2011',
        endDate: '2015',
        description: 'Formation en gestion bancaire et relation client.'
      }
    ],
    skills: [
      { name: 'Banque', level: 'Avancé' },
      { name: 'Conseil', level: 'Avancé' },
      { name: 'Relation client', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Courant' }
    ],
    certifications: [],
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
export { DEMO_PROFILES }; 