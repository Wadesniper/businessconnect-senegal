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

const getShuffledTiles = () => {
  const arr = images.map(img => img.src);
  while (arr.length < TILE_COUNT) arr.push(...arr);
  // Mélange Fisher-Yates
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, TILE_COUNT);
};

// Génère une grille de tuiles pour l'effet mosaïque
const tiles = Array.from({ length: TILE_ROWS * TILE_COLS }, (_, i) => ({
  row: Math.floor(i / TILE_COLS),
  col: i % TILE_COLS,
  key: `${Math.floor(i / TILE_COLS)}-${i % TILE_COLS}`
}));

interface HeroProps {
  onDiscoverClick?: () => void;
}

// --- OPTIM HERO ---
// Blur adaptatif (mobile)
const getBlurValue = () => window.innerWidth < 700 ? '4px' : '8px';

const Hero: React.FC<HeroProps> = ({ onDiscoverClick }) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [tilesImages, setTilesImages] = useState<string[]>(getShuffledTiles());
  const [isFading, setIsFading] = useState(false);

  // Animation mosaïque : fade out, puis shuffle, puis fade in
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setTilesImages(getShuffledTiles());
        setIsFading(false);
      }, 400); // fade out
    }, 2500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <HeroContainer>
      <StaticBackground />
      <Overlay />
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
        <CarouselContainer>
          <ImageContainer>
            {tiles.map(({ row, col, key }: { row: number; col: number; key: string }, idx: number) => (
              <Tile
                key={key}
                animate={isFading ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.02 }}
              >
                <TileImage $bgImage={tilesImages[idx]} />
              </Tile>
            ))}
          </ImageContainer>
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