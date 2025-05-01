import React from 'react';
import { Card, Typography, Row, Col, Button } from 'antd';
import { 
  CodeOutlined,
  ShopOutlined,
  BankOutlined,
  GlobalOutlined,
  UserOutlined,
  DesktopOutlined,
  DollarOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { formationService, DomainType } from '../../services/formationService';

const { Title, Paragraph } = Typography;

interface DomainCard {
  key: DomainType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const domainCards: DomainCard[] = [
  {
    key: 'informatique',
    title: 'Informatique',
    description: 'Développement web, mobile, cybersécurité, et plus',
    icon: <CodeOutlined />
  },
  {
    key: 'marketing',
    title: 'Marketing Digital',
    description: 'SEO, réseaux sociaux, publicité en ligne',
    icon: <ShopOutlined />
  },
  {
    key: 'gestion',
    title: 'Gestion d\'Entreprise',
    description: 'Management, stratégie, ressources humaines',
    icon: <BankOutlined />
  },
  {
    key: 'langues',
    title: 'Langues',
    description: 'Anglais professionnel, communication d\'affaires',
    icon: <GlobalOutlined />
  },
  {
    key: 'softSkills',
    title: 'Soft Skills',
    description: 'Leadership, communication, travail d\'équipe',
    icon: <UserOutlined />
  },
  {
    key: 'design',
    title: 'Design & Multimédia',
    description: 'Graphisme, UX/UI, production vidéo',
    icon: <DesktopOutlined />
  },
  {
    key: 'finance',
    title: 'Finance & Comptabilité',
    description: 'Comptabilité, analyse financière, investissement',
    icon: <DollarOutlined />
  },
  {
    key: 'entrepreneuriat',
    title: 'Entrepreneuriat',
    description: 'Création d\'entreprise, innovation, business plan',
    icon: <RocketOutlined />
  }
];

const FormationsPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
        Formations Cursa Sénégal
      </Title>
      
      <Paragraph style={{ textAlign: 'center', marginBottom: 40 }}>
        Choisissez votre domaine de formation et accédez à des contenus de qualité
      </Paragraph>

      <Row gutter={[16, 16]}>
        {domainCards.map(domain => (
          <Col xs={24} sm={12} md={8} lg={6} key={domain.key}>
            <Card
              hoverable
              style={{ height: '100%' }}
              onClick={() => formationService.redirectToCursa(domain.key)}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                {React.cloneElement(domain.icon as React.ReactElement, { 
                  style: { fontSize: '2rem', color: '#1890ff' } 
                })}
              </div>
              <Title level={4} style={{ textAlign: 'center', marginBottom: 8 }}>
                {domain.title}
              </Title>
              <Paragraph style={{ textAlign: 'center' }}>
                {domain.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Button 
          type="primary" 
          size="large"
          onClick={() => formationService.redirectToCursa()}
        >
          Voir toutes les formations
        </Button>
      </div>
    </div>
  );
};

export default FormationsPage; 