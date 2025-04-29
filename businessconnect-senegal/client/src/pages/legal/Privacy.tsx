import React from 'react';
import { Typography, Card, Space, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

const Privacy: React.FC = () => {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <Card>
        <Typography>
          <Title level={1}>Politique de Confidentialité</Title>
          
          <Paragraph>
            La protection de vos données personnelles est une priorité pour BusinessConnect Sénégal. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
          </Paragraph>

          <Title level={2}>1. Collecte des données</Title>
          <Paragraph>
            Nous collectons les données suivantes :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Informations d'identification (nom, prénom, email)</Text>
            <Text>• Informations professionnelles (CV, expérience, compétences)</Text>
            <Text>• Données de connexion et d'utilisation</Text>
            <Text>• Informations de paiement (pour les services payants)</Text>
          </Space>

          <Title level={2}>2. Utilisation des données</Title>
          <Paragraph>
            Vos données sont utilisées pour :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Fournir nos services</Text>
            <Text>• Personnaliser votre expérience</Text>
            <Text>• Communiquer avec vous</Text>
            <Text>• Améliorer nos services</Text>
            <Text>• Respecter nos obligations légales</Text>
          </Space>

          <Title level={2}>3. Protection des données</Title>
          <Paragraph>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre :
          </Paragraph>
          <Space direction="vertical">
            <Text>• L'accès non autorisé</Text>
            <Text>• La modification</Text>
            <Text>• La divulgation</Text>
            <Text>• La destruction</Text>
          </Space>

          <Title level={2}>4. Partage des données</Title>
          <Paragraph>
            Vos données peuvent être partagées avec :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Nos partenaires de service (hébergement, paiement)</Text>
            <Text>• Les recruteurs (si vous postulez à une offre)</Text>
            <Text>• Les autorités (sur demande légale)</Text>
          </Space>

          <Title level={2}>5. Vos droits</Title>
          <Paragraph>
            Conformément à la loi, vous disposez des droits suivants :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Droit d'accès à vos données</Text>
            <Text>• Droit de rectification</Text>
            <Text>• Droit à l'effacement</Text>
            <Text>• Droit à la portabilité</Text>
            <Text>• Droit d'opposition</Text>
          </Space>

          <Title level={2}>6. Cookies</Title>
          <Paragraph>
            Nous utilisons des cookies pour :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Améliorer la navigation</Text>
            <Text>• Mémoriser vos préférences</Text>
            <Text>• Analyser l'utilisation du site</Text>
            <Text>• Personnaliser le contenu</Text>
          </Space>

          <Title level={2}>7. Conservation des données</Title>
          <Paragraph>
            Nous conservons vos données pendant la durée nécessaire à la fourniture de nos services et conformément aux obligations légales. Vous pouvez demander la suppression de votre compte à tout moment.
          </Paragraph>

          <Title level={2}>8. Transfert international</Title>
          <Paragraph>
            Vos données peuvent être transférées et stockées dans des pays hors du Sénégal. Nous nous assurons que ces transferts respectent la réglementation applicable en matière de protection des données.
          </Paragraph>

          <Title level={2}>9. Contact</Title>
          <Paragraph>
            Pour toute question concernant notre politique de confidentialité ou pour exercer vos droits, contactez-nous à :
            <br />
            <a href="mailto:privacy@businessconnectsenegal.com">privacy@businessconnectsenegal.com</a>
          </Paragraph>

          <Title level={2}>10. Modifications</Title>
          <Paragraph>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications importantes seront notifiées par email.
          </Paragraph>

          <Divider />

          <Paragraph type="secondary" style={{ marginTop: 24 }}>
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default Privacy; 