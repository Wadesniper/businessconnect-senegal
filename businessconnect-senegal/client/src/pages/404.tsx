import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Page non trouvée - BusinessConnect Sénégal"
        description="La page que vous recherchez n'existe pas ou a été déplacée."
      />
      <Result
        status="404"
        title="404"
        subTitle="Désolé, la page que vous recherchez n'existe pas."
        extra={
          <Link to="/">
            <Button type="primary">Retour à l'accueil</Button>
          </Link>
        }
      />
    </>
  );
};

export default NotFoundPage; 