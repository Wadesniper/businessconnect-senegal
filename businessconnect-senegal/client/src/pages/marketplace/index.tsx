import React, { useState } from 'react';
import { Layout, Typography, Card, Row, Col, Input, Select, Button, Tag, Space, Rate, Pagination } from 'antd';
import {
  SearchOutlined,
  ShoppingOutlined,
  FilterOutlined,
  ShopOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%);
  padding: 60px 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductCard = styled(Card)`
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 15px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`;

const products = [
  {
    id: 1,
    title: 'Service de réparation smartphone',
    category: 'Services',
    price: '10000',
    location: 'Dakar',
    rating: 4.8,
    reviews: 156,
    image: '/images/marketplace/phone-repair.jpg',
    description: 'Réparation rapide de smartphones toutes marques, pièces d\'origine...',
    seller: {
      name: 'TechFix Sénégal',
      rating: 4.9,
      verified: true
    }
  },
  {
    id: 2,
    title: 'Consultation en marketing digital',
    category: 'Services',
    price: '25000',
    location: 'En ligne',
    rating: 4.7,
    reviews: 89,
    image: '/images/marketplace/digital-marketing.jpg',
    description: 'Stratégie marketing personnalisée pour votre entreprise...',
    seller: {
      name: 'DigitalSen Consulting',
      rating: 4.8,
      verified: true
    }
  },
  {
    id: 3,
    title: 'Formation en comptabilité',
    category: 'Formation',
    price: '50000',
    location: 'Dakar',
    rating: 4.9,
    reviews: 234,
    image: '/images/marketplace/accounting.jpg',
    description: 'Formation complète en comptabilité et gestion financière...',
    seller: {
      name: 'ComptaSen Academy',
      rating: 5.0,
      verified: true
    }
  },
  {
    id: 4,
    title: 'Développement d\'applications mobiles',
    category: 'Services',
    price: '100000',
    location: 'En ligne',
    rating: 4.6,
    reviews: 67,
    image: '/images/marketplace/mobile-dev.jpg',
    description: 'Création d\'applications mobiles sur mesure pour votre entreprise...',
    seller: {
      name: 'AppFactory Sénégal',
      rating: 4.7,
      verified: true
    }
  }
];

const categories = [
  'Tous',
  'Services',
  'Formation',
  'Conseil',
  'Technologie',
  'Marketing',
  'Finance'
];

const locations = [
  'Toutes les villes',
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Ziguinchor',
  'En ligne'
];

const MarketplacePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedLocation, setSelectedLocation] = useState('Toutes les villes');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    const matchesLocation = selectedLocation === 'Toutes les villes' || product.location === selectedLocation;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLocation && matchesSearch;
  });

  return (
    <StyledLayout>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Title level={1}>
            Marketplace BusinessConnect
          </Title>
          <Paragraph style={{ fontSize: '1.2rem', maxWidth: 800, margin: '20px auto' }}>
            Découvrez les meilleurs services B2B et opportunités professionnelles au Sénégal
          </Paragraph>
        </div>

        <FilterSection>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={10}>
              <Search
                placeholder="Rechercher un service..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onChange={e => setSearchQuery(e.target.value)}
              />
            </Col>
            <Col xs={12} md={7}>
              <Select
                size="large"
                style={{ width: '100%' }}
                placeholder="Catégorie"
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={7}>
              <Select
                size="large"
                style={{ width: '100%' }}
                placeholder="Localisation"
                value={selectedLocation}
                onChange={setSelectedLocation}
              >
                {locations.map(location => (
                  <Option key={location} value={location}>{location}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        </FilterSection>

        <Row gutter={[24, 24]}>
          {filteredProducts.map(product => (
            <Col xs={24} sm={12} lg={6} key={product.id}>
              <ProductCard
                cover={
                  <img
                    alt={product.title}
                    src={product.image}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button type="primary" icon={<ShoppingOutlined />} block>
                    Contacter
                  </Button>
                ]}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Tag color="blue">{product.category}</Tag>
                  
                  <Title level={4} style={{ marginBottom: 0 }}>
                    {product.title}
                  </Title>

                  <Space>
                    <Rate disabled defaultValue={product.rating} style={{ fontSize: 12 }} />
                    <Text type="secondary">({product.reviews})</Text>
                  </Space>

                  <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 16 }}>
                    {product.description}
                  </Paragraph>

                  <Space split={<Text type="secondary">•</Text>}>
                    <Text strong style={{ color: '#1890ff' }}>
                      {product.price} FCFA
                    </Text>
                    <Space>
                      <EnvironmentOutlined />
                      <Text>{product.location}</Text>
                    </Space>
                  </Space>

                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                    <Space>
                      <ShopOutlined />
                      <Text>{product.seller.name}</Text>
                      {product.seller.verified && (
                        <Tag color="green">Vérifié</Tag>
                      )}
                    </Space>
                  </div>
                </Space>
              </ProductCard>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Pagination
            current={currentPage}
            onChange={setCurrentPage}
            total={50}
            showSizeChanger={false}
          />
        </div>
      </Container>
    </StyledLayout>
  );
};

export default MarketplacePage; 