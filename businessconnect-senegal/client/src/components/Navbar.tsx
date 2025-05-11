import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">BusinessConnect Sénégal</Link>
      </div>
      <div className="navbar-menu">
          {/* <Link to="/jobs">Emplois</Link> */}
        <Link to="/formations">Formations</Link>
        <Link to="/cv-generator">CV Builder</Link>
          {/* <Link to="/forum">Forum</Link> */}
          <Link to="/marketplace">Marketplace</Link>
      </div>
      <div className="navbar-end">
        {user ? (
          <>
            <div className="user-menu">
              <Link to="/dashboard">Tableau de bord</Link>
              {user.role === 'admin' && (
                <Link to="/admin">Administration</Link>
              )}
              <Link to="/profile">Mon Profil</Link>
              <button onClick={handleLogout} className="logout-button">
                Déconnexion
              </button>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/auth/login" className="login-button">
              Connexion
            </Link>
            <Link to="/auth/register" className="register-button">
              Inscription
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 