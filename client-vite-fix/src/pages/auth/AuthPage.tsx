import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px #e3e8f7', padding: 32, maxWidth: 900, width: '100%', display: 'flex', flexDirection: window.innerWidth < 800 ? 'column' : 'row', gap: 0 }}>
        <div style={{ flex: 1, minWidth: 320, maxWidth: 420, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 32 }}>
            <button
              onClick={() => setActiveTab('login')}
              style={{
                background: activeTab === 'login' ? '#1890ff' : '#f0f5ff',
                color: activeTab === 'login' ? '#fff' : '#1890ff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 18,
                padding: '10px 32px',
                cursor: 'pointer',
                transition: 'all 0.18s',
                boxShadow: activeTab === 'login' ? '0 4px 16px #1890ff22' : 'none',
              }}
            >
              Connexion
            </button>
            <button
              onClick={() => setActiveTab('register')}
              style={{
                background: activeTab === 'register' ? '#1ec773' : '#e6fff2',
                color: activeTab === 'register' ? '#fff' : '#1ec773',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 18,
                padding: '10px 32px',
                cursor: 'pointer',
                transition: 'all 0.18s',
                boxShadow: activeTab === 'register' ? '0 4px 16px #1ec77322' : 'none',
              }}
            >
              Inscription
            </button>
          </div>
          {activeTab === 'login' ? (
            <LoginForm />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 