import React from 'react';
import { useParams } from 'react-router-dom';
import { CV_TEMPLATES } from './components/data/templates';
import { Card, Typography, Alert } from 'antd';

const { Title } = Typography;

const DEMO_PROFILES: Record<string, any> = {
  finance: {
    name: 'Mamadou Ndiaye',
    job: 'Analyste Financier',
    email: 'mamadou.ndiaye@email.com',
    phone: '+221 77 123 45 67',
    summary: 'Expert en finance et gestion de portefeuille.',
    profileImage: '/images/avatars/man-1.png',
    experience: [
      { company: 'Société Générale Sénégal', title: 'Analyste', years: '2021-2023', description: 'Analyse financière et gestion de risques.' }
    ],
    education: [
      { school: 'UCAD', degree: 'Master Finance', years: '2017-2021' }
    ],
    skills: ['Gestion', 'Analyse', 'Excel'],
  },
  marketing: {
    name: 'Fatou Ba',
    job: 'Chargée de Communication',
    email: 'fatou.ba@email.com',
    phone: '+221 77 234 56 78',
    summary: 'Passionnée par le marketing digital et la communication.',
    profileImage: '/images/avatars/woman-1.png',
    experience: [
      { company: 'Orange Sénégal', title: 'Community Manager', years: '2020-2023', description: 'Gestion des réseaux sociaux et campagnes.' }
    ],
    education: [
      { school: 'ISM Dakar', degree: 'Licence Marketing', years: '2016-2019' }
    ],
    skills: ['Réseaux sociaux', 'Créativité', 'Stratégie'],
  },
  health: {
    name: 'Awa Diop',
    job: 'Infirmière',
    email: 'awa.diop@email.com',
    phone: '+221 77 345 67 89',
    summary: 'Professionnelle de santé expérimentée.',
    profileImage: '/images/avatars/woman-2.png',
    experience: [
      { company: 'Hôpital Principal', title: 'Infirmière', years: '2019-2023', description: 'Soins et accompagnement des patients.' }
    ],
    education: [
      { school: 'ENSP Dakar', degree: 'Diplôme Infirmière', years: '2015-2018' }
    ],
    skills: ['Soins', 'Empathie', 'Organisation'],
  },
  education: {
    name: 'Abdoulaye Sarr',
    job: 'Professeur de Mathématiques',
    email: 'abdoulaye.sarr@email.com',
    phone: '+221 77 456 78 90',
    summary: 'Enseignant passionné par la pédagogie.',
    profileImage: '/images/avatars/man-2.png',
    experience: [
      { company: 'Lycée Blaise Diagne', title: 'Professeur', years: '2015-2023', description: 'Enseignement des mathématiques.' }
    ],
    education: [
      { school: 'FASTEF', degree: 'CAPES Mathématiques', years: '2012-2015' }
    ],
    skills: ['Pédagogie', 'Mathématiques', 'Patience'],
  },
  commerce: {
    name: 'Astou Faye',
    job: 'Responsable Commerciale',
    email: 'astou.faye@email.com',
    phone: '+221 77 567 89 01',
    summary: 'Spécialiste de la vente et négociation.',
    profileImage: '/images/avatars/woman-3.png',
    experience: [
      { company: 'CFAO', title: 'Responsable Commerciale', years: '2018-2023', description: 'Développement du portefeuille clients.' }
    ],
    education: [
      { school: 'Supdeco', degree: 'Master Commerce', years: '2014-2018' }
    ],
    skills: ['Négociation', 'Vente', 'Leadership'],
  },
  admin: {
    name: 'Cheikh Fall',
    job: 'Assistant RH',
    email: 'cheikh.fall@email.com',
    phone: '+221 77 678 90 12',
    summary: 'Gestion administrative et ressources humaines.',
    profileImage: '/images/avatars/man-3.png',
    experience: [
      { company: 'Senelec', title: 'Assistant RH', years: '2020-2023', description: 'Gestion des dossiers du personnel.' }
    ],
    education: [
      { school: 'UCAD', degree: 'Licence RH', years: '2016-2019' }
    ],
    skills: ['RH', 'Organisation', 'Gestion'],
  },
  tech: {
    name: 'Moussa Gaye',
    job: 'Développeur Web',
    email: 'moussa.gaye@email.com',
    phone: '+221 77 789 01 23',
    summary: 'Développeur passionné par la tech.',
    profileImage: '/images/avatars/man-4.png',
    experience: [
      { company: 'Wave', title: 'Développeur', years: '2021-2023', description: 'Développement d\'applications web.' }
    ],
    education: [
      { school: 'ESMT', degree: 'Ingénieur Logiciel', years: '2017-2021' }
    ],
    skills: ['React', 'Node.js', 'API'],
  },
  logistics: {
    name: 'Khady Sow',
    job: 'Logisticienne',
    email: 'khady.sow@email.com',
    phone: '+221 77 890 12 34',
    summary: 'Gestion de la chaîne logistique.',
    profileImage: '/images/avatars/woman-4.png',
    experience: [
      { company: 'DHL Sénégal', title: 'Logisticienne', years: '2019-2023', description: 'Gestion des flux et stocks.' }
    ],
    education: [
      { school: 'ISM', degree: 'Master Logistique', years: '2015-2019' }
    ],
    skills: ['Logistique', 'Gestion', 'Organisation'],
  },
  btp: {
    name: 'Ibrahima Kane',
    job: 'Ingénieur BTP',
    email: 'ibrahima.kane@email.com',
    phone: '+221 77 901 23 45',
    summary: 'Spécialiste en génie civil et chantiers.',
    profileImage: '/images/avatars/man-5.png',
    experience: [
      { company: 'Eiffage Sénégal', title: 'Ingénieur BTP', years: '2018-2023', description: 'Gestion de projets de construction.' }
    ],
    education: [
      { school: 'ESP Dakar', degree: 'Ingénieur BTP', years: '2013-2018' }
    ],
    skills: ['Chantiers', 'Gestion', 'Technique'],
  },
  art: {
    name: 'Seynabou Diallo',
    job: 'Graphiste',
    email: 'seynabou.diallo@email.com',
    phone: '+221 77 234 12 34',
    summary: 'Créative passionnée par le design.',
    profileImage: '/images/avatars/woman-5.png',
    experience: [
      { company: 'Studio Dakar', title: 'Graphiste', years: '2020-2023', description: 'Création de visuels et illustrations.' }
    ],
    education: [
      { school: 'Ecole des Arts', degree: 'Licence Design', years: '2016-2019' }
    ],
    skills: ['Design', 'Créativité', 'Illustration'],
  },
  hotel: {
    name: 'Mame Diarra Sy',
    job: 'Réceptionniste',
    email: 'mame.diarra@email.com',
    phone: '+221 77 345 12 34',
    summary: 'Accueil et gestion hôtelière.',
    profileImage: '/images/avatars/woman-2.png',
    experience: [
      { company: 'Radisson Blu Dakar', title: 'Réceptionniste', years: '2019-2023', description: 'Accueil des clients et gestion des réservations.' }
    ],
    education: [
      { school: 'Ecole Hôtelière', degree: 'BTS Hôtellerie', years: '2016-2019' }
    ],
    skills: ['Accueil', 'Organisation', 'Langues'],
  },
  law: {
    name: 'Serigne Mbaye',
    job: 'Juriste',
    email: 'serigne.mbaye@email.com',
    phone: '+221 77 456 12 34',
    summary: 'Expert en droit sénégalais.',
    profileImage: '/images/avatars/man-2.png',
    experience: [
      { company: 'Cabinet Ba', title: 'Juriste', years: '2017-2023', description: 'Conseil et rédaction d\'actes juridiques.' }
    ],
    education: [
      { school: 'UCAD', degree: 'Master Droit', years: '2012-2017' }
    ],
    skills: ['Droit', 'Rédaction', 'Conseil'],
  },
  com: {
    name: 'Aminata Cissé',
    job: 'Journaliste',
    email: 'aminata.cisse@email.com',
    phone: '+221 77 567 12 34',
    summary: 'Passionnée par la communication et les médias.',
    profileImage: '/images/avatars/woman-1.png',
    experience: [
      { company: 'RTS', title: 'Journaliste', years: '2018-2023', description: 'Rédaction et présentation de reportages.' }
    ],
    education: [
      { school: 'CESTI', degree: 'Licence Journalisme', years: '2014-2018' }
    ],
    skills: ['Communication', 'Rédaction', 'Interview'],
  },
  agro: {
    name: 'Modou Sarr',
    job: 'Agronome',
    email: 'modou.sarr@email.com',
    phone: '+221 77 678 12 34',
    summary: 'Expert en agriculture durable.',
    profileImage: '/images/avatars/man-1.png',
    experience: [
      { company: 'SODEFITEX', title: 'Agronome', years: '2016-2023', description: 'Gestion de projets agricoles.' }
    ],
    education: [
      { school: 'ENSA Thiès', degree: 'Ingénieur Agronome', years: '2011-2016' }
    ],
    skills: ['Agriculture', 'Gestion', 'Développement rural'],
  },
  human: {
    name: 'Mariama Diallo',
    job: 'Chargée de Mission Humanitaire',
    email: 'mariama.diallo@email.com',
    phone: '+221 77 789 12 34',
    summary: 'Engagée pour l\'aide humanitaire.',
    profileImage: '/images/avatars/woman-5.png',
    experience: [
      { company: 'Croix-Rouge', title: 'Chargée de Mission', years: '2019-2023', description: 'Coordination de projets humanitaires.' }
    ],
    education: [
      { school: 'UCAD', degree: 'Master Action Humanitaire', years: '2014-2019' }
    ],
    skills: ['Humanitaire', 'Gestion', 'Coordination'],
  },
  bank: {
    name: 'Papa Sow',
    job: 'Conseiller Bancaire',
    email: 'papa.sow@email.com',
    phone: '+221 77 890 23 45',
    summary: 'Conseiller clientèle expérimenté.',
    profileImage: '/images/avatars/man-5.png',
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