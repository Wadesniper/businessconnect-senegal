import React from 'react';
import { Typography, Card, Space, Divider } from 'antd';
import { Link } from 'react-router-dom';
import './LegalPage.css';

const { Title, Paragraph, Text } = Typography;

const CGV: React.FC = () => {
  return (
    <div className="legal-page-container">
      <Card className="legal-page-card">
        <Typography>
          <Title level={1}>Conditions Générales de Vente</Title>
          
          <Title level={2}>Article 1 : Objet et Champ d'Application</Title>
          <Paragraph>
            Les présentes Conditions Générales de Vente (CGV) régissent la souscription aux services payants proposés sur la plateforme BusinessConnect Sénégal, éditée par la société KHALIFA BUSINESS GROUP SARL. Elles complètent nos <Link to="/legal/cgu">Conditions Générales d'Utilisation (CGU)</Link>.
          </Paragraph>

          <Title level={2}>Article 2 : Description des Services Payants</Title>
          <Paragraph>
            BusinessConnect Sénégal propose des abonnements premium donnant accès à des fonctionnalités avancées. Les détails, les avantages et les tarifs de chaque type d'abonnement (ex: "Candidat Premium", "Recruteur Pro") sont décrits sur notre page "Tarifs" et sont susceptibles d'évoluer.
          </Paragraph>
           <Paragraph>
            La souscription à un abonnement est personnelle et ne peut être cédée.
          </Paragraph>

          <Title level={2}>Article 3 : Processus de Commande et Paiement</Title>
          <Paragraph>
            La souscription s'effectue en ligne depuis la page "Tarifs". L'utilisateur sélectionne l'offre de son choix, la durée, et procède au paiement via nos prestataires sécurisés (Mobile Money, Carte bancaire). Les prix sont indiqués en Francs CFA (XOF) et incluent toutes les taxes. La validation du paiement confirme la commande et déclenche l'activation immédiate des services.
          </Paragraph>

          <Title level={2}>Article 4 : Durée, Renouvellement et Résiliation</Title>
          <Paragraph>
            Les abonnements sont souscrits pour une durée déterminée (mensuelle ou annuelle) et sont payables en une seule fois au début de la période.
          </Paragraph>
          <Paragraph>
            Le renouvellement n'est pas automatique. À l'échéance de votre abonnement, vous serez invité à le renouveler pour continuer à bénéficier des services premium. Vous pouvez choisir de ne pas renouveler sans aucune pénalité.
          </Paragraph>
           <Paragraph>
            L'utilisateur peut décider de ne plus utiliser son abonnement à tout moment, mais cela n'ouvre droit à aucun remboursement pour la période restante, que l'abonnement ait été utilisé ou non.
          </Paragraph>

          <Title level={2}>Article 5 : Absence de Droit de Rétractation</Title>
          <Paragraph>
            Conformément à la législation en vigueur sur les services numériques, en validant votre commande, vous acceptez l'exécution immédiate de la prestation et renoncez expressément à votre droit de rétractation.
          </Paragraph>

          <Title level={2}>Article 6 : Responsabilité et Données Personnelles</Title>
          <Paragraph>
            Les limitations de responsabilité et nos engagements en matière de protection des données personnelles sont décrits en détail dans nos <Link to="/legal/cgu">CGU</Link> et notre <Link to="/legal/privacy">Politique de Confidentialité</Link>, qui font partie intégrante du présent contrat.
          </Paragraph>

          <Title level={2}>Article 7 : Droit Applicable et Litiges</Title>
          <Paragraph>
            Les présentes CGV sont soumises au droit sénégalais. En cas de litige, une solution amiable sera recherchée. À défaut, les tribunaux compétents de Dakar seront seuls saisis.
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