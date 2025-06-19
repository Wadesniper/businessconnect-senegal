import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Image,
  Divider,
  Tag,
  Modal,
  Form,
  Input,
  message,
  Carousel,
  Select,
  Spin
} from 'antd';
import {
  EnvironmentOutlined,
  EuroOutlined,
  MailOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { marketplaceService } from '../../services/marketplaceService';
import { authService } from '../../services/authService';
import type { MarketplaceItem } from '../../services/marketplaceService';
import { useAuth } from '../../context/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const MarketplaceItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [isOwner, setIsOwner] = useState(false);

  const fetchItem = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await marketplaceService.getItem(id);
      if (data) {
        setItem(data);
        const isItemOwner = user?.id === data.userId;
        console.log('Debug permissions:', {
          userId: user?.id,
          itemUserId: data.userId,
          isAdmin,
          isItemOwner
        });
        setIsOwner(isItemOwner);
      }
    } catch (error) {
      message.error('Erreur lors de la récupération de l\'annonce');
    }
    setLoading(false);
  }, [id, user?.id, isAdmin]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const handleUpdate = async (values: any) => {
    if (!id) return;
    try {
      await marketplaceService.updateItem(id, values);
      message.success('Annonce mise à jour avec succès');
      setIsModalVisible(false);
      fetchItem();
    } catch (error) {
      message.error('Erreur lors de la mise à jour de l\'annonce');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await marketplaceService.deleteItem(id);
      message.success('Annonce supprimée avec succès');
      navigate('/marketplace');
    } catch (error) {
      message.error('Erreur lors de la suppression de l\'annonce');
    }
  };

  if (loading) {
    return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement de l'annonce..." /></div>;
  }

  if (!item) {
    return <div>Annonce non trouvée</div>;
  }

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/marketplace')}
              style={{ marginBottom: 16 }}
            >
              Retour
            </Button>
          </Col>

          <Col span={24}>
            <Card>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  {Array.isArray(item.images) && item.images.length > 0 ? (
                    <Carousel autoplay>
                      {item.images.map((image, index) => (
                        <div key={index}>
                          <Image
                            src={image}
                            alt={`${item.title} - Image ${index + 1}`}
                            style={{ width: '100%', height: 400, objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </Carousel>
                  ) : (
                    <div style={{ height: 400, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Text>Aucune image</Text>
                    </div>
                  )}
                </Col>

                <Col xs={24} md={12}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={2}>{item.title || 'Titre non disponible'}</Title>
                    <Space>
                      {item.category && <Tag color="blue">{item.category}</Tag>}
                      {item.status && (
                        <Tag color={item.status === 'approved' ? 'green' : 'red'}>
                          {item.status === 'approved' ? 'Disponible' : 'Non disponible'}
                        </Tag>
                      )}
                    </Space>

                    <Space>
                      <EuroOutlined />
                      <Text strong style={{ fontSize: '1.5em' }}>
                        {item.price ? `${item.price}` : 'Prix non spécifié'}
                      </Text>
                    </Space>

                    {item.location && (
                      <Space>
                        <EnvironmentOutlined />
                        <Text>{item.location}</Text>
                      </Space>
                    )}

                    <Divider />

                    <Title level={4}>Description</Title>
                    <Paragraph>{item.description || 'Aucune description fournie.'}</Paragraph>

                    <Divider />

                    <Title level={4}>Contact</Title>
                    <Space direction="vertical">
                      {item.contactEmail && (
                        <Space>
                          <MailOutlined />
                          <Text>{item.contactEmail}</Text>
                        </Space>
                      )}
                      {item.contactPhone && (
                        <Space>
                          <PhoneOutlined />
                          <Text>{item.contactPhone}</Text>
                        </Space>
                      )}
                      {!item.contactEmail && !item.contactPhone && (
                        <Text type="secondary">Contact non renseigné</Text>
                      )}
                    </Space>

                    {(isAdmin || isOwner) && (
                      <>
                        <Divider />
                        <Space>
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                              console.log('Modification annonce:', { itemId: id, isAdmin, isOwner });
                              form.setFieldsValue(item);
                              setIsModalVisible(true);
                            }}
                          >
                            Modifier
                          </Button>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              console.log('Suppression annonce:', { itemId: id, isAdmin, isOwner });
                              handleDelete();
                            }}
                          >
                            Supprimer
                          </Button>
                        </Space>
                      </>
                    )}
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Modal
          title="Modifier l'annonce"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            initialValues={item}
          >
            <Form.Item
              name="title"
              label="Titre"
              rules={[{ required: true, message: 'Veuillez saisir un titre' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Veuillez saisir une description' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="price"
              label="Prix"
              rules={[{ required: true, message: 'Veuillez saisir un prix' }]}
            >
              <Input type="number" prefix={<EuroOutlined />} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Statut"
              rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
            >
              <Select>
                <Select.Option value="approved">Disponible</Select.Option>
                <Select.Option value="sold">Vendu</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Enregistrer les modifications
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default MarketplaceItemPage; 