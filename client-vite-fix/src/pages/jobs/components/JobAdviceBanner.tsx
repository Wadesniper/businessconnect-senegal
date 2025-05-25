import React, { useState } from 'react';
import { Card, Row, Col, Typography, Drawer, Button, Grid } from 'antd';
import { PlusCircleOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const conseils = [
  {
    titre: "Optimisez votre CV",
    points: [
      "Adaptez votre CV à chaque offre d'emploi",
      "Mettez en avant vos compétences techniques",
      "Utilisez des mots-clés du secteur recherché",
      "Soyez concis et précis dans vos descriptions",
    ],
    color: '#1890ff',
    bg: '#eaf3ff',
    icon: '📝',
  },
  {
    titre: "Préparez vos entretiens",
    points: [
      "Renseignez-vous sur l'entreprise",
      "Préparez des exemples concrets",
      "Posez des questions pertinentes",
      "Soignez votre apparence et ponctualité",
    ],
    color: '#ff9800',
    bg: '#fff7e6',
    icon: '💬',
  },
  {
    titre: "Développez votre réseau",
    points: [
      "Participez aux événements professionnels",
      "Créez un profil LinkedIn à jour",
      "Rejoignez des groupes de votre domaine",
      "Contactez d'anciens collègues",
    ],
    color: '#43a047',
    bg: '#eafaf1',
    icon: '🤝',
  },
  {
    titre: "Restez en veille",
    points: [
      "Suivez l'actualité de votre secteur",
      "Formez-vous aux nouvelles technologies",
      "Inscrivez-vous aux newsletters",
      "Participez à des webinaires",
    ],
    color: '#673ab7',
    bg: '#f3eaff',
    icon: '🔎',
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
                    <span style={{ fontSize: 22 }}>{c.icon}</span> {c.titre}
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
    <div style={{ marginBottom: 32, background: '#f7faff', borderRadius: 24, boxShadow: '0 4px 24px #e3e8f7', padding: '32px 18px 24px 18px', maxWidth: '100%' }}>
      <Title level={4} style={{ marginBottom: 24, color: '#1d3557', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 800 }}>
        <PlusCircleOutlined style={{ color: '#1890ff', fontSize: 28 }} /> Conseils pour votre recherche d&apos;emploi
      </Title>
      <div
        className="job-advice-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {conseils.map((c, idx) => (
          <div key={c.titre} style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: `fadeInUp 0.7s ${0.1 + idx * 0.12}s both` }}>
            <Card bordered
              style={{
                minHeight: 220,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                borderRadius: 18,
                boxShadow: '0 2px 12px #e3e8f7',
                border: 'none',
                transition: 'box-shadow 0.2s, transform 0.2s',
                background: c.bg,
                cursor: 'pointer',
              }}
              bodyStyle={{ padding: '18px 18px 12px 18px' }}
              className="job-advice-card"
            >
              <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, color: c.color, fontWeight: 700, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span> {c.titre}
              </Title>
              <ul style={{ paddingLeft: 18, margin: 0, flex: 1 }}>
                {c.points.map((p, i) => (
                  <li key={i} style={{ marginBottom: 4, fontSize: 15, color: '#333' }}>{p}</li>
                ))}
              </ul>
            </Card>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .job-advice-grid { margin-top: 0; }
        .job-advice-card:hover {
          box-shadow: 0 8px 32px #b3d0f7, 0 2px 12px #e3e8f7;
          transform: translateY(-4px) scale(1.03);
        }
        @media (max-width: 1100px) {
          .job-advice-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 700px) {
          .job-advice-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default JobAdviceBanner; 