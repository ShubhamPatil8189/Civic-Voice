import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>{t('dashboard_page.title')}</h2>
      {user ? (
        <div>
          <p>{t('dashboard_page.welcome', { name: user.firstName })}</p>
          <p>{t('dashboard_page.email', { email: user.email })}</p>
          <p>{t('dashboard_page.role', { role: user.role })}</p>
          <button onClick={logout} style={{ padding: '10px 20px' }}>
            {t('dashboard_page.logout')}
          </button>
        </div>
      ) : (
        <p>{t('dashboard_page.loading')}</p>
      )}
    </div>
  );
};

export default Dashboard;