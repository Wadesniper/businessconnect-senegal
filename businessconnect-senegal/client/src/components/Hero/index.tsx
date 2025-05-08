import React from 'react';
import { Typography, Button, Space } from 'antd';
import { motion } from 'framer-motion';
import { Carousel } from 'antd';
import styles from './Hero.module.css';

const { Title: AntTitle, Paragraph: AntParagraph } = Typography;

const heroImages = [
  {
    url: '/images/hero/ingenieur.jpg',
    sector: 'Ingénierie',
    title: 'Construisez l\'avenir du Sénégal'
  },
  {
    url: '/images/hero/mecanique.jpg',
    sector: 'Mécanique',
    title: 'Excellence technique et innovation'
  },
  {
    url: '/images/hero/tech-dev.jpg',
    sector: 'Développement',
    title: 'Codez le futur numérique'
  },
  {
    url: '/images/hero/agriculture.jpg',
    sector: 'Agriculture',
    title: 'Innovez dans l\'agriculture durable'
  },
  {
    url: '/images/hero/construction.jpg',
    sector: 'Construction',
    title: 'Bâtissez les infrastructures de demain'
  },
  {
    url: '/images/hero/business-team.jpg',
    sector: 'Business',
    title: 'Développez votre leadership'
  },
  {
    url: '/images/hero/tech-data.jpg',
    sector: 'Data Science',
    title: 'Exploitez la puissance des données'
  },
  {
    url: '/images/hero/industrie.jpg',
    sector: 'Industrie',
    title: 'Optimisez la production industrielle'
  },
  {
    url: '/images/hero/science.jpg',
    sector: 'Recherche',
    title: 'Repoussez les frontières de la science'
  },
  {
    url: '/images/hero/medical.jpg',
    sector: 'Santé',
    title: 'Innovez dans le secteur médical'
  },
  {
    url: '/images/hero/tech-security.jpg',
    sector: 'Cybersécurité',
    title: 'Protégez les infrastructures numériques'
  },
  {
    url: '/images/hero/finance.jpg',
    sector: 'Finance',
    title: 'Excellez dans la finance moderne'
  },
  {
    url: '/images/hero/business-night.jpg',
    sector: 'Leadership',
    title: 'Dirigez vers le succès'
  }
];

const Hero: React.FC = () => {
  return (
    <div className={styles.hero}>
      <Carousel
        autoplay
        effect="fade"
        dots={false}
        autoplaySpeed={2000}
        className={styles.carousel}
      >
        {heroImages.map((image, index) => (
          <div key={index} className={styles.slide}>
            <div 
              className={styles.slideBackground}
              style={{ backgroundImage: `url(${image.url})` }}
            />
            <div className={styles.overlay} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={styles.content}
            >
              <Space direction="vertical" size="large" className={styles.textContent}>
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <AntTitle level={3} className={styles.sector}>
                      {image.sector}
                    </AntTitle>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <AntTitle className={styles.title}>
                      {image.title}
                    </AntTitle>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <AntParagraph className={styles.description}>
                    Rejoignez la première plateforme professionnelle du Sénégal et accédez à des opportunités uniques
                  </AntParagraph>
                  <Space size="large" className={styles.buttons}>
                    <Button type="primary" size="large" className={styles.primaryButton}>
                      Commencer maintenant
                    </Button>
                    <Button size="large" className={styles.secondaryButton}>
                      En savoir plus
                    </Button>
                  </Space>
                </motion.div>
              </Space>
            </motion.div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero; 