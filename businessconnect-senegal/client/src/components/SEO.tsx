import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'BusinessConnect Sénégal - La plateforme des talents et opportunités',
  description = 'Découvrez les meilleurs talents et opportunités professionnelles au Sénégal. Emplois, formations, marketplace et forum pour les professionnels.',
  keywords = 'emploi sénégal, recrutement sénégal, formation professionnelle, marketplace, forum professionnel',
  image = '/images/og-image.jpg',
  url = 'https://businessconnect-senegal.com'
}) => {
  return (
    <Helmet>
      {/* Balises meta de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Autres métadonnées importantes */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#1890ff" />
      
      {/* Liens importants */}
      <link rel="canonical" href={url} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />
      
      {/* Structured Data / Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "BusinessConnect Sénégal",
          "url": url,
          "logo": `${url}/logo.png`,
          "sameAs": [
            "https://facebook.com/businessconnectsenegal",
            "https://twitter.com/businessconnectsenegal",
            "https://linkedin.com/company/businessconnectsenegal"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+221-XX-XXX-XXXX",
            "contactType": "customer service",
            "availableLanguage": ["French", "Wolof"]
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 