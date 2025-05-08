import React from 'react';
import { Card } from 'antd';

const JobDetail: React.FC = () => {
  return (
    <Card style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Détail de l'offre</h1>
      <p>Cette page affichera le détail d'une offre d'emploi.</p>
    </Card>
  );
};

export default JobDetail; 