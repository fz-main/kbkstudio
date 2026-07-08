import React from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const AdminPage: React.FC = () => {
  const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
  return isLoggedIn ? <AdminDashboard /> : <AdminLogin />;
};
