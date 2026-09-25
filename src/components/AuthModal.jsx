import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { User, Mail, Lock, Calendar, AlertCircle, X } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, loginUser, registerUser } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'login') {
      const res = await loginUser(email, password);
      if (!res.success) setErrorMsg(res.error);
    } else {
      const res = await registerUser({ name, email, age, password });
      if (!res.success) setErrorMsg(res.error);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsAuthModalOpen(false);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] w-screen h-[100dvh] bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white border border-stone-200 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-3 right-3 w-8 h-8 bg-stone-100 text-stone-500 rounded-full flex items-center justify-center hover:bg-stone-200 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex border-b border-stone-200 mt-2 mb-5">
          <button
            onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-black border-b-2 transition ${
              authMode === 'login' ? 'border-amber-500 text-amber-700' : 'border-transparent text-stone-400'
            }`}
          >
            {t('login')}
          </button>
          <button
            onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-black border-b-2 transition ${
              authMode === 'register' ? 'border-amber-500 text-amber-700' : 'border-transparent text-stone-400'
            }`}
          >
            {t('register')}
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-stone-700">{t('name')}</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arman Sargsyan"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-extrabold text-stone-700">{t('email')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arman@example.am"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-extrabold text-stone-700">{t('password')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-stone-700">{t('age')}</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="24"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-xl text-xs transition shadow-md shadow-orange-500/20 mt-2"
          >
            {authMode === 'login' ? t('login') : t('register')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-[11px] text-amber-700 hover:underline font-bold"
          >
            {authMode === 'login' ? t('noAccount') : t('alreadyAccount')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};