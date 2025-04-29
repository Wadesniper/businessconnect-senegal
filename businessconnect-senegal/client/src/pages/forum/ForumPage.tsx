import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Tabs, Space, Input, Avatar, Tag, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CreateDiscussionModal from './CreateDiscussionModal';
import { authService } from '../../services/authService';
import { api } from '../../services/api';
import { Discussion } from '../../data/forumData';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Search } = Input;

const ForumPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { key: 'all', label: 'Toutes les discussions' },
    { key: 'emploi', label: 'Emploi' },
    { key: 'formation', label: 'Formation' },
    { key: 'entrepreneuriat', label: 'Entrepreneuriat' },
    { key: 'conseils', label: 'Conseils' },
    { key: 'networking', label: 'Networking' },
    { key: 'financement', label: 'Financement' }
  ];

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const response = await api.get('/forum/discussions');
      setDiscussions(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement des discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = () => {
    if (!authService.getToken()) {
      message.warning('Veuillez vous connecter pour créer une discussion');
      navigate('/login');
      return;
    }
    setIsCreateModalVisible(true);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = activeCategory === 'all' || discussion.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Forum de la communauté</h1>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateDiscussion}
            >
              Nouvelle discussion
            </Button>
          </div>

          <Search
            placeholder="Rechercher une discussion..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: 500 }}
          />

          <Tabs
            activeKey={activeCategory}
            onChange={setActiveCategory}
            items={categories.map(category => ({
              key: category.key,
              label: category.label,
            }))}
          />

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {filteredDiscussions.map(discussion => (
              <Card
                key={discussion.id}
                hoverable
                onClick={() => navigate(`/forum/${discussion.id}`)}
              >
                <Card.Meta
                  avatar={<Avatar src={discussion.author.avatar}>{discussion.author.name[0]}</Avatar>}
                  title={discussion.title}
                  description={
                    <Space direction="vertical" size="small">
                      <div>{discussion.content}</div>
                      <Space>
                        <Tag color="blue">{discussion.category}</Tag>
                        <span>{discussion.repliesCount} réponses</span>
                        <span>{discussion.likesCount} likes</span>
                        <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                      </Space>
                    </Space>
                  }
                />
              </Card>
            ))}
          </Space>
        </Space>

        <CreateDiscussionModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onSuccess={() => {
            setIsCreateModalVisible(false);
            message.success('Discussion créée avec succès !');
            fetchDiscussions();
          }}
        />
      </Content>
    </Layout>
  );
};

export default ForumPage; 