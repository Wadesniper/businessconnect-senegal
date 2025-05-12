import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Input, Select, Slider, Tag, Rate, Button, Empty, Spin, message } from 'antd';
import { SearchOutlined, FilterOutlined, BookOutlined, ClockCircleOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { formationsData } from '../../data/formationsData';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const ITEMS_PER_PAGE = 12;

const FormationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasActiveSubscription } = useSubscription();

  const handleFormationClick = (url: string) => {
    if (hasActiveSubscription) {
      window.open(url, '_blank');
    } else {
      navigate('/subscription');
    }
  };

  return (
    <Layout>
      <Content>
        <div className="header">
          <h1>Formations</h1>
          <p>Développez vos compétences avec plus de 4000 cours en ligne gratuits et certifiants dans de nombreux domaines.</p>
        </div>
        <Row gutter={[24, 24]} className="formationGrid">
          {formationsData.map(f => (
            <Col xs={24} sm={12} md={8} lg={6} key={f.id}>
              <Card
                hoverable
                style={{ borderRadius: 18, boxShadow: '0 4px 24px #e3e8f7', border: 'none', minHeight: 220, background: '#fff', marginBottom: 24, transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                variant="outlined"
              >
                <Card.Meta
                  title={<span style={{ color: '#1d3557', fontWeight: 600 }}>{f.title}</span>}
                  description={
                    <div>
                      <p style={{ color: '#333', marginBottom: 12 }}>{f.description}</p>
                      <Button
                        type="primary"
                        icon={hasActiveSubscription ? <ArrowRightOutlined /> : <span role="img" aria-label="lock">🔒</span>}
                        style={{ borderRadius: 20, fontWeight: 600, background: hasActiveSubscription ? '#1890ff' : '#aaa', border: 'none' }}
                        onClick={() => handleFormationClick(f.url)}
                      >
                        Accéder
                      </Button>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default FormationsPage; 