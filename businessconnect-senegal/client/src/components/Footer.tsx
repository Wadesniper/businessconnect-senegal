import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>BusinessConnect Sénégal</h3>
          <p>La plateforme de connexion professionnelle au Sénégal</p>
        </div>
        <div className="footer-section">
          <h4>Navigation</h4>
          <Link to="/jobs">Emplois</Link>
          <Link to="/formations">Formations</Link>
          <Link to="/cv-generator">CV Builder</Link>
          <Link to="/forum">Forum</Link>
          <Link to="/marketplace">Marketplace</Link>
        </div>
        <div className="footer-section">
          <h4>Légal</h4>
          <Link to="/legal/terms">Conditions d'utilisation</Link>
          <Link to="/legal/privacy">Politique de confidentialité</Link>
          <Link to="/legal/cookies">Politique des cookies</Link>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <Link to="/contact">Nous contacter</Link>
          <a href="mailto:contact@businessconnect.sn">contact@businessconnect.sn</a>
          <p>Dakar, Sénégal</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BusinessConnect Sénégal. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer; 