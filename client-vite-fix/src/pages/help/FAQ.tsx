import React from 'react';
import { Typography, Collapse, Card, Button } from 'antd';
import { MailOutlined, QuestionCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 950, margin: '0 auto', padding: '0 12px' }}>
      {/* Header visuel premium */}
      <div style={{
        textAlign: 'center',
        margin: '48px 0 24px 0',
        padding: '32px 0 24px 0',
        background: 'linear-gradient(135deg, #e6fff2 0%, #f0f5ff 100%)',
        borderRadius: 32,
        boxShadow: '0 4px 24px #1890ff11',
        position: 'relative',
      }}>
        <QuestionCircleOutlined style={{ fontSize: 64, color: '#1890ff', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 12px #1890ff22', padding: 16, marginBottom: 12 }} />
        <Title level={1} style={{ textAlign: 'center', fontWeight: 800, color: '#1890ff', letterSpacing: 1, fontSize: 36, marginBottom: 8 }}>
          Centre d'aide / FAQ
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 19, color: '#555', maxWidth: 600, margin: '0 auto' }}>
          Toutes les réponses à vos questions sur BusinessConnect Sénégal. <br />Un doute, une hésitation ? Notre équipe est là pour vous accompagner.
        </Paragraph>
        {/* Encarts de réassurance */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 24, flexWrap: 'wrap' }}>
          <div style={{ background: 'linear-gradient(90deg, #e6fff2 0%, #f0f5ff 100%)', borderRadius: 12, padding: '10px 22px', color: '#1ec773', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px #1ec77311', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircleTwoTone twoToneColor="#1ec773" style={{ fontSize: 20 }} /> Support humain & personnalisé
          </div>
          <div style={{ background: 'linear-gradient(90deg, #f0f5ff 0%, #e6fff2 100%)', borderRadius: 12, padding: '10px 22px', color: '#1890ff', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px #1890ff11', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MailOutlined style={{ fontSize: 18, color: '#1890ff' }} /> Réponse rapide
          </div>
          <div style={{ background: 'linear-gradient(90deg, #e6fff2 0%, #fffbe6 100%)', borderRadius: 12, padding: '10px 22px', color: '#faad14', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px #faad1411', display: 'flex', alignItems: 'center', gap: 8 }}>
            <QuestionCircleOutlined style={{ fontSize: 18, color: '#faad14' }} /> Données protégées
          </div>
        </div>
      </div>
      {/* Card FAQ modernisée */}
      <Card style={{ margin: '0 auto', marginTop: -32, borderRadius: 24, boxShadow: '0 8px 32px #1890ff11', background: 'linear-gradient(135deg, #fff 80%, #e6fff2 100%)', border: '1.5px solid #e6f7ff' }}>
        <Collapse accordion style={{ marginTop: 16 }}
          expandIconPosition="right"
        >
          <Panel header={<span><QuestionCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />Comment m'abonner à BusinessConnect Sénégal ?</span>} key="1">
            <Text>
              Rendez-vous sur la page Abonnement, choisissez l'offre adaptée à votre profil, puis suivez les instructions pour le paiement sécurisé via PayTech.
            </Text>
          </Panel>
          <Panel header={<span><QuestionCircleOutlined style={{ color: '#1ec773', marginRight: 8 }} />Quels moyens de paiement sont acceptés ?</span>} key="2">
            <Text>
              Les paiements se font via PayTech : Mobile Money (Orange, Free, Wave), carte bancaire, ou virement bancaire.
            </Text>
          </Panel>
          <Panel header={<span><QuestionCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />Comment créer et exporter mon CV ?</span>} key="3">
            <Text>
              Après abonnement, accédez au Générateur de CV, sélectionnez un template, remplissez vos informations, personnalisez, puis exportez en PDF ou Word.
            </Text>
          </Panel>
          <Panel header={<span><QuestionCircleOutlined style={{ color: '#1ec773', marginRight: 8 }} />Je n'arrive pas à accéder à une offre d'emploi, pourquoi ?</span>} key="4">
            <Text>
              L'accès aux détails et à la candidature nécessite un abonnement actif. Vérifiez votre statut d'abonnement ou contactez le support si besoin.
            </Text>
          </Panel>
          <Panel header={<span><QuestionCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />Comment contacter le support ?</span>} key="5">
            <Text>
              Utilisez le formulaire de contact ou écrivez-nous à <a href="mailto:contact@businessconnectsenegal.com">contact@businessconnectsenegal.com</a>.
            </Text>
          </Panel>
          <Panel header={<span><QuestionCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />Mes données sont-elles protégées ?</span>} key="6">
            <Text>
              Oui, nous respectons la loi sénégalaise sur la protection des données personnelles. Consultez notre politique de confidentialité pour plus d'informations.
            </Text>
          </Panel>
        </Collapse>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Paragraph style={{ fontSize: 17 }}>Vous n'avez pas trouvé la réponse à votre question ?</Paragraph>
          <Button
            type="primary"
            icon={<MailOutlined />}
            size="large"
            style={{
              background: 'linear-gradient(90deg, #1890ff 0%, #1ec773 100%)',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 18,
              height: 52,
              boxShadow: '0 2px 12px #1890ff22',
              marginTop: 8
            }}
            onClick={() => navigate('/contact')}
          >
            Contacter le support
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FAQ; 