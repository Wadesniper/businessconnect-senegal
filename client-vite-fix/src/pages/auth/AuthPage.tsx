import React from 'react';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';

const AuthPage: React.FC = () => {
  const isMobile = window.innerWidth < 800;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Logo et message de bienvenue */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#1890ff', marginBottom: 2 }}>
          Bienvenue sur BusinessConnect Sénégal
        </div>
        <div style={{ color: '#888', fontSize: 16 }}>
          Connectez-vous ou créez un compte pour rejoindre la communauté
        </div>
      </div>
      <div 
        className="auth-card"
        style={{ 
          background: '#fff', 
          borderRadius: 24, 
          boxShadow: '0 8px 32px #e3e8f7', 
          padding: window.innerWidth < 600 ? '8px 0' : 32, 
          maxWidth: 1000, 
          width: '100%', 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: isMobile ? 0 : 0, 
          position: 'relative',
          margin: '0 auto',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        {/* Trait vertical séparateur desktop, passe derrière le "ou" */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 32,
            bottom: 32,
            width: 2,
            background: 'linear-gradient(180deg, #e6f7ff 0%, #c3cfe2 100%)',
            zIndex: 1,
            borderRadius: 2,
            boxShadow: '0 0 8px #e6f7ff44',
            transform: 'translateX(-50%)',
          }} />
        )}
        {isMobile ? (
          <>
            {/* Inscription d'abord */}
            <div style={{ flex: 1, minWidth: 0, maxWidth: 420, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                border: '2px solid #1ec773',
                borderRadius: 12,
                background: 'linear-gradient(90deg, #e6fff2 0%, #fff 100%)',
                padding: '8px 0',
                marginBottom: 24,
                width: '100%',
                maxWidth: 320,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 26,
                color: '#1ec773',
                letterSpacing: 1,
                boxShadow: '0 2px 8px #1ec77311',
              }}>
                Inscription
              </div>
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
              <div style={{width:'100%', maxWidth:340, margin:'0 auto'}}>
                <RegisterForm noCard noBg hideLoginLink />
              </div>
            </div>
            {/* Séparateur OU, en absolute pour masquer le trait */}
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, pointerEvents: 'none' }}>
              <div style={{
                background: '#fff',
                color: '#1890ff',
                borderRadius: '50%',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 18,
                boxShadow: '0 2px 12px #1890ff22',
                border: '2px solid #e6f7ff',
              }}>ou</div>
            </div>
            {/* Connexion ensuite */}
            <div style={{ flex: 1, minWidth: 0, maxWidth: 420, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                border: '2px solid #1890ff',
                borderRadius: 12,
                background: 'linear-gradient(90deg, #f0f5ff 0%, #fff 100%)',
                padding: '8px 0',
                marginBottom: 24,
                width: '100%',
                maxWidth: 320,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 26,
                color: '#1890ff',
                letterSpacing: 1,
                boxShadow: '0 2px 8px #1890ff11',
              }}>
                Connexion
              </div>
              <div style={{width:'100%', maxWidth:340, margin:'0 auto'}}>
                <LoginForm noCard noBg hideRegisterLink />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Connexion d'abord (desktop) */}
            <div style={{ flex: 1, minWidth: 0, maxWidth: 420, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                border: '2px solid #1890ff',
                borderRadius: 12,
                background: 'linear-gradient(90deg, #f0f5ff 0%, #fff 100%)',
                padding: '8px 0',
                marginBottom: 24,
                width: '100%',
                maxWidth: 320,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 26,
                color: '#1890ff',
                letterSpacing: 1,
                boxShadow: '0 2px 8px #1890ff11',
              }}>
                Connexion
              </div>
              <div style={{width:'100%', maxWidth:340, margin:'0 auto'}}>
                <LoginForm noCard noBg hideRegisterLink />
              </div>
            </div>
            {/* Séparateur OU, en absolute pour masquer le trait */}
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, pointerEvents: 'none' }}>
              <div style={{
                background: '#fff',
                color: '#1890ff',
                borderRadius: '50%',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 18,
                boxShadow: '0 2px 12px #1890ff22',
                border: '2px solid #e6f7ff',
              }}>ou</div>
            </div>
            {/* Inscription ensuite (desktop) */}
            <div style={{ flex: 1, minWidth: 0, maxWidth: 420, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                border: '2px solid #1ec773',
                borderRadius: 12,
                background: 'linear-gradient(90deg, #e6fff2 0%, #fff 100%)',
                padding: '8px 0',
                marginBottom: 24,
                width: '100%',
                maxWidth: 320,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 26,
                color: '#1ec773',
                letterSpacing: 1,
                boxShadow: '0 2px 8px #1ec77311',
              }}>
                Inscription
              </div>
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
              <div style={{width:'100%', maxWidth:340, margin:'0 auto'}}>
                <RegisterForm noCard noBg hideLoginLink />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage; 