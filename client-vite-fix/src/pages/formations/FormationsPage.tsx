import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Input, Button, Empty, Spin } from 'antd';
import { SearchOutlined, ArrowRightOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { formationsData } from '../../data/formationsData';
import { hasPremiumAccess } from '../../utils/premiumAccess';

const { Content } = Layout;

const emojiById: Record<string, string> = {
  informatique: '💻',
  langues: '🗣️',
  business: '💼',
  pro: '🏅',
  design: '🎨',
  education: '📚',
  esthetique: '💄',
  sante: '🏥',
  autres: '🌐',
};

const FormationsPage: React.FC = () => {
  const { hasActiveSubscription } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPremium = hasPremiumAccess(user, hasActiveSubscription);
  const [search, setSearch] = useState('');
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredFormations = formationsData.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormationClick = (url: string) => {
    if (!user) {
      navigate('/auth');
    } else if (isPremium) {
      window.open(url, '_blank');
    } else {
      navigate('/subscription');
    }
  };

  const headerStyle = {
    background: 'linear-gradient(90deg, #e6f0ff 0%, #f7faff 100%)',
    borderRadius: 24,
    padding: '32px 16px 24px 16px',
    marginBottom: 32,
    textAlign: 'center' as const,
    boxShadow: '0 4px 24px #e3e8f7',
    maxWidth: 900,
    margin: '0 auto 32px auto',
  };

  if (loadingPage) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f7faff',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}>
        <Spin size="large" />
        <div style={{ marginTop: 24, fontSize: 18, color: '#1890ff', fontWeight: 600 }}>Chargement des formations...</div>
      </div>
    );
  }

  return (
    <Layout>
      <Content>
        <div style={headerStyle}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1890ff', marginBottom: 8 }}>Formations</h1>
          <p style={{ fontSize: 18, color: '#333', marginBottom: 0 }}>
            Développez vos compétences avec plus de 4000 cours en ligne gratuits et certifiants dans de nombreux domaines.
          </p>
        </div>
        {!isPremium && (
          <div style={{
            background: 'linear-gradient(90deg, #fffbe6 0%, #f7faff 100%)',
            border: '1.5px solid #ffe58f',
            borderRadius: 16,
            padding: '18px 12px',
            margin: '0 auto 32px auto',
            maxWidth: 700,
            textAlign: 'center',
            color: '#ad8b00',
            fontWeight: 600,
            fontSize: 17,
            boxShadow: '0 2px 8px #ffe58f33',
          }}>
            <span>Pour accéder à toutes les formations, <span style={{color:'#1890ff', fontWeight:700}}>abonnez-vous</span> à la plateforme !</span>
            <br />
            <button
              style={{
                marginTop: 10,
                background: '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 22px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #1890ff22',
                transition: 'background 0.2s',
              }}
              onClick={() => {
                if (!user) {
                  navigate('/auth');
                } else {
                  navigate('/subscription');
                }
              }}
            >
              S'abonner
            </button>
          </div>
        )}
        <div style={{ maxWidth: 500, margin: '0 auto 32px auto' }}>
          <Input
            size="large"
            placeholder="Rechercher une formation..."
            prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ borderRadius: 12, fontSize: 17, boxShadow: '0 2px 8px #e3e8f7' }}
            allowClear
          />
        </div>
        <Row gutter={[24, 24]} justify="center">
          {filteredFormations.length === 0 ? (
            <Col span={24} style={{ textAlign: 'center', marginTop: 40 }}>
              <Empty description="Aucune formation trouvée" />
            </Col>
          ) : (
            filteredFormations.map(f => (
              <Col xs={24} sm={12} md={8} lg={6} key={f.id} style={{ display: 'flex' }}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 18,
                    boxShadow: '0 4px 24px #e3e8f7',
                    border: 'none',
                    minHeight: 220,
                    background: '#fff',
                    marginBottom: 24,
                    transition: 'transform 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                    maxWidth: 370,
                    margin: '0 auto',
                  }}
                  variant="outlined"
                >
                  <Card.Meta
                    title={<span style={{ color: '#1d3557', fontWeight: 700, fontSize: 20 }}>
                      {emojiById[f.id] ? <span style={{ marginRight: 8 }}>{emojiById[f.id]}</span> : null}
                      {f.title}
                    </span>}
                    description={
                      <div>
                        <p style={{ color: '#333', marginBottom: 12, minHeight: 48 }}>{f.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            type={isPremium ? 'primary' : 'default'}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 8,
                              borderRadius: 20,
                              fontWeight: 700,
                              background: isPremium ? '#1890ff' : '#fff',
                              color: isPremium ? '#fff' : '#bbb',
                              border: isPremium ? 'none' : '1.5px solid #eee',
                              fontSize: 16,
                              padding: '8px 24px',
                              width: '100%',
                              maxWidth: 180,
                              margin: '0 auto',
                              cursor: 'pointer',
                              opacity: 1,
                              boxShadow: '0 2px 8px #e3e8f7',
                              transition: 'all 0.2s',
                              height: 44,
                            }}
                            onClick={() => handleFormationClick(f.url)}
                          >
                            {!isPremium ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: '#fff',
                                boxShadow: '0 2px 8px #e3e8f7',
                              }}>
                                <LockOutlined style={{ color: '#bbb', fontSize: 18 }} />
                              </span>
                            ) : <ArrowRightOutlined />}
                            <span>Accéder</span>
                          </Button>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Content>
    </Layout>
  );
};

export default FormationsPage; 