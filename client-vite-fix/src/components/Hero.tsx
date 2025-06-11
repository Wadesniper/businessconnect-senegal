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
  background: linear-gradient(135deg, #001529 0%, #003366 100%);
  @media (max-width: 600px) {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow-x: hidden !important;
    margin-top: 24px !important;
  }
`;

// Optimisation: Un seul background fixe avec overlay
const StaticBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #001529 0%, #003366 100%);
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

// Variante 1 : Opacité réduite (par défaut)
const GeometricBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.15;
  background-image: 
    linear-gradient(30deg, rgba(255,255,255,0.18) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.18) 87.5%, rgba(255,255,255,0.18)),
    linear-gradient(150deg, rgba(255,255,255,0.18) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.18) 87.5%, rgba(255,255,255,0.18)),
    linear-gradient(30deg, rgba(255,255,255,0.18) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.18) 87.5%, rgba(255,255,255,0.18)),
    linear-gradient(150deg, rgba(255,255,255,0.18) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.18) 87.5%, rgba(255,255,255,0.18)),
    linear-gradient(60deg, rgba(255,255,255,0.12) 25%, transparent 25.5%, transparent 75%, rgba(255,255,255,0.12) 75%, rgba(255,255,255,0.12));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0;
  z-index: 2;
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
import img13 from '../assets/13-business.jpg';

const images = [
  { src: img1, desc: 'Concevez le monde de demain' },
  { src: img2, desc: "Construisez l'avenir" },
  { src: img3, desc: 'Sécurisez le numérique' },
  { src: img4, desc: 'Cultivez la réussite' },
  { src: img5, desc: 'Gérez les données en toute sécurité' },
  { src: img6, desc: 'Réparez, innovez' },
  { src: img7, desc: 'Collaborez efficacement' },
  { src: img8, desc: "Développez des solutions d'avenir" },
  { src: img9, desc: "L'urbanisme au service du progrès" },
  { src: img10, desc: 'Protégez les vies' },
  { src: img11, desc: 'Expérimentez, découvrez' },
  { src: img12, desc: 'Soignez avec passion' },
  { src: img13, desc: 'Entreprenez au Sénégal' },
];

// Génère une grille de tuiles pour l'effet mosaïque
const getTiles = () => {
  const tiles = [];
  for (let row = 0; row < TILE_ROWS; row++) {
    for (let col = 0; col < TILE_COLS; col++) {
      tiles.push({ row, col, key: `${row}-${col}` });
    }
  }
  return tiles;
};
const tiles = getTiles();

interface HeroProps {
  onDiscoverClick?: () => void;
}

// --- OPTIM HERO ---
// Blur adaptatif (mobile)
const getBlurValue = () => window.innerWidth < 700 ? '4px' : '8px';

const Hero: React.FC<HeroProps> = ({ onDiscoverClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [randomOrder, setRandomOrder] = useState<number[]>(tiles.map((_, i) => i));

  // Pré-calcule un ordre random pour la transition
  const getRandomOrder = useCallback(() => {
    const arr = tiles.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // Gestion du carrousel automatique (2,5s)
  const startCarousel = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused && !isTransitioning) {
        setRandomOrder(getRandomOrder());
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
          setIsTransitioning(false);
        }, 600); // durée de la transition mosaïque
      }
    }, 2500);
  }, [isPaused, isTransitioning, getRandomOrder]);

  useEffect(() => {
    startCarousel();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startCarousel]);

  const handleIndicatorClick = (index: number) => {
    setCurrentImageIndex(index);
    startCarousel();
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <HeroContainer>
      {/* Arrière-plan animé : image courante du carrousel, floue, opacité plus forte, plus lumineuse, vignettage */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          backgroundImage: `url(${images[currentImageIndex].src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: `blur(${getBlurValue()}) brightness(1.18)`,
          opacity: 0.7,
          transition: 'background-image 1.5s cubic-bezier(0.4,0,0.2,1)',
        }}
        aria-hidden="true"
      />
      {/* Vignettage doux */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.18) 100%)',
        }}
        aria-hidden="true"
      />
      <GeometricBackground style={{ zIndex: 2, position: 'absolute' }} />
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
        <CarouselContainer
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ImageContainer>
            {tiles.map(({ row, col, key }, idx) => {
              const order = randomOrder[idx];
              const baseDelay = 0.02;
              const randomOffset = Math.random() * 0.1;
              const delay = (Math.floor(order / TILE_COLS) + (order % TILE_COLS)) * baseDelay + randomOffset;

              // Position aléatoire dans la grille
              const randomRow = Math.floor(Math.random() * TILE_ROWS);
              const randomCol = Math.floor(Math.random() * TILE_COLS);

              return (
                <Tile
                  key={key}
                  initial={false}
                  animate={isTransitioning ? {
                    scale: [1, 0.95, 0],
                    opacity: [1, 0.5, 0],
                    x: [`${col * (100/TILE_COLS)}%`, `${randomCol * (100/TILE_COLS)}%`],
                    y: [`${row * (100/TILE_ROWS)}%`, `${randomRow * (100/TILE_ROWS)}%`],
                    transition: { 
                      duration: 0.6,
                      delay,
                      times: [0, 0.5, 1],
                      ease: [0.4, 0, 0.2, 1]
                    }
                  } : {
                    scale: [0, 1.05, 1],
                    opacity: [0, 0.5, 1],
                    x: [`${randomCol * (100/TILE_COLS)}%`, `${col * (100/TILE_COLS)}%`],
                    y: [`${randomRow * (100/TILE_ROWS)}%`, `${row * (100/TILE_ROWS)}%`],
                    transition: { 
                      duration: 0.6,
                      delay,
                      times: [0, 0.5, 1],
                      ease: [0.4, 0, 0.2, 1]
                    }
                  }}
                  style={{
                    position: 'absolute',
                    width: `${100/TILE_COLS}%`,
                    height: `${100/TILE_ROWS}%`,
                  }}
                >
                  <TileImage $bgImage={images[currentImageIndex].src} />
                </Tile>
              );
            })}
          </ImageContainer>
          <ImageOverlay $isActive={true}>
            {images[currentImageIndex].desc}
          </ImageOverlay>
          <CarouselIndicators>
            {images.map((_, index) => (
              <Indicator
                key={index}
                $isActive={index === currentImageIndex}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </CarouselIndicators>
        </CarouselContainer>
      </ContentWrapper>
    </HeroContainer>
  );
};

const CarouselContainer = styled.div`
  flex: 1;
  position: relative;
  height: 400px;
  max-width: 550px;
  border-radius: 32px;
  overflow: hidden;
  background: #001529;
  box-shadow: 0 8px 32px #00152933;
  border: 2px solid #fff;
  margin-right: 48px;
  @media (max-width: 600px) {
    width: 90% !important;
    max-width: 90% !important;
    height: 300px;
    border-radius: 14px;
    margin: 18px auto 0;
  }
`;

const ImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(${TILE_COLS}, 1fr);
  grid-template-rows: repeat(${TILE_ROWS}, 1fr);
`;

const Tile = styled(motion.div)`
  position: relative;
  overflow: hidden;
  background: #001529;
`;

const TileImage = styled.div<{ $bgImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => `url(${props.$bgImage})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const ImageOverlay = styled.div<{ $isActive: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: #fff;
  padding: 24px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  opacity: ${props => props.$isActive ? 1 : 0};
  transform: ${props => props.$isActive ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s, 
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
`;

const CarouselIndicators = styled.div`
  position: absolute;
  bottom: 16px;
  right: 24px;
  display: flex;
  gap: 8px;
  z-index: 3;
`;

const Indicator = styled.button<{ $isActive: boolean }>`
  width: ${props => props.$isActive ? '24px' : '8px'};
  height: 8px;
  border-radius: 4px;
  border: none;
  background: ${props => props.$isActive ? '#fff' : 'rgba(255,255,255,0.4)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.8);
  }
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

export default Hero; 