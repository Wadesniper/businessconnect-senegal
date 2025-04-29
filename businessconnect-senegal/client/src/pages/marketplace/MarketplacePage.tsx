import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Slider,
  Modal,
  Form,
  Upload,
  message,
  Image
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  EuroOutlined
} from '@ant-design/icons';
import { marketplaceService, MarketplaceItem } from '../../services/marketplaceService';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;
const { Option } = Select;
const { Content } = Layout;

const categories = [
  'Informatique',
  'Électronique',
  'Mode',
  'Maison',
  'Véhicules',
  'Services',
  'Autres'
];

const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    category: undefined,
    minPrice: 0,
    maxPrice: 10000,
    search: '',
    location: ''
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await marketplaceService.getItems(filters);
      setItems(data);
    } catch (error) {
      message.error('Erreur lors de la récupération des annonces');
    }
    setLoading(false);
  };

  const handleCreateAd = async (values: any) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        message.error('Veuillez vous connecter pour créer une annonce');
        return;
      }

      const itemData = {
        ...values,
        userId: user.id,
        images: values.images?.fileList.map((file: any) => file.url) || []
      };

      await marketplaceService.createItem(itemData);
      message.success('Annonce créée avec succès');
      setIsModalVisible(false);
      form.resetFields();
      fetchItems();
    } catch (error) {
      message.error('Erreur lors de la création de l\'annonce');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const url = await marketplaceService.uploadImage(file);
      return url;
    } catch (error) {
      message.error('Erreur lors du téléchargement de l\'image');
      return '';
    }
  };

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={2}>Marketplace</Title>
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Catégorie"
                      onChange={(value) => setFilters({ ...filters, category: value })}
                      allowClear
                    >
                      {categories.map(category => (
                        <Option key={category} value={category}>{category}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Input
                      placeholder="Localisation"
                      prefix={<EnvironmentOutlined />}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      placeholder="Rechercher..."
                      prefix={<SearchOutlined />}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </Col>
                  <Col span={6}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setIsModalVisible(true)}
                    >
                      Créer une annonce
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Text>Prix :</Text>
                    <Slider
                      range
                      min={0}
                      max={10000}
                      defaultValue={[0, 10000]}
                      onChange={(value) => setFilters({
                        ...filters,
                        minPrice: value[0],
                        maxPrice: value[1]
                      })}
                    />
                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>

          {items.map(item => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                cover={
                  item.images[0] ? (
                    <Image
                      alt={item.title}
                      src={item.images[0]}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  ) : null
                }
                onClick={() => navigate(`/marketplace/${item.id}`)}
              >
                <Card.Meta
                  title={item.title}
                  description={
                    <Space direction="vertical">
                      <Text>{item.description.substring(0, 100)}...</Text>
                      <Space>
                        <EuroOutlined />
                        <Text strong>{item.price}</Text>
                      </Space>
                      <Space>
                        <EnvironmentOutlined />
                        <Text>{item.location}</Text>
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          title="Créer une nouvelle annonce"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateAd}
          >
            <Form.Item
              name="title"
              label="Titre"
              rules={[{ required: true, message: 'Veuillez saisir un titre' }]}
            >
              <Input placeholder="Titre de l'annonce" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Veuillez saisir une description' }]}
            >
              <Input.TextArea rows={4} placeholder="Description détaillée" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Catégorie"
              rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
            >
              <Select placeholder="Sélectionnez une catégorie">
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Prix"
              rules={[{ required: true, message: 'Veuillez saisir un prix' }]}
            >
              <Input type="number" prefix={<EuroOutlined />} />
            </Form.Item>

            <Form.Item
              name="location"
              label="Localisation"
              rules={[{ required: true, message: 'Veuillez saisir une localisation' }]}
            >
              <Input prefix={<EnvironmentOutlined />} />
            </Form.Item>

            <Form.Item
              name="contactInfo"
              label="Informations de contact"
              rules={[{ required: true, message: 'Veuillez saisir les informations de contact' }]}
            >
              <Input.Group>
                <Form.Item
                  name={['contactInfo', 'email']}
                  rules={[
                    { required: true, message: 'Veuillez saisir un email' },
                    { type: 'email', message: 'Email invalide' }
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item name={['contactInfo', 'phone']}>
                  <Input placeholder="Téléphone (optionnel)" />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
              name="images"
              label="Images"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload
                listType="picture-card"
                beforeUpload={handleImageUpload}
                maxCount={5}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Publier l'annonce
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default MarketplacePage; 