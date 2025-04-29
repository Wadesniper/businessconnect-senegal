import React from 'react';
import { Typography, Card, Space, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

const CGV: React.FC = () => {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <Card>
        <Typography>
          <Title level={1}>Conditions Générales de Vente</Title>
          
          <Title level={2}>Article 1 : Objet</Title>
          <Paragraph>
            Les présentes conditions générales de vente régissent les relations contractuelles entre KHALIFA BUSINESS GROUP SARL, ci-après dénommée "BusinessConnect Sénégal" et les utilisateurs des services proposés sur la plateforme BusinessConnect Sénégal.
          </Paragraph>

          <Title level={2}>Article 2 : Services proposés</Title>
          <Paragraph>
            BusinessConnect Sénégal propose les services suivants :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Publication d'offres d'emploi</Text>
            <Text>• Accès à la CVthèque</Text>
            <Text>• Services de recrutement</Text>
            <Text>• Formation professionnelle</Text>
            <Text>• Marketplace B2B</Text>
            <Text>• Forum professionnel</Text>
          </Space>

          <Divider />

          <Title level={2}>Article 3 : Prix et modalités de paiement</Title>
          <Paragraph>
            Les prix des services sont indiqués en Francs CFA (FCFA) toutes taxes comprises. Le paiement s'effectue selon les modalités suivantes :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Paiement en ligne sécurisé</Text>
            <Text>• Virement bancaire</Text>
            <Text>• Mobile Money</Text>
          </Space>

          <Title level={2}>Article 4 : Abonnements</Title>
          <Paragraph>
            Les abonnements sont souscrits pour une durée déterminée. Le renouvellement n'est pas automatique et nécessite une action explicite de l'utilisateur. Les tarifs peuvent être modifiés à tout moment, mais les modifications ne s'appliquent pas aux abonnements en cours.
          </Paragraph>

          <Title level={2}>Article 5 : Responsabilité</Title>
          <Paragraph>
            BusinessConnect Sénégal ne peut être tenu responsable des contenus publiés par les utilisateurs. Nous nous réservons le droit de supprimer tout contenu inapproprié ou ne respectant pas nos conditions d'utilisation.
          </Paragraph>

          <Title level={2}>Article 6 : Résiliation</Title>
          <Paragraph>
            L'abonnement peut être résilié à tout moment par l'utilisateur. Aucun remboursement ne sera effectué pour la période restante de l'abonnement en cours.
          </Paragraph>

          <Title level={2}>Article 7 : Protection des données</Title>
          <Paragraph>
            Les données personnelles collectées sont traitées conformément à notre politique de confidentialité et à la loi sénégalaise sur la protection des données personnelles.
          </Paragraph>

          <Title level={2}>Article 8 : Propriété intellectuelle</Title>
          <Paragraph>
            Tout le contenu du site est protégé par les lois sur la propriété intellectuelle. La reproduction ou l'utilisation sans autorisation est strictement interdite.
          </Paragraph>

          <Title level={2}>Article 9 : Litiges</Title>
          <Paragraph>
            En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux de Dakar seront seuls compétents.
          </Paragraph>

          <Title level={2}>Article 10 : Modification des CGV</Title>
          <Paragraph>
            BusinessConnect Sénégal se réserve le droit de modifier les présentes CGV à tout moment. Les utilisateurs seront informés des modifications par email.
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

export default CGV; 