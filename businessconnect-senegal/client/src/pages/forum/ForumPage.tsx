import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Tabs, Space, Input, Avatar, Tag, message, Pagination, Empty, Spin } from 'antd';
import { PlusOutlined, SearchOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CreateDiscussionModal from './CreateDiscussionModal';
import { useAuth } from '../../hooks/useAuth';
import { forumService } from '../../services/forumService';
import { Discussion, ForumCategory, ForumFilters } from '../../types/forum';
import styles from './Forum.module.css';

const { Content } = Layout;
const { Search } = Input;

const ITEMS_PER_PAGE = 10;

const categories: { key: ForumCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Toutes les discussions' },
  { key: 'emploi', label: 'Emploi' },
  { key: 'formation', label: 'Formation' },
  { key: 'entrepreneuriat', label: 'Entrepreneuriat' },
  { key: 'conseils', label: 'Conseils' },
  { key: 'networking', label: 'Networking' },
  { key: 'financement', label: 'Financement' }
];

const ForumPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ForumFilters>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    sortBy: 'recent'
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchDiscussions();
  }, [filters]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const response = await forumService.getDiscussions(filters);
      setDiscussions(response.discussions);
      setTotal(response.total);
    } catch (error) {
      message.error('Erreur lors du chargement des discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = () => {
    if (!user) {
      message.warning('Veuillez vous connecter pour créer une discussion');
      navigate('/auth/login');
      return;
    }
    setIsCreateModalVisible(true);
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: value,
      page: 1
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: category === 'all' ? undefined : category as ForumCategory,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleLikeDiscussion = async (discussion: Discussion, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) {
      message.warning('Veuillez vous connecter pour liker une discussion');
      navigate('/auth/login');
      return;
    }
    try {
      await forumService.likeDiscussion(discussion.id);
      setDiscussions(prev => prev.map(d => 
        d.id === discussion.id 
          ? { ...d, likesCount: d.likesCount + 1, isLiked: true }
          : d
      ));
    } catch (error) {
      message.error('Erreur lors du like');
    }
  };

  return (
    <Layout className={styles.container}>
      <Content>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className={styles.header}>
            <h1>Forum de la communauté</h1>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateDiscussion}
            >
              Nouvelle discussion
            </Button>
          </div>

          <div className={styles.filters}>
            <Search
              placeholder="Rechercher une discussion..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              className={styles.searchBar}
            />

            <Tabs
              activeKey={filters.category || 'all'}
              onChange={handleCategoryChange}
              items={categories.map(category => ({
                key: category.key,
                label: category.label,
              }))}
              className={styles.categoryTabs}
            />
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
            </div>
          ) : discussions.length === 0 ? (
            <Empty
              description="Aucune discussion trouvée"
              className={styles.emptyState}
            />
          ) : (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {discussions.map(discussion => (
                <Card
                  key={discussion.id}
                  hoverable
                  onClick={() => navigate(`/forum/${discussion.id}`)}
                  className={styles.discussionCard}
                >
                  <Card.Meta
                    avatar={
                      <Avatar src={discussion.author.avatar}>
                        {discussion.author.name[0]}
                      </Avatar>
                    }
                    title={discussion.title}
                    description={
                      <Space direction="vertical" size="small">
                        <div className={styles.discussionContent}>
                          {discussion.content}
                        </div>
                        <Space className={styles.discussionMeta}>
                          <Tag color="blue">{discussion.category}</Tag>
                          <Button
                            type="text"
                            icon={<LikeOutlined />}
                            onClick={(e) => handleLikeDiscussion(discussion, e)}
                            className={discussion.isLiked ? styles.liked : ''}
                          >
                            {discussion.likesCount}
                          </Button>
                          <Button
                            type="text"
                            icon={<MessageOutlined />}
                          >
                            {discussion.repliesCount}
                          </Button>
                          <span className={styles.date}>
                            {new Date(discussion.createdAt).toLocaleDateString()}
                          </span>
                        </Space>
                      </Space>
                    }
                  />
                </Card>
              ))}
            </Space>
          )}

          {total > ITEMS_PER_PAGE && (
            <Pagination
              current={filters.page}
              total={total}
              pageSize={ITEMS_PER_PAGE}
              onChange={handlePageChange}
              className={styles.pagination}
            />
          )}
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