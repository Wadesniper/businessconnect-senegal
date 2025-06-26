import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Row, Col, Button, Typography, Spin, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { marketplaceService } from '../../services/marketplaceService';
import type { MarketplaceItem } from '../../services/marketplaceService';
import { useAuth } from '../../context/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const UserItems: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading: loadingUser } = useAuth();

  useEffect(() => {
    loadUserItems();
  }, []);

  const loadUserItems = async () => {
    try {
      setLoading(true);
      const userItems = await marketplaceService.getUserItems();
      setItems(userItems);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      message.error('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'suspended': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvée';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejetée';
      case 'suspended': return 'Suspendue';
      default: return status;
    }
  };

  const formatPrice = (item: MarketplaceItem) => {
    switch (item.priceType) {
      case 'fixed':
        return `${item.price?.toLocaleString()} FCFA`;
      case 'range':
        return `${item.minPrice?.toLocaleString()} - ${item.maxPrice?.toLocaleString()} FCFA`;
      case 'negotiable':
        return 'Négociable';
      default:
        return 'Non spécifié';
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.')) {
      return;
    }

    try {
      setDeletingItemId(itemId);
      await marketplaceService.deleteItem(itemId);
      message.success('Annonce supprimée avec succès');
      await loadUserItems();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      message.error('Erreur lors de la suppression de l\'annonce');
    } finally {
      setDeletingItemId(null);
    }
  };

  if (loadingUser) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="Chargement..." />
      </div>
    );
  }

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card>
              <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>Mes Annonces</Title>

      {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
                    Vous n'avez pas encore d'annonces
                  </Text>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
            onClick={() => navigate('/marketplace/create')}
          >
            Créer une annonce
                  </Button>
        </div>
      ) : (
                <Row gutter={[16, 16]}>
          {items.map((item) => {
                    const isOwner = user && (user.id === item.userId || user.id === item.sellerId);
            const isAdmin = user && user.role === 'admin';
            return (
                      <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        <Card
                          hoverable
                          cover={
                            item.images.length > 0 ? (
                              <div style={{ height: 200, overflow: 'hidden' }}>
                    <img
                      src={item.images[0]}
                      alt={item.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                            ) : (
                              <div style={{ height: 200, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text type="secondary">Pas d'image</Text>
                  </div>
                            )
                          }
                          actions={[
                            <Button
                              type="primary"
                              icon={<EyeOutlined />}
                              onClick={() => navigate(`/marketplace/${item.id}`)}
                            >
                              Voir
                            </Button>,
                            ...(isOwner || isAdmin ? [
                              <Button
                                icon={<EditOutlined />}
                          onClick={() => navigate(`/marketplace/edit/${item.id}`)}
                        >
                          Modifier
                              </Button>,
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                loading={deletingItemId === item.id}
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          {deletingItemId === item.id ? 'Suppression...' : 'Supprimer'}
                              </Button>
                            ] : [])
                          ]}
                        >
                          <div style={{ minHeight: 120 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                              <Title level={5} style={{ margin: 0, flex: 1, marginRight: 8 }}>
                                {item.title}
                              </Title>
                              <Text
                                type={getStatusColor(item.status)}
                                style={{ fontSize: 12, fontWeight: 'bold' }}
                              >
                                {getStatusText(item.status)}
                              </Text>
                            </div>
                            
                            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                              {item.description.length > 100 
                                ? `${item.description.substring(0, 100)}...` 
                                : item.description
                              }
                            </Text>
                            
                            <div style={{ marginBottom: 8 }}>
                              <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                                {formatPrice(item)}
                              </Text>
                            </div>
                            
                            <div style={{ marginBottom: 8 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {item.category}
                              </Text>
                            </div>
                            
                            {item.moderationComment && (
                              <div style={{ 
                                marginBottom: 8, 
                                padding: 8, 
                                background: '#fff7e6', 
                                border: '1px solid #ffd591',
                                borderRadius: 4
                              }}>
                                <Text strong style={{ fontSize: 12, color: '#d46b08' }}>
                                  Commentaire de modération:
                                </Text>
                                <div style={{ fontSize: 12, color: '#d46b08', marginTop: 4 }}>
                                  {item.moderationComment}
                                </div>
                              </div>
                            )}
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8c8c8c' }}>
                              <span>{item.location}</span>
                              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                        </Card>
                      </Col>
            );
          })}
                </Row>
      )}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default UserItems; 