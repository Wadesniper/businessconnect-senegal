import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Typography, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HeroContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #001529 0%, #003366 100%);
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
`;

const TextContent = styled.div`
  flex: 1;
  color: white;
  padding-right: 50px;
`;

const ImageSlider = styled.div`
  flex: 1;
  position: relative;
  height: 600px;
  border-radius: 20px;
  overflow: hidden;
`;

const SlideImage = styled(motion.div)<{ $imageUrl: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(\${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: 20px;
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
  color: #52c41a;
  font-weight: bold;
`;

const images = [
  '/images/engineer.jpg',      // Ingénieur avec casque
  '/images/mechanic.jpg',      // Mécanicienne
  '/images/developer.jpg',     // Développeur
  '/images/agronomist.jpg',    // Agronome
  '/images/construction.jpg',  // Construction
  '/images/scientist.jpg',     // Scientifique
  '/images/doctor.jpg',        // Médecin
  '/images/executive.jpg'      // Cadre
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const Hero: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <HeroContainer>
      <GeometricBackground />
      <ContentWrapper>
        <TextContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title style={{ color: 'white', fontSize: '48px', marginBottom: '20px' }}>
              La <GreenSpan>plateforme n°1</GreenSpan> où les <GreenSpan>talents sénégalais</GreenSpan> rencontrent les <GreenSpan>opportunités</GreenSpan>
            </Title>
            <Paragraph style={{ color: 'white', fontSize: '18px', marginBottom: '30px' }}>
              Découvrez les meilleurs talents et opportunités dans tous les secteurs d'activité. 
              Une plateforme unique pour les professionnels qui façonnent l'avenir du Sénégal.
            </Paragraph>
            <StyledButton type="primary" size="large">
              Découvrir nos services
              <ArrowRightOutlined />
            </StyledButton>
          </motion.div>
        </TextContent>

        <ImageSlider>
          <AnimatePresence initial={false} custom={direction}>
            <SlideImage
              key={page}
              $imageUrl={images[currentImageIndex]}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            />
          </AnimatePresence>
        </ImageSlider>
      </ContentWrapper>
    </HeroContainer>
  );
};

export default Hero; 