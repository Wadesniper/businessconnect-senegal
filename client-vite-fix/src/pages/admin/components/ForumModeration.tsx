import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  message, 
  Tag, 
  Input,
  Typography,
  Card
} from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  EyeOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import { adminService } from '../../../services/adminService';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

interface ForumPost {
  id: string;
  title: string;
  author: string;
  content: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reports: number;
}

const ForumModeration: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchPosts = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await adminService.getForumPosts(page, pageSize);
      setPosts(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.total,
      });
    } catch (error) {
      message.error('Erreur lors du chargement des posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchPosts(pagination.current, pagination.pageSize);
  };

  const handleModeration = async (postId: string, action: 'approve' | 'reject') => {
    try {
      await adminService.moderatePost(postId, action, action === 'reject' ? rejectReason : undefined);
      message.success(`Post ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`);
      setIsModalVisible(false);
      setRejectReason('');
      fetchPosts(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Erreur lors de la modération');
    }
  };

  const showRejectModal = (post: ForumPost) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'orange';
    }
  };

  const columns = [
    {
      title: 'Titre',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Auteur',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Date de création',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Signalements',
      dataIndex: 'reports',
      key: 'reports',
      render: (reports: number) => (
        <Tag color={reports > 0 ? 'red' : 'green'}>{reports}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ForumPost) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleModeration(record.id, 'approve')}
            disabled={record.status === 'approved'}
          >
            Approuver
          </Button>
          <Button
            danger
            onClick={() => showRejectModal(record)}
            disabled={record.status === 'rejected'}
          >
            Rejeter
          </Button>
          <Button
            onClick={() => Modal.info({
              title: 'Contenu du post',
              content: (
                <div>
                  <p><strong>Titre:</strong> {record.title}</p>
                  <p><strong>Contenu:</strong></p>
                  <p>{record.content}</p>
                </div>
              ),
              width: 600,
            })}
          >
            Voir le contenu
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>Modération du Forum</Title>
      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <Modal
        title="Raison du rejet"
        visible={isModalVisible}
        onOk={() => selectedPost && handleModeration(selectedPost.id, 'reject')}
        onCancel={() => {
          setIsModalVisible(false);
          setRejectReason('');
        }}
        okText="Confirmer"
        cancelText="Annuler"
      >
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Veuillez indiquer la raison du rejet..."
        />
      </Modal>
    </div>
  );
};

export default ForumModeration; 