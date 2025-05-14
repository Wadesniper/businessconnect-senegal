import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookFilled, LinkedinFilled, TwitterSquareFilled, YoutubeFilled, MailOutlined } from '@ant-design/icons';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-modern">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 24px 32px' }}>
        <div style={{ fontWeight: 700, fontSize: 26, marginBottom: 18 }}>
          <span style={{ color: '#1890ff' }}>BusinessConnect</span><span style={{ color: '#1ec773' }}>Sénégal</span>
        </div>
      </div>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Navigation</h3>
          <Link to="/">Accueil</Link>
          <Link to="/jobs">Emplois</Link>
          <Link to="/careers">Fiches métiers</Link>
          <Link to="/formations">Formations</Link>
          <Link to="/cv-generator">CV</Link>
          <Link to="/marketplace">Marketplace</Link>
        </div>
        <div className="footer-section">
          <h3>Aide & Contact</h3>
          <Link to="/help/FAQ">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <a href="mailto:contact@businessconnectsenegal.com"><MailOutlined /> contact@businessconnectsenegal.com</a>
        </div>
        <div className="footer-section">
          <h3>Légal</h3>
          <Link to="/legal/mentions-legales">Mentions légales</Link>
          <Link to="/legal/cgu">CGU</Link>
          <Link to="/legal/cgv">CGV</Link>
          <Link to="/legal/privacy">Confidentialité</Link>
          <Link to="/legal/cookies">Cookies</Link>
        </div>
        <div className="footer-section">
          <h3>Réseaux sociaux</h3>
          <div className="footer-socials">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><LinkedinFilled /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FacebookFilled /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><TwitterSquareFilled /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><YoutubeFilled /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BusinessConnect Sénégal. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer; 