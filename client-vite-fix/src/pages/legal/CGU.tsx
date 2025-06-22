import React from 'react';
import { Typography, Card, Space, Divider } from 'antd';
import './LegalPage.css';

const { Title, Paragraph, Text } = Typography;

const CGU: React.FC = () => {
  return (
    <div className="legal-page-container">
      <Card className="legal-page-card">
        <Typography>
          <Title level={1}>Conditions Générales d'Utilisation</Title>
          
          <Title level={2}>1. Acceptation des conditions</Title>
          <Paragraph>
            En accédant et en utilisant le site BusinessConnect Sénégal, vous acceptez sans réserve les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
          </Paragraph>

          <Title level={2}>2. Description des services</Title>
          <Paragraph>
            BusinessConnect Sénégal est une plateforme professionnelle conçue pour dynamiser votre carrière et vos activités au Sénégal. Elle vous permet notamment de :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Consulter et postuler à des offres d'emploi exclusives.</Text>
            <Text>• Publier des offres pour recruter les meilleurs talents.</Text>
            <Text>• Créer un CV professionnel percutant grâce à notre générateur.</Text>
            <Text>• Découvrir des fiches métiers pour orienter votre carrière.</Text>
            <Text>• Accéder à des formations pour monter en compétences.</Text>
            <Text>• Échanger avec des professionnels sur notre forum.</Text>
            <Text>• Vendre et acheter des biens et services sur notre Marketplace B2B.</Text>
          </Space>

          <Title level={2}>3. Inscription et compte utilisateur</Title>
          <Paragraph>
            L'accès à la plupart de nos services requiert la création d'un compte. En vous inscrivant, vous vous engagez à :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Fournir des informations authentiques, exactes et à jour.</Text>
            <Text>• Assurer la confidentialité de votre mot de passe et de vos identifiants.</Text>
            <Text>• Être l'unique responsable de toute activité effectuée depuis votre compte.</Text>
            <Text>• Ne pas créer de faux profils ni usurper l'identité d'un tiers.</Text>
            <Text>• Nous informer immédiatement en cas d'utilisation non autorisée de votre compte.</Text>
          </Space>

          <Title level={2}>4. Règles de conduite</Title>
          <Paragraph>
            En tant que membre de la communauté BusinessConnect, vous vous engagez à adopter un comportement professionnel et respectueux. Il est interdit de :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Publier des contenus illégaux, diffamatoires, haineux, ou discriminatoires.</Text>
            <Text>• Harceler ou importuner d'autres utilisateurs.</Text>
            <Text>• Diffuser du spam, des chaînes de lettres, ou des schémas pyramidaux.</Text>
            <Text>• Violer les droits de propriété intellectuelle (marques, droits d'auteur).</Text>
            <Text>• Tenter de nuire à l'intégrité de la plateforme (virus, collecte de données, etc.).</Text>
          </Space>
          
          <Title level={2}>5. Vigilance concernant les offres d'emploi et les transactions</Title>
          <Paragraph>
            BusinessConnect Sénégal agit en tant qu'intermédiaire pour connecter les talents et les opportunités. Bien que nous mettions en œuvre des mesures pour vérifier la légitimité des publications, nous ne saurions garantir l'authenticité de chaque offre ou de chaque utilisateur. Il est de la responsabilité des utilisateurs de faire preuve de diligence raisonnable avant de s'engager dans une relation professionnelle ou commerciale.
          </Paragraph>
          <Paragraph>
            Nous rappelons avec insistance qu'<Text strong>aucun recruteur ou employeur légitime ne doit vous demander de verser une somme d'argent</Text> pour postuler à une offre, passer un entretien, ou pour couvrir des frais de dossier ou de matériel. Toute demande de ce type doit être considérée comme une tentative de fraude et immédiatement signalée à nos services.
          </Paragraph>
          <Paragraph>
            BusinessConnect Sénégal décline toute responsabilité en cas de litige, d'arnaque ou de perte financière résultant d'interactions directes entre utilisateurs. Signalez-nous tout comportement suspect pour que nous puissions prendre les mesures nécessaires.
          </Paragraph>

          <Title level={2}>6. Modération</Title>
          <Paragraph>
            Afin de maintenir un environnement sûr et professionnel, BusinessConnect Sénégal se réserve le droit, sans préavis ni justification, de :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Modérer, refuser ou supprimer tout contenu jugé non conforme.</Text>
            <Text>• Suspendre ou supprimer définitivement tout compte qui enfreint les présentes CGU.</Text>
          </Space>

          <Title level={2}>7. Propriété intellectuelle</Title>
          <Paragraph>
            L'ensemble des contenus et services de la plateforme (logo, marque, textes, vidéos, etc.) est la propriété exclusive de BusinessConnect Sénégal. Toute reproduction, même partielle, est strictement interdite sans notre autorisation écrite.
          </Paragraph>
          <Paragraph>
            En publiant du contenu sur le site, vous nous accordez une licence non-exclusive et mondiale pour l'utiliser, le diffuser et le reproduire dans le cadre des services de la plateforme.
          </Paragraph>

          <Title level={2}>8. Protection des données</Title>
          <Paragraph>
            La protection de vos données est notre priorité. Nous collectons et traitons vos informations personnelles conformément à la loi sénégalaise sur la protection des données et à notre Politique de Confidentialité, que nous vous invitons à consulter.
          </Paragraph>

          <Title level={2}>9. Limitation de responsabilité</Title>
          <Paragraph>
            L'utilisation de BusinessConnect Sénégal se fait à vos propres risques. Notre responsabilité ne saurait être engagée pour :
          </Paragraph>
          <Space direction="vertical">
            <Text>• Les contenus, actions ou inactions des autres utilisateurs.</Text>
            <Text>• L'issue des transactions ou des processus de recrutement.</Text>
            <Text>• Toute interruption, bug ou faille de sécurité du service.</Text>
            <Text>• Tout dommage direct ou indirect résultant de l'utilisation de la plateforme.</Text>
          </Space>

          <Title level={2}>10. Modification des CGU</Title>
          <Paragraph>
            Nous nous réservons le droit de modifier ces CGU à tout moment pour nous adapter aux évolutions du service ou de la législation. Les modifications entreront en vigueur dès leur publication sur le site.
          </Paragraph>

          <Title level={2}>11. Droit applicable et Juridiction</Title>
          <Paragraph>
            Les présentes CGU sont soumises au droit sénégalais. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents de Dakar seront seuls saisis.
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