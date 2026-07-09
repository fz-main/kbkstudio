import React, { useState } from 'react';
import { translations } from '../../lib/i18n';
import type { Lang } from '../../lib/i18n';

const ADMIN_PASSWORD = 'KBK#9xLm!2vQw7Rp';

export const AdminLogin: React.FC = () => {
  const [lang] = useState<Lang>('cs');
  const t = translations[lang];
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_logged_in', 'true');
      window.location.reload();
    } else {
      setError(t.wrongPassword);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <h1 className="text-2xl font-bold text-center mb-6">{t.adminLoginTitle}</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" placeholder={t.passwordLabel} value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#e5d3b3] focus:border-transparent" required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#e5d3b3] text-black py-2 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50">
            {loading ? t.loggingIn : t.loginBtn}
          </button>
        </form>
      </div>
    </div>
  );
};
