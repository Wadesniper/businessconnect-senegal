import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Typography, Button, Space, Tag, Modal, Input, Select } from 'antd';
import { BookOutlined, LockOutlined, SearchOutlined } from '@ant-design/icons';
import { DomaineFormation, FormationPageProps } from './types';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const domaines: DomaineFormation[] = [
  {
    id: 'informatique',
    titre: 'Informatique',
    description: 'Découvrez des cours en ligne gratuits en informatique, couvrant programmation web, IA, bases de données et plus. Chaque cours inclut un certificat numérique gratuit pour valider vos compétences acquises.',
    icone: '💻',
    url: 'https://cursa.app/cours-online-linformatique-gratuits',
    nombreCours: 88,
    categories: ['Programmation web', 'IA', 'Bases de données', 'Développement mobile', 'Cybersécurité']
  },
  {
    id: 'langues',
    titre: 'Langues et communication',
    description: 'Découvrez des cours en ligne gratuits sur les langues et la communication : Japonais, Anglais, Espagnol, Italien, Français, Chinois, Allemand, Russe, Portugais, Coréen. Obtenez un certificat numérique gratuit!',
    icone: '🌍',
    url: 'https://cursa.app/cours-online-langues-et-communication-gratuits',
    nombreCours: 60,
    categories: ['Anglais', 'Espagnol', 'Français', 'Chinois', 'Japonais']
  },
  {
    id: 'gestion',
    titre: 'Gestion et affaires',
    description: 'Administration des études, cours de gestion d\'entreprise et même cours de commerce tels que les investissements, l\'entrepreneuriat ou les cours pour vos finances personnelles.',
    icone: '📊',
    url: 'https://cursa.app/cours-online-gestion-et-affaires-gratuits',
    nombreCours: 40,
    categories: ['Marketing', 'Finance', 'Entrepreneuriat', 'Management', 'Comptabilité']
  },
  {
    id: 'pro',
    titre: 'Professionnalisation',
    description: 'Avec ces cours professionnels, vous vous préparez au marché du travail. Consultez ici les cours professionnels d\'agents de sécurité, de courtiers immobiliers, d\'entretien automobile et bien d\'autres et gagnez vos qualifications professionnelles.',
    icone: '🛠️',
    url: 'https://cursa.app/cours-online-professionnaliser-gratuits',
    nombreCours: 64,
    categories: ['Immobilier', 'Automobile', 'Sécurité', 'Construction', 'Services']
  },
  {
    id: 'art',
    titre: 'Art et design',
    description: 'Découvrez des cours en ligne gratuits sur l\'Art et le Design, incluant montage vidéo, UX, graphisme, édition d\'image, modélisation 3D et animations. Également, obtenez un certificat numérique gratuit !',
    icone: '🎨',
    url: 'https://cursa.app/cours-online-art-et-design-gratuits',
    nombreCours: 38,
    categories: ['Graphisme', 'UX/UI', '3D', 'Animation', 'Vidéo']
  },
  {
    id: 'education',
    titre: 'Éducation de base',
    description: 'Découvrez une large gamme de cours gratuits sur l\'éducation de base : mathématiques, physique, histoire, philosophie, biologie, chimie, rédaction et géographie. Certificat numérique gratuit inclus !',
    icone: '📚',
    url: 'https://cursa.app/cours-online-education-de-base-gratuits',
    nombreCours: 30,
    categories: ['Mathématiques', 'Sciences', 'Histoire', 'Philosophie', 'Littérature']
  },
  {
    id: 'esthetique',
    titre: 'Esthétique',
    description: 'Cours en ligne gratuits pour améliorer vos connaissances en esthétique, comme le maquillage, la conception des sourcils et plus encore.',
    icone: '💄',
    url: 'https://cursa.app/cours-online-esthetique-gratuits',
    nombreCours: 4,
    categories: ['Maquillage', 'Soins', 'Coiffure']
  },
  {
    id: 'sante',
    titre: 'Santé',
    description: 'Plusieurs cours en ligne et gratuits dans le domaine de la santé, tels que les soins infirmiers, les premiers soins, la psychologie, la nutrition, anatomie et autres, tous avec certificat.',
    icone: '⚕️',
    url: 'https://cursa.app/cours-online-sante-gratuits',
    nombreCours: 35,
    categories: ['Soins', 'Nutrition', 'Psychologie', 'Premiers secours']
  },
  {
    id: 'autres',
    titre: 'Autres',
    description: 'Différents types de sujets pour ajouter beaucoup de connaissances.',
    icone: '🎯',
    url: 'https://cursa.app/cours-online-autres-gratuits',
    nombreCours: 20,
    categories: ['Photographie', 'Sport', 'Musique', 'Théâtre']
  }
];

const FormationsPage: React.FC<FormationPageProps> = ({ isSubscribed }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Extraire toutes les catégories uniques
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    domaines.forEach(domaine => {
      domaine.categories?.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, []);

  // Filtrer les domaines en fonction de la recherche et de la catégorie
  const filteredDomaines = useMemo(() => {
    return domaines.filter(domaine => {
      const matchesSearch = searchTerm === '' || 
        domaine.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        domaine.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === '' ||
        domaine.categories?.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleDomaineClick = (domaine: DomaineFormation) => {
    if (!isSubscribed) {
      Modal.info({
        title: 'Accès réservé aux abonnés',
        content: (
          <div>
            <Paragraph>
              Pour accéder à plus de 4000 cours en ligne gratuits avec certificat numérique,
              veuillez vous abonner à BusinessConnect Sénégal.
            </Paragraph>
            <Button type="primary" onClick={() => navigate('/subscription')}>
              S'abonner maintenant
            </Button>
          </div>
        ),
        okText: 'Fermer'
      });
      return;
    }
    window.open(domaine.url, '_blank');
  };

  const totalCours = useMemo(() => {
    return domaines.reduce((total, domaine) => total + domaine.nombreCours, 0);
  }, []);

  return (
    <div style={{ padding: '40px 20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title level={1}>Formations en ligne</Title>
          <Paragraph style={{ fontSize: 18 }}>
            Plus de {totalCours} cours en ligne gratuits avec certificat numérique dans différents domaines de connaissances
          </Paragraph>
        </div>

        <Row gutter={[16, 24]} justify="center" style={{ marginBottom: 32 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Rechercher une formation..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filtrer par catégorie"
              style={{ width: '100%' }}
              size="large"
              allowClear
              onChange={(value) => setSelectedCategory(value || '')}
            >
              {allCategories.map(category => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        {filteredDomaines.length === 0 ? (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <Title level={3}>Aucun résultat trouvé</Title>
            <Paragraph>
              Essayez de modifier vos critères de recherche
            </Paragraph>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredDomaines.map((domaine) => (
              <Col key={domaine.id} xs={24} sm={12} lg={8}>
                <Card
                  hoverable
                  style={{ 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    backgroundColor: !isSubscribed ? '#fafafa' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    const card = e.currentTarget;
                    card.style.transform = 'translateY(-5px)';
                    card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget;
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = 'none';
                  }}
                  onClick={() => handleDomaineClick(domaine)}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{ 
                      fontSize: 40, 
                      textAlign: 'center',
                      filter: !isSubscribed ? 'grayscale(0.5)' : 'none'
                    }}>
                      {domaine.icone}
                    </div>
                    
                    <div>
                      <Space align="center">
                        <Title level={3} style={{ margin: 0 }}>{domaine.titre}</Title>
                        {!isSubscribed && <LockOutlined style={{ color: '#ff4d4f' }} />}
                      </Space>
                      <Text type="secondary">
                        {domaine.nombreCours} cours disponibles
                      </Text>
                    </div>

                    <Paragraph>{domaine.description}</Paragraph>

                    {domaine.categories && (
                      <div>
                        {domaine.categories.map((cat) => (
                          <Tag 
                            key={cat} 
                            color={selectedCategory === cat ? 'blue' : 'default'}
                            style={{ margin: '0 8px 8px 0' }}
                          >
                            {cat}
                          </Tag>
                        ))}
                      </div>
                    )}

                    <Button 
                      type="primary" 
                      icon={<BookOutlined />}
                      block
                      style={{
                        height: '40px',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      Accéder aux cours
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {!isSubscribed && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: 40,
            padding: '32px',
            background: 'linear-gradient(135deg, #1890ff0a 0%, #1890ff1a 100%)',
            borderRadius: '16px'
          }}>
            <Title level={2}>Débloquez l'accès à tous les cours</Title>
            <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
              Abonnez-vous à BusinessConnect Sénégal pour accéder à l'ensemble des formations
              et obtenir vos certificats numériques gratuitement.
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/subscription')}
              style={{
                height: '48px',
                padding: '0 32px',
                fontSize: '18px'
              }}
            >
              S'abonner maintenant
            </Button>
          </div>
        )}
      </Space>
    </div>
  );
};

export default FormationsPage; 