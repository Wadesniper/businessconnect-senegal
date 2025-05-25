import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  message, 
  Upload, 
  Card, 
  Typography,
  Tag,
  Input,
  Form,
  Spin
} from 'antd';
import { 
  DeleteOutlined, 
  EditOutlined, 
  UploadOutlined,
  InboxOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import { adminService } from '../../../services/adminService';

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  applications: number;
}

const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchJobs = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await adminService.getJobs(page, pageSize);
      setJobs(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.total,
      });
    } catch (error) {
      message.error('Erreur lors du chargement des offres d\'emploi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchJobs(pagination.current, pagination.pageSize);
  };

  const handleStatusChange = async (jobId: string, newStatus: 'active' | 'inactive') => {
    try {
      await adminService.updateJob(jobId, { status: newStatus });
      message.success('Statut mis à jour avec succès');
      fetchJobs(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (jobId: string) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer cette offre ?',
      content: 'Cette action est irréversible.',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk: async () => {
        try {
          await adminService.deleteJob(jobId);
          message.success('Offre supprimée avec succès');
          fetchJobs(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error('Erreur lors de la suppression');
        }
      },
    });
  };

  const handleImport = async (file: File) => {
    try {
      await adminService.importJobsFromFile(file);
      message.success('Import réussi');
      fetchJobs(pagination.current, pagination.pageSize);
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error('Erreur lors de l\'import');
      return false;
    }
  };

  const handleCreateJob = async (values: any) => {
    try {
      await adminService.createJob(values);
      message.success('Offre créée avec succès');
      setIsModalVisible(false);
      form.resetFields();
      fetchJobs(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Erreur lors de la création de l\'offre');
    }
  };

  const columns = [
    {
      title: 'Titre',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Entreprise',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Lieu',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'expired' ? 'red' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date de création',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Candidatures',
      dataIndex: 'applications',
      key: 'applications',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Job) => (
        <Space>
          <Button
            type={record.status === 'active' ? 'default' : 'primary'}
            onClick={() => handleStatusChange(record.id, record.status === 'active' ? 'inactive' : 'active')}
          >
            {record.status === 'active' ? 'Désactiver' : 'Activer'}
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Modifier
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchText.toLowerCase()) ||
    job.company.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement des offres d'emploi..." /></div>;
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={4}>Import d'offres par lot</Title>
          <Text>Importez plusieurs offres d'emploi à partir d'un fichier Word (.docx)</Text>
          <Dragger
            accept=".docx"
            beforeUpload={(file) => handleImport(file)}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Cliquez ou glissez-déposez un fichier Word ici
            </p>
            <p className="ant-upload-hint">
              Le fichier doit suivre le format spécifié dans le modèle
            </p>
          </Dragger>
        </Card>

        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              Nouvelle offre
            </Button>
            <Input
              placeholder="Rechercher une offre..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredJobs}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
        />

        <Modal
          title="Offre d'emploi"
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateJob}
          >
            <Form.Item
              name="title"
              label="Titre"
              rules={[{ required: true, message: 'Le titre est requis' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="company"
              label="Entreprise"
              rules={[{ required: true, message: 'L\'entreprise est requise' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="location"
              label="Lieu"
              rules={[{ required: true, message: 'Le lieu est requis' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="type"
              label="Type de contrat"
              rules={[{ required: true, message: 'Le type de contrat est requis' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'La description est requise' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Enregistrer
                </Button>
                <Button onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}>
                  Annuler
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  );
};

export default JobManagement; 