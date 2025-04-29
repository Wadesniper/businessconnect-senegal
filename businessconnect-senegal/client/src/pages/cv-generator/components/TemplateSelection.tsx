import React from 'react';
import { Card, Row, Col, Typography, Tag, Image, Space } from 'antd';
import { Template } from '../types';

const { Title, Text } = Typography;

interface TemplateSelectionProps {
  selected: Template | null;
  onSelect: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: 'corporate-pro',
    name: 'Corporate Pro',
    thumbnail: '/templates/images/corporate-pro.jpg',
    previewImage: '/templates/images/preview-corporate.jpg',
    description: 'Design moderne et professionnel, idéal pour les cadres et managers',
    category: 'Business',
    features: ['Photo professionnelle', 'Mise en page structurée', 'Sections personnalisables'],
    profileImage: '/templates/images/woman-glasses.jpg',
    sampleData: {
      title: 'Responsable Marketing Digital',
      experience: ['Chef de projet chez Orange Sénégal', 'Marketing Manager chez Wave'],
      education: ['Master en Marketing Digital - ISM Dakar', 'DESS en Management - IAM'],
      skills: ['Marketing Digital', 'Gestion de projet', 'Analytics']
    }
  },
  {
    id: 'tech-innovator',
    name: 'Tech Innovator',
    thumbnail: '/templates/images/tech-innovator.jpg',
    previewImage: '/templates/images/preview-tech.jpg',
    description: 'Pour les professionnels du numérique et de la tech',
    category: 'Tech',
    features: ['Barre de compétences', 'Section projets', 'Git & Stack technique'],
    profileImage: '/templates/images/man-tech.jpg',
    sampleData: {
      title: 'Développeur Full Stack Senior',
      experience: ['Lead Developer chez Jumia Sénégal', 'Full Stack Dev chez PayDunya'],
      education: ['Ingénieur Informatique - ESP Dakar', 'Certification AWS'],
      skills: ['React/Node.js', 'Python', 'DevOps']
    }
  },
  {
    id: 'creative-plus',
    name: 'Creative Plus',
    thumbnail: '/templates/images/creative-plus.jpg',
    previewImage: '/templates/images/preview-creative.jpg',
    description: 'Design créatif pour les professionnels des industries créatives',
    category: 'Créatif',
    features: ['Portfolio visuel', 'Design unique', 'Mise en page créative'],
    profileImage: '/templates/images/woman-creative.jpg',
    sampleData: {
      title: 'Directrice Artistique',
      experience: ['DA chez Ogilvy Africa', 'Designer chez Publicis Sénégal'],
      education: ['Master en Design - IAM', 'Formation UX/UI Design'],
      skills: ['Direction Artistique', 'Adobe Creative Suite', 'Design Thinking']
    }
  },
  {
    id: 'executive-pro',
    name: 'Executive Pro',
    thumbnail: '/templates/images/executive-pro.jpg',
    previewImage: '/templates/images/preview-executive.jpg',
    description: 'Style élégant pour les postes de direction',
    category: 'Classique',
    features: ['Design raffiné', 'Structure claire', 'Accent sur le leadership'],
    profileImage: '/templates/images/man-suit.jpg',
    sampleData: {
      title: 'Directeur Général',
      experience: ['DG chez SONATEL', 'Directeur Commercial chez CBAO'],
      education: ['MBA - HEC Paris', 'Master en Finance - ESP'],
      skills: ['Leadership', 'Stratégie d\'entreprise', 'Gestion financière']
    }
  },
  {
    id: 'startup-edge',
    name: 'Startup Edge',
    thumbnail: '/templates/images/startup-edge.jpg',
    previewImage: '/templates/images/preview-startup.jpg',
    description: 'Pour les entrepreneurs et startuppers innovants',
    category: 'Business',
    features: ['Design moderne', 'Accent sur les résultats', 'Section achievements'],
    profileImage: '/templates/images/woman-modern.jpg',
    sampleData: {
      title: 'CEO & Co-fondateur',
      experience: ['CEO de ma startup FinTech', 'Business Developer chez Wave'],
      education: ['Master Entrepreneuriat - IAM', 'Formation Y Combinator'],
      skills: ['Leadership', 'Levée de fonds', 'Growth Hacking']
    }
  },
  {
    id: 'academic-pro',
    name: 'Academic Pro',
    thumbnail: '/templates/images/academic-pro.jpg',
    previewImage: '/templates/images/preview-academic.jpg',
    description: 'Parfait pour les enseignants et chercheurs',
    category: 'Éducation',
    features: ['Section publications', 'Parcours académique', 'Projets de recherche'],
    profileImage: '/templates/images/woman-academic.jpg',
    sampleData: {
      title: 'Professeur-Chercheur en Sciences Sociales',
      experience: ['Professeur à l\'UCAD', 'Chercheur au CODESRIA'],
      education: ['Doctorat en Sociologie - UCAD', 'DEA Sciences Sociales'],
      skills: ['Recherche', 'Publication académique', 'Enseignement']
    }
  },
  {
    id: 'medical-pro',
    name: 'Medical Pro',
    thumbnail: '/templates/images/medical-pro.jpg',
    previewImage: '/templates/images/preview-medical.jpg',
    description: 'Spécialement conçu pour les professionnels de santé',
    category: 'Santé',
    features: ['Certifications médicales', 'Expérience clinique', 'Publications'],
    profileImage: '/templates/images/woman-hijab.jpg',
    sampleData: {
      title: 'Médecin Spécialiste',
      experience: ['Chef de service à l\'Hôpital Principal', 'Médecin à Fann'],
      education: ['Doctorat en Médecine - UCAD', 'Spécialisation en Cardiologie'],
      skills: ['Cardiologie', 'Recherche médicale', 'Gestion d\'équipe']
    }
  },
  {
    id: 'legal-pro',
    name: 'Legal Pro',
    thumbnail: '/templates/images/legal-pro.jpg',
    previewImage: '/templates/images/preview-legal.jpg',
    description: 'Pour les professionnels du droit et de la justice',
    category: 'Juridique',
    features: ['Section jurisprudence', 'Domaines de compétence', 'Affiliations'],
    profileImage: '/templates/images/man-lawyer.jpg',
    sampleData: {
      title: 'Avocat d\'Affaires',
      experience: ['Associé Cabinet juridique', 'Conseiller juridique BCEAO'],
      education: ['Master en Droit des Affaires - UCAD', 'Formation Barreau'],
      skills: ['Droit des affaires', 'Négociation', 'Conseil juridique']
    }
  },
  {
    id: 'consultant-pro',
    name: 'Consultant Pro',
    thumbnail: '/templates/images/consultant-pro.jpg',
    previewImage: '/templates/images/preview-consultant.jpg',
    description: 'Idéal pour les consultants et experts indépendants',
    category: 'Conseil',
    features: ['Mise en avant expertise', 'Références clients', 'Case studies'],
    profileImage: '/templates/images/man-consultant.jpg',
    sampleData: {
      title: 'Consultant en Stratégie',
      experience: ['Senior Consultant chez Deloitte', 'Manager chez McKinsey'],
      education: ['MBA - ESSEC', 'Ingénieur Polytechnicien'],
      skills: ['Stratégie d\'entreprise', 'Change Management', 'Due Diligence']
    }
  },
  {
    id: 'ngo-impact',
    name: 'NGO Impact',
    thumbnail: '/templates/images/ngo-impact.jpg',
    previewImage: '/templates/images/preview-ngo.jpg',
    description: 'Pour les professionnels du développement et humanitaire',
    category: 'ONG/Humanitaire',
    features: ['Impact social', 'Gestion de projets', 'Partenariats'],
    profileImage: '/templates/images/woman-ngo.jpg',
    sampleData: {
      title: 'Coordinateur de Projets Humanitaires',
      experience: ['Chef de Mission MSF', 'Coordinateur UNICEF Sénégal'],
      education: ['Master Action Humanitaire - Geneva', 'License Sociologie'],
      skills: ['Gestion de projets', 'Coordination terrain', 'Fundraising']
    }
  }
];

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ selected, onSelect }) => {
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ marginBottom: 16, textAlign: 'center' }}>
        Choisissez votre modèle de CV
      </Title>
      <Text style={{ display: 'block', marginBottom: 32, textAlign: 'center', fontSize: 16 }}>
        Des modèles professionnels adaptés à votre secteur d'activité
      </Text>

      <Row gutter={[24, 24]}>
        {templates.map((template) => (
          <Col key={template.id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                height: '100%',
                border: selected?.id === template.id ? '2px solid #1890ff' : undefined,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
              onClick={() => onSelect(template)}
              cover={
                <div style={{ position: 'relative', height: 450, background: '#f5f5f5' }}>
                  <div style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    background: `url(${template.previewImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    height: '120px',
                    borderRadius: '60px',
                    overflow: 'hidden',
                    border: '4px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <Image
                      alt="Profile"
                      src={template.profileImage}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      preview={false}
                    />
                  </div>
                </div>
              }
            >
              <Card.Meta
                title={
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <div>
                      <Text strong style={{ fontSize: 18 }}>{template.name}</Text>
                      <Tag color="blue" style={{ marginLeft: 8 }}>{template.category}</Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: 14 }}>{template.description}</Text>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        Exemple : {template.sampleData.title}
                      </Text>
                    </div>
                  </Space>
                }
                description={
                  <div style={{ marginTop: 16 }}>
                    {template.features.map((feature, index) => (
                      <Tag key={index} style={{ marginBottom: 8, marginRight: 8 }}>{feature}</Tag>
                    ))}
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TemplateSelection; 