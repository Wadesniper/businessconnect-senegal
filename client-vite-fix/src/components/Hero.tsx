import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  background: linear-gradient(135deg, #001529 0%, #003366 100%) !important;
  background-image: none !important;
  @media (max-width: 600px) {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: hidden !important;
    margin-top: 24px !important;
  }
`;

// Correction du StaticBackground pour qu'il soit semi-transparent
const StaticBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,21,41,0.45); // bleu foncé plus transparent
  z-index: 1;
`;

// Correction du BackgroundImage pour qu'il soit SOUS le StaticBackground
const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${img5});
  background-size: cover;
  background-position: center;
  z-index: 0;
`;

// Correction du Overlay pour qu'il soit plus léger
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 21, 41, 0.7) 40%, rgba(0, 51, 102, 0.5) 100%);
  z-index: 2;
`;

// Correction du GeometricBackground pour qu'il soit SOUS le texte
const GeometricBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.18;
  background-image: 
    linear-gradient(30deg, rgba(255,255,255,0.18) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.18) 87.5%, rgba(255,255,255,0.18)),
    linear-gradient(150deg, rgba(255,255,255,0.18) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.18) 87.5%, rgba(255,255,255,0.18)),
    linear-gradient(30deg, rgba(255,255,255,0.18) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.18) 87.5%, rgba(255,255,255,0.18)),
    linear-gradient(150deg, rgba(255,255,255,0.18) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.18) 87.5%, rgba(255,255,255,0.18)),
    linear-gradient(60deg, rgba(255,255,255,0.12) 25%, transparent 25.5%, transparent 75%, rgba(255,255,255,0.12) 75%, rgba(255,255,255,0.12));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0;
  z-index: 0;
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
  z-index: 5;
  overflow: hidden;
  @media (max-width: 900px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 48px 0;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: hidden !important;
  }
`;

const TextContent = styled.div`
  flex: 1;
  color: white;
  padding-left: 48px;
  padding-right: 24px;
  @media (max-width: 900px) {
    padding: 0 16px;
    flex: 0;
  }
`;

// --- AJOUT POUR MOSAÏQUE ---
const TILE_ROWS = 3;
const TILE_COLS = 5;
const TILE_COUNT = TILE_ROWS * TILE_COLS;

// Import des images en dur (zéro bug de chargement)
import img1 from '../assets/1-ingenieur.jpg';
import img2 from '../assets/2-construction.jpg';
import img3 from '../assets/3-techno-securite.jpg';
import img4 from '../assets/4-agriculture.jpg';
import img5 from '../assets/5-datacenter.jpg';
import img6 from '../assets/6-mecanicienne.jpg';
import img7 from '../assets/7-reunion-pro.jpg';
import img8 from '../assets/8-developpeur.jpg';
import img9 from '../assets/9-immeuble.jpg';
import img10 from '../assets/10-pompier.jpg';
import img11 from '../assets/11-science.jpg';
import img12 from '../assets/12-medical.jpg';

const images = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12
];

interface HeroProps {
  onDiscoverClick?: () => void;
}

// --- OPTIM HERO ---
// Blur adaptatif (mobile)
const getBlurValue = () => window.innerWidth < 700 ? '4px' : '8px';

const Hero: React.FC<HeroProps> = ({ onDiscoverClick }) => {
  return (
    <HeroContainer>
      <BackgroundImage />
      <StaticBackground />
      <Overlay />
      <GeometricBackground style={{ zIndex: 3, position: 'absolute' }} />
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
              Formez-vous, créez votre CV, trouvez un emploi ou recrutez dans un écosystème numérique innovant dédié au marché de l'emploi sénégalais.
            </Paragraph>
            <StyledButton type="primary" size="large" onClick={onDiscoverClick}>
              Découvrir nos services
              <ArrowRightOutlined />
            </StyledButton>
          </motion.div>
        </TextContent>
        <AnimatedMosaic>
          {images.slice(0, 9).map((src, index) => (
            <MosaicImage key={index} src={src} alt={`Inspiration ${index + 1}`} loading="lazy" />
          ))}
        </AnimatedMosaic>
      </ContentWrapper>
    </HeroContainer>
  );
};

const GreenSpan = styled.span`
  color: #52c41a;
  text-shadow: 0 0 12px rgba(82, 196, 26, 0.5);
`;

const StyledButton = styled(Button)`
  background-color: #52c41a;
  border-color: #52c41a;
  &:hover {
    background-color: #73d13d;
    border-color: #73d13d;
  }
`;

const AnimatedMosaic = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 45%;
  max-width: 550px;
  margin-right: 48px;
  animation: slide-in 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    width: 90%;
    max-width: 400px;
    margin: 32px auto 0;

    & > img:nth-of-type(n + 5) {
      display: none;
    }
  }

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const MosaicImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  opacity: 0.85;
  transition: transform 0.3s, opacity 0.3s;
  animation: fade-in 1s ease-out forwards;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);

  &:hover {
    opacity: 1;
    transform: scale(1.05);
    z-index: 10;
    position: relative;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export default Hero; 