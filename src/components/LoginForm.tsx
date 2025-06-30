import React, { useState } from 'react';
import { Card, Title } from '@/components/ui/card';
import { ForgotPasswordModal } from '@/components/ForgotPasswordModal';

const LoginForm = () => {
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  return (
    <>
      {/* Suppression des divs de debug/fallback, seul le modal ForgotPasswordModal reste */}
      <div className={`login-container`}>
        <Card className="login-card">
          <Title level={2} className="login-title">Connexion</Title>
          {/* Suppression des divs de debug/fallback, seul le modal reste */}
          <ForgotPasswordModal
            visible={forgotPasswordVisible}
            onClose={() => setForgotPasswordVisible(false)}
          />
        </Card>
      </div>
    </>
  );
};

export default LoginForm; 