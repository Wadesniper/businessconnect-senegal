import React from 'react';
import { Typography, Card, Space, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

const CGU: React.FC = () => {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <Card>
        <Typography>
          <Title level={1}>Conditions Générales d'Utilisation</Title>
          
          <Title level={2}>1. Acceptation des conditions</Title>
          <Paragraph>
            En accédant et en utilisant le site BusinessConnect Sénégal, vous acceptez sans réserve les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
          </Paragraph>

          <Title level={2}>2. Description des services</Title>
          <Paragraph>
            BusinessConnect Sénégal est une plateforme professionnelle offrant les services suivants :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Recherche et publication d'offres d'emploi</Text>
            <Text>• Création et gestion de profils professionnels</Text>
            <Text>• Mise en relation professionnelle</Text>
            <Text>• Accès à des formations</Text>
            <Text>• Participation au forum professionnel</Text>
            <Text>• Utilisation de la marketplace B2B</Text>
          </Space>

          <Title level={2}>3. Inscription et compte utilisateur</Title>
          <Paragraph>
            L'inscription est gratuite mais nécessaire pour accéder à certains services. Vous vous engagez à :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Fournir des informations exactes et à jour</Text>
            <Text>• Maintenir la confidentialité de vos identifiants</Text>
            <Text>• Ne pas créer de faux comptes ou usurper l'identité d'autrui</Text>
            <Text>• Informer immédiatement en cas de compromission de votre compte</Text>
          </Space>

          <Title level={2}>4. Règles de conduite</Title>
          <Paragraph>
            Les utilisateurs s'engagent à :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Respecter les lois en vigueur</Text>
            <Text>• Ne pas publier de contenus illégaux ou inappropriés</Text>
            <Text>• Ne pas harceler ou discriminer d'autres utilisateurs</Text>
            <Text>• Ne pas diffuser de spam ou de contenus publicitaires non autorisés</Text>
            <Text>• Respecter la propriété intellectuelle</Text>
          </Space>

          <Title level={2}>5. Modération</Title>
          <Paragraph>
            BusinessConnect Sénégal se réserve le droit de :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Modérer tout contenu publié sur la plateforme</Text>
            <Text>• Supprimer tout contenu inapproprié</Text>
            <Text>• Suspendre ou supprimer les comptes ne respectant pas les CGU</Text>
          </Space>

          <Title level={2}>6. Propriété intellectuelle</Title>
          <Paragraph>
            Tous les contenus présents sur le site (logos, textes, graphiques, etc.) sont protégés par les droits de propriété intellectuelle. Toute reproduction sans autorisation est interdite.
          </Paragraph>

          <Title level={2}>7. Protection des données</Title>
          <Paragraph>
            Nous nous engageons à protéger vos données personnelles conformément à la loi sénégalaise sur la protection des données personnelles. Pour plus d'informations, consultez notre politique de confidentialité.
          </Paragraph>

          <Title level={2}>8. Limitation de responsabilité</Title>
          <Paragraph>
            BusinessConnect Sénégal ne peut être tenu responsable :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Des contenus publiés par les utilisateurs</Text>
            <Text>• Des transactions effectuées entre utilisateurs</Text>
            <Text>• Des interruptions ou dysfonctionnements du service</Text>
            <Text>• Des dommages directs ou indirects liés à l'utilisation du site</Text>
          </Space>

          <Title level={2}>9. Modification des CGU</Title>
          <Paragraph>
            BusinessConnect Sénégal se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications importantes par email.
          </Paragraph>

          <Title level={2}>10. Droit applicable</Title>
          <Paragraph>
            Les présentes CGU sont régies par le droit sénégalais. Tout litige sera soumis aux tribunaux compétents de Dakar.
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

export default CGU; 