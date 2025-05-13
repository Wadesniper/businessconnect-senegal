import React from 'react';
import { Typography, Collapse, Card, Button } from 'antd';
import { MailOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <Card>
        <Typography>
          <Title level={1} style={{ textAlign: 'center' }}>
            <QuestionCircleOutlined style={{ color: '#1890ff', marginRight: 12 }} />
            Centre d'aide / FAQ
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: 18 }}>
            Retrouvez ici les réponses aux questions les plus fréquentes sur BusinessConnect Sénégal.
          </Paragraph>
        </Typography>
        <Collapse accordion style={{ marginTop: 32 }}>
          <Panel header="Comment m'abonner à BusinessConnect Sénégal ?" key="1">
            <Text>
              Rendez-vous sur la page Abonnement, choisissez l'offre adaptée à votre profil, puis suivez les instructions pour le paiement sécurisé via CinetPay.
            </Text>
          </Panel>
          <Panel header="Quels moyens de paiement sont acceptés ?" key="2">
            <Text>
              Les paiements se font via CinetPay : Mobile Money (Orange, Free, Wave), carte bancaire, ou virement bancaire.
            </Text>
          </Panel>
          <Panel header="Comment créer et exporter mon CV ?" key="3">
            <Text>
              Après abonnement, accédez au Générateur de CV, sélectionnez un template, remplissez vos informations, personnalisez, puis exportez en PDF ou Word.
            </Text>
          </Panel>
          <Panel header="Je n'arrive pas à accéder à une offre d'emploi, pourquoi ?" key="4">
            <Text>
              L'accès aux détails et à la candidature nécessite un abonnement actif. Vérifiez votre statut d'abonnement ou contactez le support si besoin.
            </Text>
          </Panel>
          <Panel header="Comment contacter le support ?" key="5">
            <Text>
              Utilisez le formulaire de contact ou écrivez-nous à <a href="mailto:contact@businessconnectsenegal.com">contact@businessconnectsenegal.com</a>.
            </Text>
          </Panel>
          <Panel header="Mes données sont-elles protégées ?" key="6">
            <Text>
              Oui, nous respectons la loi sénégalaise sur la protection des données personnelles. Consultez notre politique de confidentialité pour plus d'informations.
            </Text>
          </Panel>
        </Collapse>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Paragraph>Vous n'avez pas trouvé la réponse à votre question ?</Paragraph>
          <Button
            type="primary"
            icon={<MailOutlined />}
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