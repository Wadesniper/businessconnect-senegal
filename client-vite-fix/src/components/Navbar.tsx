import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeOutlined, FileTextOutlined, BookOutlined, UserOutlined, ShopOutlined, TeamOutlined, QuestionCircleOutlined, MailOutlined, CrownOutlined, LoginOutlined, LogoutOutlined, AppstoreOutlined, MenuOutlined } from '@ant-design/icons';
import { Drawer, Button } from 'antd';
import './Navbar.css';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const navLinks = [
    { to: '/', label: 'Accueil', icon: <HomeOutlined /> },
    { to: '/jobs', label: 'Emplois', icon: <FileTextOutlined /> },
    { to: '/careers', label: 'Fiches métiers', icon: <CrownOutlined /> },
    { to: '/formations', label: 'Formations', icon: <BookOutlined /> },
    { to: '/cv-generator', label: 'CV', icon: <UserOutlined /> },
    { to: '/marketplace', label: 'Marketplace', icon: <ShopOutlined /> },
    { to: '/subscription', label: 'Abonnement', icon: <TeamOutlined /> },
    { to: '/help/FAQ', label: 'FAQ', icon: <QuestionCircleOutlined /> },
  ];

  return (
    <nav className="navbar navbar-modern">
      <div className="navbar-brand" onClick={() => navigate('/')}> 
        <AppstoreOutlined style={{ fontSize: 28, color: '#1890ff', marginRight: 8 }} />
        <span style={{ fontWeight: 700, fontSize: 22, color: '#1890ff' }}>BusinessConnect</span><span style={{ color: '#1ec773', fontWeight: 700, fontSize: 22 }}>Sénégal</span>
        <span className="navbar-bell-mobile-brand"><NotificationBell /></span>
      </div>
      <div className="navbar-menu">
        {navLinks.map(link => (
          <Link to={link.to} className="navbar-link" key={link.to}>{link.icon} {link.label}</Link>
        ))}
      </div>
      <div className="navbar-burger-bell-mobile">
        <div className="navbar-burger">
          <Button type="text" icon={<MenuOutlined style={{ fontSize: 28 }} />} onClick={() => setDrawerOpen(true)} />
        </div>
        <div className="navbar-bell-mobile">
          <NotificationBell />
        </div>
      </div>
      <div className="navbar-end">
        <NotificationBell />
        {isAuthenticated && user ? (
          <div className="user-menu">
            <Link to="/dashboard" className="navbar-link"><AppstoreOutlined /> Tableau de bord</Link>
            <Button className="logout-button" icon={<LogoutOutlined />} size="small" onClick={handleLogout} style={{padding: '0 10px', minWidth: 0, fontSize: 15, height: 38}}>
              <span className="hide-on-mobile">Déconnexion</span>
            </Button>
          </div>
        ) : (
          <div className="auth-buttons" style={{gap: '10px', alignItems: 'center', display: 'flex'}}>
            <Link to="/subscription" className="subscribe-button">S'abonner</Link>
            <Link to="/login" className="login-button"><LoginOutlined /> Connexion</Link>
            <Link to="/register" className="register-button">Inscription</Link>
          </div>
        )}
      </div>
      <Drawer
        title={<span style={{ fontWeight: 700, fontSize: 20 }}><AppstoreOutlined style={{ color: '#1890ff', marginRight: 8 }} />Menu</span>}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 24 }}>
          <NotificationBell />
          {navLinks.map(link => (
            <Link to={link.to} className="navbar-link" key={link.to} onClick={() => setDrawerOpen(false)}>{link.icon} {link.label}</Link>
          ))}
          <Link to="/contact" className="navbar-link" onClick={() => setDrawerOpen(false)}><MailOutlined /> Contact</Link>
          <div style={{ marginTop: 24 }}>
            {isAuthenticated && user ? (
              <>
                <Link to="/dashboard" className="navbar-link" onClick={() => setDrawerOpen(false)}><AppstoreOutlined /> Tableau de bord</Link>
                <Button className="logout-button" icon={<LogoutOutlined />} style={{ width: '100%', marginTop: 8 }} onClick={() => { setDrawerOpen(false); handleLogout(); }}>
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <Link to="/subscription" className="subscribe-button" onClick={() => setDrawerOpen(false)}>S'abonner</Link>
                <Link to="/login" className="login-button" onClick={() => setDrawerOpen(false)}><LoginOutlined /> Connexion</Link>
                <Link to="/register" className="register-button" onClick={() => setDrawerOpen(false)}>Inscription</Link>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar; 