import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Input, Button, Tag, Space, Avatar, List, Modal, Form, message, Select } from 'antd';
import {
  MessageOutlined,
  UserOutlined,
  LikeOutlined,
  CommentOutlined,
  SearchOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Search } = Input;
const { Option } = Select;

interface User {
  name?: string;
}

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%);
  padding: 60px 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TopicCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 15px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`;

interface Topic {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  likes: number;
  comments: number;
  tags: string[];
}

const mockTopics: Topic[] = [
  {
    id: 1,
    title: 'Comment optimiser son CV pour le marché sénégalais ?',
    content: 'Je souhaite avoir vos conseils pour adapter mon CV aux attentes des recruteurs locaux...',
    author: 'Fatou Diop',
    date: '2024-03-15',
    category: 'Carrière',
    likes: 24,
    comments: 12,
    tags: ['CV', 'Emploi', 'Conseils']
  },
  {
    id: 2,
    title: 'Les opportunités dans le secteur des énergies renouvelables',
    content: 'Discussion sur le potentiel du secteur des énergies renouvelables au Sénégal...',
    author: 'Moussa Sall',
    date: '2024-03-14',
    category: 'Secteurs',
    likes: 18,
    comments: 8,
    tags: ['Énergie', 'Développement durable']
  },
  {
    id: 3,
    title: 'Retour d\'expérience : Création d\'entreprise à Dakar',
    content: 'Je partage mon expérience de création d\'entreprise dans le digital à Dakar...',
    author: 'Aminata Kane',
    date: '2024-03-13',
    category: 'Entrepreneuriat',
    likes: 32,
    comments: 15,
    tags: ['Startup', 'Digital', 'Entrepreneuriat']
  }
];

const categories = [
  'Tous',
  'Carrière',
  'Entrepreneuriat',
  'Formation',
  'Technologie',
  'Finance',
  'Secteurs'
];

const ForumPage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const filteredTopics = topics.filter(topic => {
    const matchesCategory = selectedCategory === 'Tous' || topic.category === selectedCategory;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateTopic = async (values: any) => {
    try {
      if (!user) {
        message.error('Vous devez être connecté pour créer un sujet');
        return;
      }

      const newTopic: Topic = {
        id: topics.length + 1,
        title: values.title,
        content: values.content,
        author: user.name || 'Anonyme',
        date: new Date().toISOString().split('T')[0],
        category: values.category,
        likes: 0,
        comments: 0,
        tags: values.tags.split(',').map((tag: string) => tag.trim())
      };

      setTopics([newTopic, ...topics]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Sujet créé avec succès !');
    } catch (error) {
      message.error('Une erreur est survenue lors de la création du sujet');
    }
  };

  const handleLike = (topicId: number) => {
    try {
      if (!user) {
        message.info('Connectez-vous pour aimer ce sujet');
        return;
      }

      setTopics(topics.map(topic => 
        topic.id === topicId ? { ...topic, likes: topic.likes + 1 } : topic
      ));
    } catch (error) {
      message.error('Une erreur est survenue');
    }
  };

  return (
    <StyledLayout>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Title level={1}>
            Forum BusinessConnect
          </Title>
          <Paragraph style={{ fontSize: '1.2rem', maxWidth: 800, margin: '20px auto' }}>
            Échangez avec la communauté professionnelle du Sénégal
          </Paragraph>
        </div>

        <FilterSection>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={8}>
              <Search
                placeholder="Rechercher un sujet..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
              />
            </Col>
            <Col xs={12} md={8}>
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
            <Col xs={12} md={8} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                size="large"
                icon={<MessageOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Nouveau sujet
              </Button>
            </Col>
          </Row>
        </FilterSection>

        <List
          itemLayout="vertical"
          size="large"
          dataSource={filteredTopics}
          renderItem={topic => (
            <TopicCard>
              <List.Item
                key={topic.id}
                actions={[
                  <Space onClick={() => handleLike(topic.id)} style={{ cursor: 'pointer' }}>
                    <LikeOutlined />
                    <Text>{topic.likes}</Text>
                  </Space>,
                  <Space>
                    <CommentOutlined />
                    <Text>{topic.comments}</Text>
                  </Space>
                ]}
                extra={
                  <Space direction="vertical" align="end">
                    <Tag color="blue">{topic.category}</Tag>
                    <Text type="secondary">{topic.date}</Text>
                  </Space>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={<a href={`/forum/topic/${topic.id}`}>{topic.title}</a>}
                  description={
                    <Space size={[0, 8]} wrap>
                      {topic.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  }
                />
                <Paragraph ellipsis={{ rows: 2 }}>
                  {topic.content}
                </Paragraph>
                <Text type="secondary">Par {topic.author}</Text>
              </List.Item>
            </TopicCard>
          )}
        />

        <Modal
          title="Créer un nouveau sujet"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateTopic}
          >
            <Form.Item
              name="title"
              label="Titre"
              rules={[{ required: true, message: 'Veuillez saisir un titre' }]}
            >
              <Input size="large" placeholder="Titre de votre sujet" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Catégorie"
              rules={[{ required: true, message: 'Veuillez choisir une catégorie' }]}
            >
              <Select size="large" placeholder="Sélectionnez une catégorie">
                {categories.slice(1).map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="tags"
              label="Tags (séparés par des virgules)"
              rules={[{ required: true, message: 'Veuillez ajouter au moins un tag' }]}
            >
              <Input size="large" placeholder="Ex: Emploi, Digital, Formation" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Contenu"
              rules={[{ required: true, message: 'Veuillez saisir le contenu' }]}
            >
              <TextArea
                rows={6}
                placeholder="Décrivez votre sujet en détail..."
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Publier
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Container>
    </StyledLayout>
  );
};

export default ForumPage; 