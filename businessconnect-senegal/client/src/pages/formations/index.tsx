import React, { useState } from 'react';
import { Card, Row, Col, Input, Select, Empty, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { FORMATIONS, Formation, DomainType } from '../../types/formation.types';
import FormationService from '../../services/FormationService';
import styles from './Formations.module.css';

const { Option } = Select;

const FormationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<DomainType | ''>('');
  const { isAuthenticated, user } = useAuth();

  const filteredFormations = FORMATIONS.filter(formation => {
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = !selectedDomain || formation.id === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const handleFormationClick = (formation: Formation) => {
    if (!isAuthenticated) {
      message.warning('Veuillez vous connecter pour accéder aux formations');
      return;
    }

    if (!user?.subscription?.isActive) {
      message.warning('Cette fonctionnalité nécessite un abonnement actif');
      return;
    }

    FormationService.redirectToCursa(formation.id);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Catalogue des Formations</h1>

      <div className={styles.filters}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Input
              placeholder="Rechercher une formation..."
              prefix={<SearchOutlined />}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              placeholder="Domaine de formation"
              onChange={(value: DomainType | '') => setSelectedDomain(value)}
              className={styles.select}
              allowClear
            >
              {FORMATIONS.map(formation => (
                <Option key={formation.id} value={formation.id}>
                  {formation.titre}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {filteredFormations.length === 0 ? (
        <Empty description="Aucune formation trouvée" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredFormations.map(formation => (
            <Col xs={24} sm={12} md={8} lg={6} key={formation.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={formation.titre}
                    src={formation.imageUrl}
                    className={styles.formationImage}
                  />
                }
                onClick={() => handleFormationClick(formation)}
                className={styles.card}
              >
                <Card.Meta
                  title={formation.titre}
                  description={
                    <div className={styles.description}>
                      {formation.description}
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FormationsPage; 