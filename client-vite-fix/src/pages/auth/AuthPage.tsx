import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px #e3e8f7', padding: 32, maxWidth: 1000, width: '100%', display: 'flex', flexDirection: window.innerWidth < 800 ? 'column' : 'row', gap: 0, position: 'relative' }}>
        {/* Connexion */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 420, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 26, marginBottom: 24, color: '#1890ff', letterSpacing: 1 }}>Connexion</h2>
          <div style={{width:'100%', maxWidth:380}}>
            <LoginForm noCard noBg />
          </div>
        </div>
        {/* Séparateur OU */}
        <div style={{ display: window.innerWidth < 800 ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: 60 }}>
          <div style={{
            background: '#f0f5ff',
            color: '#1890ff',
            borderRadius: '50%',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            boxShadow: '0 2px 8px #1890ff11',
            border: '2px solid #e6f7ff',
          }}>ou</div>
        </div>
        {/* Inscription */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 420, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 26, marginBottom: 24, color: '#1ec773', letterSpacing: 1 }}>Inscription</h2>
          <div style={{
            background: 'linear-gradient(90deg, #e6fff2 0%, #f0f5ff 100%)',
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 14,
            textAlign: 'center',
            fontWeight: 500,
            color: '#1ec773',
            fontSize: 15,
            boxShadow: '0 2px 8px #1ec77311',
            maxWidth: 380,
            width: '100%'
          }}>
            Vous êtes nouveau ? Créez votre compte gratuitement pour découvrir la plateforme.<br/>
            <span style={{color:'#1890ff'}}>Certaines fonctionnalités nécessitent un abonnement.</span>
          </div>
          <div style={{width:'100%', maxWidth:380}}>
            <RegisterForm noCard noBg />
          </div>
        </div>
        {/* Séparateur OU mobile */}
        {window.innerWidth < 800 && (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '18px 0' }}>
            <div style={{
              background: '#f0f5ff',
              color: '#1890ff',
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 18,
              boxShadow: '0 2px 8px #1890ff11',
              border: '2px solid #e6f7ff',
            }}>ou</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage; 