import React from 'react';
import { Typography, Card, Space, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

const MentionsLegales: React.FC = () => {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <Card>
        <Typography>
          <Title level={1}>Mentions Légales</Title>
          
          <Title level={2}>Éditeur du site</Title>
          <Space direction="vertical" size="small">
            <Paragraph>
              <Text strong>Nom du site :</Text> BusinessConnect Sénégal
            </Paragraph>
            <Paragraph>
              <Text strong>Propriétaire :</Text> KHALIFA BUSINESS GROUP
            </Paragraph>
            <Paragraph>
              <Text strong>Forme juridique :</Text> Société à responsabilité limitée (SARL)
            </Paragraph>
            <Paragraph>
              <Text strong>Adresse du siège social :</Text> Dakar, Sénégal
            </Paragraph>
            <Paragraph>
              <Text strong>RC :</Text> SN DKR 2024 A 47391
            </Paragraph>
            <Paragraph>
              <Text strong>N.I.N.E.A :</Text> 011686279
            </Paragraph>
          </Space>

          <Divider />

          <Title level={2}>Direction</Title>
          <Paragraph>
            <Text strong>Directeur Général :</Text> M. Serigne Babacar WADE
          </Paragraph>

          <Divider />

          <Title level={2}>Hébergeur du site</Title>
          <Space direction="vertical" size="small">
            <Paragraph>
              <Text strong>Hébergeur :</Text> Namecheap, Inc.
            </Paragraph>
            <Paragraph>
              <Text strong>Adresse :</Text> 4600 East Washington Street, Suite 305, Phoenix, AZ 85034, USA
            </Paragraph>
          </Space>

          <Divider />

          <Title level={2}>Propriété intellectuelle</Title>
          <Paragraph>
            L'ensemble de ce site relève de la législation sénégalaise et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </Paragraph>

          <Title level={2}>Protection des données personnelles</Title>
          <Paragraph>
            Conformément à la loi n° 2008-12 du 25 janvier 2008 portant sur la protection des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, veuillez nous contacter par email.
          </Paragraph>

          <Title level={2}>Cookies</Title>
          <Paragraph>
            Notre site utilise des cookies pour améliorer votre expérience de navigation. Pour plus d'informations, veuillez consulter notre politique des cookies.
          </Paragraph>

          <Title level={2}>Responsabilité</Title>
          <Paragraph>
            Les informations fournies sur ce site le sont à titre indicatif. KHALIFA BUSINESS GROUP ne saurait garantir l'exactitude, la complétude, l'actualité des informations diffusées sur le site. KHALIFA BUSINESS GROUP met tout en œuvre pour offrir aux utilisateurs des informations et/ou outils disponibles et vérifiés, mais ne saurait être tenue pour responsable des erreurs ou omissions, d'une absence de disponibilité des informations et des services.
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default MentionsLegales; 