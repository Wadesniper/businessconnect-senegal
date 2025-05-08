import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Input, Select, Slider, Tag, Rate, Button, Empty, Spin, message } from 'antd';
import { SearchOutlined, FilterOutlined, BookOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import FormationService from '../../services/formationService';
import { Formation, FormationFilters, NiveauFormation, CategorieFormation } from './types';
import styles from './Formations.module.css';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const ITEMS_PER_PAGE = 12;

const FormationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
    navigate(`/formations/${formation.id}`);
  };

  return (
    <Layout className={styles.container}>
      <Content>
        <div className={styles.header}>
          <h1>Formations</h1>
          <p>Développez vos compétences avec nos formations de qualité</p>
        </div>

        <div className={styles.filters}>
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
                placeholder="Niveau"
                style={{ width: '100%' }}
                onChange={handleNiveauChange}
                value={filters.niveau}
              >
                <Option value="">Tous les niveaux</Option>
                <Option value="Débutant">Débutant</Option>
                <Option value="Intermédiaire">Intermédiaire</Option>
                <Option value="Avancé">Avancé</Option>
                <Option value="Expert">Expert</Option>
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
                <Option value="prix-asc">Prix croissant</Option>
                <Option value="prix-desc">Prix décroissant</Option>
                <Option value="note">Meilleures notes</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4} lg={4}>
              <div className={styles.priceFilter}>
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
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        ) : formations.length === 0 ? (
          <Empty
            description="Aucune formation trouvée"
            className={styles.empty}
          />
        ) : (
          <Row gutter={[24, 24]} className={styles.formationGrid}>
            {formations.map(formation => (
              <Col xs={24} sm={12} md={8} lg={6} key={formation.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={formation.title}
                      src={formation.image}
                      className={styles.formationImage}
                    />
                  }
                  onClick={() => handleFormationClick(formation)}
                  className={styles.formationCard}
                >
                  <Card.Meta
                    title={formation.title}
                    description={
                      <div className={styles.formationMeta}>
                        <p className={styles.description}>{formation.description}</p>
                        <div className={styles.tags}>
                          <Tag color="blue">{formation.category}</Tag>
                          <Tag color="green">{formation.level}</Tag>
                          {formation.isCertified && (
                            <Tag color="gold">Certifiant</Tag>
                          )}
                        </div>
                        <div className={styles.stats}>
                          <span>
                            <ClockCircleOutlined /> {formation.duration}
                          </span>
                          <span>
                            <UserOutlined /> {formation.enrolledCount} inscrits
                          </span>
                        </div>
                        <div className={styles.rating}>
                          <Rate disabled defaultValue={formation.rating} />
                          <span>({formation.rating})</span>
                        </div>
                        <div className={styles.price}>
                          {formation.price === 0 ? (
                            <Tag color="green">Gratuit</Tag>
                          ) : (
                            <span>{formation.price.toLocaleString()} FCFA</span>
                          )}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default FormationsPage; 