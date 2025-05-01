import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Empty, 
  Spin, 
  List,
  message,
  Modal
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  DownloadOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { cvService, CV, CVTemplate } from '../../services/cvService';

const { Title, Paragraph } = Typography;

const CVGeneratorPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [myCVs, setMyCVs] = useState<CV[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesData, cvsData] = await Promise.all([
          cvService.getTemplates(),
          cvService.getMyCVs()
        ]);
        setTemplates(templatesData);
        setMyCVs(cvsData);
      } catch (error) {
        message.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCV = () => {
    if (selectedTemplate) {
      navigate(`/cv-generator/create/${selectedTemplate}`);
    } else {
      message.warning('Veuillez sélectionner un template');
    }
  };

  const handleDeleteCV = async (id: string) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer ce CV ?',
      content: 'Cette action est irréversible.',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          await cvService.deleteCV(id);
          setMyCVs(myCVs.filter(cv => cv.id !== id));
          message.success('CV supprimé avec succès');
        } catch (error) {
          message.error('Erreur lors de la suppression du CV');
        }
      }
    });
  };

  const handleDownloadCV = async (id: string) => {
    try {
      const blob = await cvService.generatePDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cv-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error('Erreur lors du téléchargement du CV');
    }
  };

  const handleShareCV = async (id: string) => {
    Modal.confirm({
      title: 'Partager le CV',
      content: 'Cette fonctionnalité sera bientôt disponible',
      okText: 'OK',
      cancelText: 'Annuler'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Générateur de CV</Title>

      {/* Section Templates */}
      <Title level={3} style={{ marginTop: '24px' }}>
        Templates disponibles
      </Title>
      <Row gutter={[16, 16]}>
        {templates.map(template => (
          <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
            <Card
              hoverable
              cover={<img alt={template.name} src={template.preview} />}
              onClick={() => setSelectedTemplate(template.id)}
              style={{ 
                border: selectedTemplate === template.id ? '2px solid #1890ff' : undefined 
              }}
            >
              <Card.Meta
                title={template.name}
                description={template.description}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        onClick={handleCreateCV}
        style={{ marginTop: '24px' }}
      >
        Créer un nouveau CV
      </Button>

      {/* Section Mes CVs */}
      <Title level={3} style={{ marginTop: '48px' }}>
        Mes CVs
      </Title>
      
      {myCVs.length === 0 ? (
        <Empty
          description="Vous n'avez pas encore créé de CV"
          style={{ margin: '40px 0' }}
        />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={myCVs}
          renderItem={cv => (
            <List.Item>
              <Card
                actions={[
                  <EditOutlined key="edit" onClick={() => navigate(`/cv-generator/edit/${cv.id}`)} />,
                  <DeleteOutlined key="delete" onClick={() => handleDeleteCV(cv.id)} />,
                  <DownloadOutlined key="download" onClick={() => handleDownloadCV(cv.id)} />,
                  <ShareAltOutlined key="share" onClick={() => handleShareCV(cv.id)} />
                ]}
              >
                <Card.Meta
                  title={cv.personalInfo.fullName}
                  description={`Créé le ${new Date(cv.createdAt).toLocaleDateString('fr-FR')}`}
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default CVGeneratorPage; 