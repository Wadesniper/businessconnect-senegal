import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Card, Button, Space, Avatar, Typography, Input, message, Tag, Divider, Spin } from 'antd';
import { LikeOutlined, MessageOutlined, FlagOutlined } from '@ant-design/icons';
import { api } from '../../services/api';
import { authService } from '../../services/authService';

const { Content } = Layout;
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likesCount: number;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  createdAt: string;
  repliesCount: number;
  likesCount: number;
  replies: Reply[];
}

const DiscussionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      const response = await api.get(`/forum/discussions/${id}`);
      setDiscussion(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement de la discussion');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!authService.getToken()) {
      message.warning('Veuillez vous connecter pour liker');
      navigate('/login');
      return;
    }
    try {
      await api.post(`/forum/discussions/${id}/like`);
      setDiscussion(prev => prev ? {
        ...prev,
        likesCount: prev.likesCount + 1
      } : null);
    } catch (error) {
      message.error('Erreur lors du like');
    }
  };

  const handleReply = async () => {
    if (!authService.getToken()) {
      message.warning('Veuillez vous connecter pour répondre');
      navigate('/login');
      return;
    }
    if (!replyContent.trim()) {
      message.warning('Veuillez entrer une réponse');
      return;
    }
    try {
      setSubmitting(true);
      await api.post(`/forum/discussions/${id}/replies`, { content: replyContent });
      setReplyContent('');
      fetchDiscussion();
      message.success('Réponse publiée avec succès !');
    } catch (error) {
      message.error('Erreur lors de la publication de la réponse');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!authService.getToken()) {
      message.warning('Veuillez vous connecter pour signaler');
      navigate('/login');
      return;
    }
    try {
      await api.post(`/forum/discussions/${id}/report`);
      message.success('Signalement envoyé avec succès');
    } catch (error) {
      message.error('Erreur lors du signalement');
    }
  };

  if (loading) {
    return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement de la discussion..." /></div>;
  }

  if (!discussion) {
    return <div>Discussion non trouvée</div>;
  }

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Title level={2}>{discussion.title}</Title>
                <Space>
                  <Avatar src={discussion.author.avatar}>{discussion.author.name[0]}</Avatar>
                  <span>{discussion.author.name}</span>
                  <Tag color="blue">{discussion.category}</Tag>
                  <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                </Space>
              </div>

              <Paragraph>{discussion.content}</Paragraph>

              <Space>
                <Button
                  icon={<LikeOutlined />}
                  onClick={handleLike}
                >
                  {discussion.likesCount} J'aime
                </Button>
                <Button
                  icon={<MessageOutlined />}
                >
                  {discussion.repliesCount} Réponses
                </Button>
                <Button
                  icon={<FlagOutlined />}
                  onClick={handleReport}
                >
                  Signaler
                </Button>
              </Space>
            </Space>
          </Card>

          <Divider>Réponses ({discussion.repliesCount})</Divider>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {discussion.replies.map(reply => (
              <Card key={reply.id}>
                <Card.Meta
                  avatar={<Avatar src={reply.author.avatar}>{reply.author.name[0]}</Avatar>}
                  title={
                    <Space>
                      <span>{reply.author.name}</span>
                      <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                    </Space>
                  }
                  description={reply.content}
                />
              </Card>
            ))}
          </Space>

          <Card>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <TextArea
                rows={4}
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Votre réponse..."
              />
              <Button
                type="primary"
                onClick={handleReply}
                loading={submitting}
              >
                Publier la réponse
              </Button>
            </Space>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};

export default DiscussionDetail; 