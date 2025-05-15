import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px #e3e8f7', padding: 32, maxWidth: 1000, width: '100%', display: 'flex', flexDirection: window.innerWidth < 800 ? 'column' : 'row', gap: 32 }}>
        {/* Connexion */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 420, padding: 24, borderRight: window.innerWidth < 800 ? 'none' : '1px solid #f0f0f0', marginBottom: window.innerWidth < 800 ? 32 : 0 }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 26, marginBottom: 24, color: '#1890ff', letterSpacing: 1 }}>Connexion</h2>
          <LoginForm />
        </div>
        {/* Inscription */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 420, padding: 24 }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 26, marginBottom: 24, color: '#1ec773', letterSpacing: 1 }}>Inscription</h2>
          <div style={{
            background: 'linear-gradient(90deg, #e6fff2 0%, #f0f5ff 100%)',
            borderRadius: 10,
            padding: '16px 18px',
            marginBottom: 18,
            textAlign: 'center',
            fontWeight: 500,
            color: '#1ec773',
            fontSize: 16,
            boxShadow: '0 2px 8px #1ec77311',
          }}>
            Vous êtes nouveau ? Créez votre compte gratuitement pour découvrir la plateforme.<br/>
            <span style={{color:'#1890ff'}}>Certaines fonctionnalités nécessitent un abonnement.</span>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 