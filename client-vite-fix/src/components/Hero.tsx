import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { Typography, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const TitleStyled = styled(Title)`
  color: white !important;
  font-size: 48px;
  margin-bottom: 20px;
  @media (max-width: 600px) {
    font-size: 28px !important;
    margin-bottom: 10px !important;
  }
`;

const HeroContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  background: linear-gradient(135deg, #001529 0%, #003366 100%);
  @media (max-width: 600px) {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: hidden !important;
  }
`;

const HeroBackground = styled.div<{ $imageUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  filter: blur(10px) brightness(0.8);
  transform: scale(1.1);
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #001529b3 40%, #00336699 100%);
  z-index: 1;
`;

const GeometricBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: 
    linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
    linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
    linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
    linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
    linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77);
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0;
  animation: moveBackground 60s linear infinite;
`;

const ContentWrapper = styled.div`
  position: relative;
  width: 100vw;
  max-width: 100vw;
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  @media (max-width: 600px) {
    flex-direction: column;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    padding: 0;
    overflow-x: hidden !important;
  }
`;

const TextContent = styled.div`
  flex: 1;
  color: white;
  padding-left: 48px;
  padding-right: 24px;
  @media (max-width: 900px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const ImageSlider = styled.div`
  flex: 1;
  position: relative;
  height: 0;
  padding-top: 40%; /* Ratio 2.5/1 large et plus haut */
  border-radius: 32px;
  overflow: hidden;
  background: #001529; /* Fond foncé de secours */
  box-shadow: 0 8px 32px #00152933;
  border: 2px solid #fff;
  min-width: 0;
  @media (max-width: 600px) {
    width: 100% !important;
    max-width: 100% !important;
    padding-top: 35%; /* Ratio compact mobile */
    border-radius: 14px;
    margin-top: 18px;
  }
`;

const SlideImage = styled(motion.div)<{ $imageUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: 32px;
  display: flex;
  align-items: flex-end;
  background-color: #001529; /* Fond foncé de secours */
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  height: 50px;
  padding: 0 30px;
  font-size: 18px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GreenSpan = styled.span`
  color: #1ec773;
  font-weight: bold;
`;

const getImageUrl = (src: string) => `/images/${src}`;

const images = [
  { src: '1-ingenieur.jpg', desc: 'Concevez le monde de demain' },
  { src: '2-construction.jpg', desc: "Construisez l'avenir" },
  { src: '3-techno-securite.jpg', desc: 'Sécurisez le numérique' },
  { src: '4-agriculture.jpg', desc: 'Cultivez la réussite' },
  { src: '5-datacenter.jpg', desc: 'Gérez les données en toute sécurité' },
  { src: '6-mecanicienne.jpg', desc: 'Réparez, innovez' },
  { src: '7-reunion-pro.jpg', desc: 'Collaborez efficacement' },
  { src: '8-developpeur.jpg', desc: "Développez des solutions d'avenir" },
  { src: '9-immeuble.jpg', desc: "L'urbanisme au service du progrès" },
  { src: '10-pompier.jpg', desc: 'Protégez les vies' },
  { src: '11-science.jpg', desc: 'Expérimentez, découvrez' },
  { src: '12-medical.jpg', desc: 'Soignez avec passion' },
  { src: '13-business.jpg', desc: 'Entreprenez au Sénégal' },
];

const slideVariants = {
  enter: { opacity: 0 },
  center: { zIndex: 1, opacity: 1 },
  exit: { zIndex: 0, opacity: 0 }
};

interface HeroProps {
  onDiscoverClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onDiscoverClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <HeroContainer>
      <HeroBackground $imageUrl={getImageUrl(images[currentImageIndex].src)} />
      <Overlay />
      <GeometricBackground />
      <ContentWrapper>
        <TextContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <TitleStyled>
              La <GreenSpan>plateforme n°1</GreenSpan> où les <GreenSpan>talents</GreenSpan> <span style={{color:'white', fontWeight:700}}>sénégalais</span> rencontrent les <GreenSpan>opportunités</GreenSpan>
            </TitleStyled>
            <Paragraph style={{ color: 'white', fontSize: '18px', marginBottom: '30px' }}>
              Découvrez les meilleurs talents et opportunités dans tous les secteurs d'activité. 
              Une plateforme unique pour les professionnels qui façonnent l'avenir du Sénégal.
            </Paragraph>
            <StyledButton type="primary" size="large" onClick={onDiscoverClick}>
              Découvrir nos services
              <ArrowRightOutlined />
            </StyledButton>
          </motion.div>
        </TextContent>
        <ImageSlider>
          <AnimatePresence initial={false}>
            <SlideImage
              key={currentImageIndex}
              $imageUrl={getImageUrl(images[currentImageIndex].src)}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ opacity: { duration: 1.2, ease: "easeInOut" } }}
            >
              <img src={getImageUrl(images[currentImageIndex].src)} alt={images[currentImageIndex].desc} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:20,position:'absolute',top:0,left:0,zIndex:1,background:'#f7fafc'}} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                background: 'rgba(0,0,0,0.45)',
                color: '#fff',
                padding: '18px 28px',
                fontSize: 22,
                fontWeight: 600,
                borderRadius: '0 0 20px 20px',
                letterSpacing: 1,
                textShadow: '0 2px 8px #0007',
                zIndex: 2
              }}>
                {images[currentImageIndex].desc}
              </div>
            </SlideImage>
          </AnimatePresence>
        </ImageSlider>
      </ContentWrapper>
    </HeroContainer>
  );
};

export default Hero; 