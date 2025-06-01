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

// Nouveau conteneur de carrousel optimisé
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

// Image optimisée avec lazy loading et transition CSS pure
const OptimizedImage = styled.div<{ $imageUrl: string; $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => `url(${props.$imageUrl})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${props => props.$isActive ? 1 : 0};
  transform: ${props => props.$isActive ? 'scale(1)' : 'scale(1.05)'};
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
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

// Indicateurs de navigation
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

interface HeroProps {
  onDiscoverClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onDiscoverClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Préchargement intelligent des images
  useEffect(() => {
    const preloadImages = async () => {
      // Précharge d'abord les 3 premières images
      const initialImages = images.slice(0, 3);
      const loadPromises = initialImages.map((image, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            setImagesLoaded(prev => new Set([...prev, index]));
            resolve();
          };
          img.onerror = () => resolve(); // Continue même en cas d'erreur
          img.src = getImageUrl(image.src);
        });
      });

      await Promise.all(loadPromises);

      // Précharge les images restantes en arrière-plan
      images.slice(3).forEach((image, index) => {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded(prev => new Set([...prev, index + 3]));
        };
        img.src = getImageUrl(image.src);
      });
    };

    preloadImages();
  }, []);

  // Gestion du carrousel automatique
  const startCarousel = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }
    }, 4000); // Ralenti à 4 secondes pour meilleure UX
  }, [isPaused]);

  useEffect(() => {
    startCarousel();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startCarousel]);

  const handleIndicatorClick = (index: number) => {
    setCurrentImageIndex(index);
    startCarousel(); // Redémarre le timer
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <HeroContainer>
      <StaticBackground />
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
          {images.map((image, index) => (
            <OptimizedImage
              key={index}
              $imageUrl={getImageUrl(image.src)}
              $isActive={index === currentImageIndex && imagesLoaded.has(index)}
            >
              <ImageOverlay $isActive={index === currentImageIndex}>
                {image.desc}
              </ImageOverlay>
            </OptimizedImage>
          ))}
          
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

export default Hero; 