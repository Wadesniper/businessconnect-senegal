import React from 'react';
import { Typography, Card, Space, Divider, Table } from 'antd';

const { Title, Paragraph, Text } = Typography;

const Cookies: React.FC = () => {
  const cookieTypes = [
    {
      key: '1',
      type: 'Cookies essentiels',
      description: 'Nécessaires au fonctionnement du site',
      duree: 'Session',
      obligatoire: 'Oui',
    },
    {
      key: '2',
      type: 'Cookies de performance',
      description: 'Analyse de l\'utilisation du site',
      duree: '13 mois',
      obligatoire: 'Non',
    },
    {
      key: '3',
      type: 'Cookies de fonctionnalité',
      description: 'Personnalisation de l\'expérience utilisateur',
      duree: '6 mois',
      obligatoire: 'Non',
    },
    {
      key: '4',
      type: 'Cookies de ciblage',
      description: 'Publicités personnalisées',
      duree: '13 mois',
      obligatoire: 'Non',
    },
  ];

  const columns = [
    {
      title: 'Type de cookie',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Durée de conservation',
      dataIndex: 'duree',
      key: 'duree',
    },
    {
      title: 'Obligatoire',
      dataIndex: 'obligatoire',
      key: 'obligatoire',
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <Card>
        <Typography>
          <Title level={1}>Politique des Cookies</Title>
          
          <Paragraph>
            Cette politique explique comment BusinessConnect Sénégal utilise les cookies et technologies similaires pour vous fournir la meilleure expérience possible sur notre plateforme.
          </Paragraph>

          <Title level={2}>Qu'est-ce qu'un cookie ?</Title>
          <Paragraph>
            Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies nous permettent de :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Mémoriser vos préférences</Text>
            <Text>• Comprendre comment vous utilisez notre site</Text>
            <Text>• Améliorer votre expérience</Text>
            <Text>• Vous proposer des contenus pertinents</Text>
          </Space>

          <Title level={2}>Types de cookies utilisés</Title>
          <Table 
            dataSource={cookieTypes} 
            columns={columns} 
            pagination={false}
            style={{ marginTop: 16, marginBottom: 24 }}
          />

          <Title level={2}>Gestion des cookies</Title>
          <Paragraph>
            Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Accepter ou refuser les cookies via notre bannière de consentement</Text>
            <Text>• Modifier les paramètres de votre navigateur</Text>
            <Text>• Supprimer tous les cookies déjà stockés sur votre appareil</Text>
          </Space>

          <Title level={2}>Impact du refus des cookies</Title>
          <Paragraph>
            Le refus des cookies non essentiels peut :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Limiter certaines fonctionnalités du site</Text>
            <Text>• Réduire la personnalisation de votre expérience</Text>
            <Text>• Affecter la pertinence des contenus affichés</Text>
          </Space>

          <Title level={2}>Cookies tiers</Title>
          <Paragraph>
            Nous utilisons des services tiers qui peuvent placer des cookies sur votre appareil :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Google Analytics (analyse d'audience)</Text>
            <Text>• Services de paiement</Text>
            <Text>• Réseaux sociaux</Text>
          </Space>

          <Title level={2}>Durée de conservation</Title>
          <Paragraph>
            La durée de conservation des cookies varie selon leur type, comme indiqué dans le tableau ci-dessus. À l'expiration de cette période, les cookies sont automatiquement supprimés.
          </Paragraph>

          <Title level={2}>Mise à jour</Title>
          <Paragraph>
            Nous pouvons mettre à jour cette politique des cookies à tout moment. Nous vous encourageons à la consulter régulièrement pour rester informé de nos pratiques.
          </Paragraph>

          <Title level={2}>Contact</Title>
          <Paragraph>
            Pour toute question concernant notre utilisation des cookies, contactez-nous à :
            <br />
            <a href="mailto:privacy@businessconnectsenegal.com">privacy@businessconnectsenegal.com</a>
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

export default Cookies; 