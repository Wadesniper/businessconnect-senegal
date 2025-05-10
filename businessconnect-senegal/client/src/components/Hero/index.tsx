import React from 'react';
import { Carousel } from 'antd';

const slides = [
  { img: '/images/hero/ingenieur.jpg', desc: "Formez-vous aux métiers d'avenir" },
  { img: '/images/hero/construction.jpg', desc: "Bâtissez votre avenir dans le BTP et l'industrie" },
  { img: '/images/hero/tech-security.jpg', desc: "Protégez les données et les infrastructures" },
  { img: '/images/hero/tech-data.jpg', desc: "Explorez les métiers de la donnée et de l'IA" },
  { img: '/images/hero/agriculture.jpg', desc: "Rejoignez les métiers de l'agroalimentaire et de l'innovation verte" },
  { img: '/images/hero/business-team.jpg', desc: "Connectez-vous avec les meilleurs talents du Sénégal" },
  { img: '/images/hero/industrie.jpg', desc: "Rejoignez les leaders de l'industrie" },
  { img: '/images/hero/firefighter.jpg', desc: "Protégez et servez la communauté" },
  { img: '/images/hero/mecanique.jpg', desc: "Devenez expert en ingénierie et maintenance" },
  { img: '/images/hero/tech-dev.jpg', desc: "Trouvez les meilleures opportunités dans le numérique" },
  { img: '/images/hero/medical.jpg', desc: "Faites carrière dans le secteur médical et paramédical" },
  { img: '/images/hero/science.jpg', desc: "Innovez dans les métiers scientifiques" },
  { img: '/images/hero/business-night.jpg', desc: "Développez vos compétences en gestion et entrepreneuriat" }
];

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
  background: 'rgba(0,0,0,0.35)',
  color: 'white',
  padding: '16px 32px',
  fontSize: '1.2rem',
  fontWeight: 500,
  textShadow: '0 2px 8px #000a',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px'
};

const Hero: React.FC = () => (
  <div style={{ width: '100%', height: '250px', border: '3px solid red', position: 'relative' }}>
    <Carousel autoplay>
      {slides.map((slide, i) => (
        <div key={i} style={{ position: 'relative', height: '250px' }}>
          <img src={slide.img} alt={slide.desc} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: 8 }} />
          <div style={overlayStyle}>{slide.desc}</div>
        </div>
      ))}
    </Carousel>
  </div>
);

export default Hero; 