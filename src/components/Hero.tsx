import React from 'react';
import { Carousel, Typography } from 'antd';
import './Hero.css';

const { Title, Paragraph } = Typography;

const images = [
  {
    src: '/images/hero1.jpg',
    alt: 'Réseautage professionnel',
    description: 'Connectez-vous avec des professionnels de tous secteurs au Sénégal.'
  },
  {
    src: '/images/hero2.jpg',
    alt: 'Opportunités d’emplois',
    description: 'Découvrez des offres d’emplois et boostez votre carrière.'
  },
  // ... 11 autres images et descriptions ...
];

const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <Carousel autoplay effect="fade" className="hero-carousel">
        {images.map((img, idx) => (
          <div key={idx} className="hero-slide">
            <img src={img.src} alt={img.alt} className="hero-image" />
            <div className="hero-caption">
              <Title level={2}>{img.alt}</Title>
              <Paragraph>{img.description}</Paragraph>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default Hero; 