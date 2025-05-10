import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Input, Select, Slider, Tag, Rate, Button, Empty, Spin, message } from 'antd';
import { SearchOutlined, FilterOutlined, BookOutlined, ClockCircleOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import FormationService from '../../services/formationService';
import { Formation, FormationFilters, NiveauFormation, CategorieFormation } from './types';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const ITEMS_PER_PAGE = 12;

const FormationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FormationFilters>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    tri: 'popularite'
  });

  const formationService = new FormationService();

  useEffect(() => {
    fetchFormations();
  }, [filters]);

  const fetchFormations = async () => {
    try {
      setLoading(true);
      const response = await formationService.getFormations(filters);
      setFormations(response.formations);
      setTotal(response.total);
    } catch (error) {
      message.error('Erreur lors du chargement des formations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: value,
      page: 1
    }));
  };

  const handleCategoryChange = (categorie: CategorieFormation) => {
    setFilters(prev => ({
      ...prev,
      categorie,
      page: 1
    }));
  };

  const handleNiveauChange = (niveau: NiveauFormation) => {
    setFilters(prev => ({
      ...prev,
      niveau,
      page: 1
    }));
  };

  const handlePrixChange = (values: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      prix: {
        min: values[0],
        max: values[1]
      },
      page: 1
    }));
  };

  const handleTriChange = (value: FormationFilters['tri']) => {
    setFilters(prev => ({
      ...prev,
      tri: value,
      page: 1
    }));
  };

  const handleFormationClick = (formation: Formation) => {
    let url = '';
    switch (formation.category) {
      case 'Informatique':
        url = 'https://cursa.app/cours-online-linformatique-gratuits';
        break;
      case 'Langues':
      case 'Langues et communication':
        url = 'https://cursa.app/cours-online-langues-et-communication-gratuits';
        break;
      case 'Business':
      case 'Gestion et affaires':
        url = 'https://cursa.app/cours-online-gestion-et-affaires-gratuits';
        break;
      case 'Professionnalisation':
        url = 'https://cursa.app/cours-online-professionnaliser-gratuits';
        break;
      case 'Design':
      case 'Art et désign':
        url = 'https://cursa.app/cours-online-art-et-design-gratuits';
        break;
      case 'Éducation de base':
        url = 'https://cursa.app/cours-online-education-de-base-gratuits';
        break;
      case 'Esthétique':
        url = 'https://cursa.app/cours-online-esthetique-gratuits';
        break;
      case 'Santé':
        url = 'https://cursa.app/cours-online-sante-gratuits';
        break;
      default:
        url = 'https://cursa.app/cours-online-autres-gratuits';
    }
    if (hasActiveSubscription) {
      window.open(url, '_blank');
    } else {
      window.location.href = '/subscription';
    }
  };

  return (
    <Layout>
      <Content>
        <div className="header">
          <h1>Formations</h1>
          <p>Développez vos compétences avec nos formations de qualité</p>
        </div>

        <div className="filters">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={24} md={8} lg={8}>
              <Search
                placeholder="Rechercher une formation..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
              />
            </Col>
            <Col xs={24} sm={12} md={4} lg={4}>
              <Select
                placeholder="Catégorie"
                style={{ width: '100%' }}
                onChange={handleCategoryChange}
                value={filters.categorie}
              >
                <Option value="">Toutes les catégories</Option>
                <Option value="Développement Web">Développement Web</Option>
                <Option value="Marketing Digital">Marketing Digital</Option>
                <Option value="Design">Design</Option>
                <Option value="Business">Business</Option>
                <Option value="Langues">Langues</Option>
                <Option value="Data Science">Data Science</Option>
                <Option value="DevOps">DevOps</Option>
                <Option value="Mobile">Mobile</Option>
                <Option value="Cybersécurité">Cybersécurité</Option>
                <Option value="Cloud Computing">Cloud Computing</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4} lg={4}>
              <Select
                placeholder="Trier par"
                style={{ width: '100%' }}
                onChange={handleTriChange}
                value={filters.tri}
              >
                <Option value="popularite">Popularité</Option>
                <Option value="recent">Plus récent</Option>
                <Option value="note">Meilleures notes</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4} lg={4}>
              <div className="priceFilter">
                <span>Prix (FCFA)</span>
                <Slider
                  range
                  min={0}
                  max={500000}
                  step={5000}
                  defaultValue={[0, 500000]}
                  onChange={handlePrixChange}
                />
              </div>
            </Col>
          </Row>
        </div>

        {loading ? (
          <div className="loading">
            <Spin size="large" />
          </div>
        ) : formations.length === 0 ? (
          <Empty
            description="Aucune formation trouvée"
            className="empty"
          />
        ) : (
          <Row gutter={[24, 24]} className="formationGrid">
            {formations.map(formation => {
              const f = formation as any;
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={f.id}>
                  <Card
                    hoverable
                    style={{ borderRadius: 18, boxShadow: '0 4px 24px #e3e8f7', border: 'none', minHeight: 280, background: '#fff', marginBottom: 24, transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    cover={<img alt={f.title} src={f.thumbnail ? f.thumbnail : '/images/default-formation.jpg'} style={{ borderRadius: '18px 18px 0 0', objectFit: 'cover', height: 140, width: '100%' }} />}
                  >
                    <Card.Meta
                      title={<span style={{ color: '#1d3557', fontWeight: 600 }}>{f.title}</span>}
                      description={
                        <div>
                          <p style={{ color: '#333', marginBottom: 12 }}>{f.description.length > 120 ? f.description.slice(0, 120) + '…' : f.description}</p>
                          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                            <Tag color="blue">{f.category}</Tag>
                            {f.featured ? <Tag color="gold">À la une</Tag> : null}
                          </div>
                          <Button
                            type="primary"
                            icon={hasActiveSubscription ? <ArrowRightOutlined /> : <span role="img" aria-label="lock">🔒</span>}
                            style={{ borderRadius: 20, fontWeight: 600, background: hasActiveSubscription ? '#1890ff' : '#aaa', border: 'none' }}
                            onClick={() => hasActiveSubscription && f.cursaUrl ? window.open(f.cursaUrl, '_blank') : navigate('/subscription')}
                          >
                            Accéder
                          </Button>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default FormationsPage; 