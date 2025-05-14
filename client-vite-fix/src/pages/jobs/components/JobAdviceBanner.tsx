import React, { useState } from 'react';
import { Card, Row, Col, Typography, Drawer, Button, Grid } from 'antd';
import { PlusCircleOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const conseils = [
  {
    titre: "Optimisez votre CV",
    points: [
      "Adaptez votre CV à chaque offre d\'emploi",
      "Mettez en avant vos compétences techniques",
      "Utilisez des mots-clés du secteur recherché",
      "Soyez concis et précis dans vos descriptions",
    ],
  },
  {
    titre: "Préparez vos entretiens",
    points: [
      "Renseignez-vous sur l\'entreprise",
      "Préparez des exemples concrets",
      "Posez des questions pertinentes",
      "Soignez votre apparence et ponctualité",
    ],
  },
  {
    titre: "Développez votre réseau",
    points: [
      "Participez aux événements professionnels",
      "Créez un profil LinkedIn à jour",
      "Rejoignez des groupes de votre domaine",
      "Contactez d\'anciens collègues",
    ],
  },
  {
    titre: "Restez en veille",
    points: [
      "Suivez l\'actualité de votre secteur",
      "Formez-vous aux nouvelles technologies",
      "Inscrivez-vous aux newsletters",
      "Participez à des webinaires",
    ],
  },
];

const JobAdviceBanner: React.FC = () => {
  const screens = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Mobile : résumé + bouton Voir
  if (!screens.md) {
    return (
      <div style={{ marginBottom: 24 }}>
        <Card bordered>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 17 }}>
              <PlusCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
              Conseils pour votre recherche d'emploi
            </div>
            <Button icon={<EyeOutlined />} size="small" onClick={() => setDrawerOpen(true)}>
              Voir
            </Button>
          </div>
        </Card>
        <Drawer
          title={<span><PlusCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />Conseils pour votre recherche d'emploi</span>}
          placement="bottom"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          height={420}
        >
          <Row gutter={[12, 12]}>
            {conseils.map((c, idx) => (
              <Col xs={24} key={c.titre} style={{ marginBottom: 8 }}>
                <Card bordered size="small">
                  <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <PlusCircleOutlined style={{ color: '#1890ff' }} /> {c.titre}
                  </Title>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {c.points.map((p, i) => (
                      <li key={i} style={{ marginBottom: 4, fontSize: 15 }}>{p}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </Drawer>
      </div>
    );
  }

  // Desktop : affichage en colonnes
  return (
    <div style={{ marginBottom: 32 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Conseils pour votre recherche d&apos;emploi</Title>
      <Row gutter={[16, 16]}>
        {conseils.map((c, idx) => (
          <Col xs={24} md={6} key={c.titre}>
            <Card bordered style={{ minHeight: 180 }}>
              <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PlusCircleOutlined style={{ color: '#1890ff' }} /> {c.titre}
              </Title>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {c.points.map((p, i) => (
                  <li key={i} style={{ marginBottom: 4, fontSize: 15 }}>{p}</li>
                ))}
              </ul>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default JobAdviceBanner; 