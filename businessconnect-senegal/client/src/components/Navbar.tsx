import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeOutlined, FileTextOutlined, BookOutlined, UserOutlined, ShopOutlined, TeamOutlined, QuestionCircleOutlined, MailOutlined, CrownOutlined, LoginOutlined, LogoutOutlined, AppstoreOutlined } from '@ant-design/icons';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="navbar navbar-modern">
      <div className="navbar-brand" onClick={() => navigate('/')}> 
        <AppstoreOutlined style={{ fontSize: 28, color: '#1890ff', marginRight: 8 }} />
        <span style={{ fontWeight: 700, fontSize: 22 }}>BusinessConnect Sénégal</span>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-link"><HomeOutlined /> Accueil</Link>
        <Link to="/jobs" className="navbar-link"><FileTextOutlined /> Emplois</Link>
        <Link to="/careers" className="navbar-link"><CrownOutlined /> Fiches métiers</Link>
        <Link to="/formations" className="navbar-link"><BookOutlined /> Formations</Link>
        <Link to="/cv-generator" className="navbar-link"><UserOutlined /> CV</Link>
        <Link to="/marketplace" className="navbar-link"><ShopOutlined /> Marketplace</Link>
        <Link to="/forum" className="navbar-link"><TeamOutlined /> Forum</Link>
        <Link to="/help/FAQ" className="navbar-link"><QuestionCircleOutlined /> FAQ</Link>
        <Link to="/contact" className="navbar-link"><MailOutlined /> Contact</Link>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="user-menu">
            <Link to="/profile" className="navbar-link"><UserOutlined /> Mon Profil</Link>
            <Link to="/dashboard" className="navbar-link"><AppstoreOutlined /> Tableau de bord</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="navbar-link"><CrownOutlined /> Administration</Link>
            )}
            <button onClick={handleLogout} className="logout-button">
              <LogoutOutlined /> Déconnexion
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/subscription" className="subscribe-button">S'abonner</Link>
            <Link to="/auth/login" className="login-button"><LoginOutlined /> Connexion</Link>
            <Link to="/auth/register" className="register-button">Inscription</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 