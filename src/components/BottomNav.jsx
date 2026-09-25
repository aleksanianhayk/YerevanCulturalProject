import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Home, QrCode, User } from 'lucide-react';

export const BottomNav = ({ onNavigate, currentPage, onOpenQR }) => {
  const { t } = useLanguage();
  const { user, setIsAuthModalOpen, setAuthMode } = useAuth();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-6 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home Link */}
        <button
          onClick={() => onNavigate('/')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            currentPage === '/' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{t('home')}</span>
        </button>

        {/* Center Scanner Trigger */}
        <button
          onClick={onOpenQR}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 -mt-5 hover:scale-105 transition"
        >
          <QrCode className="w-6 h-6 text-white" />
        </button>

        {/* Passport / Login Link */}
        {user ? (
          <button
            onClick={() => onNavigate('/profile')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
              currentPage === '/profile' ? 'text-amber-600' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-5 h-5" />
            <span>{t('passport')}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-amber-600"
          >
            <User className="w-5 h-5" />
            <span>{t('login')}</span>
          </button>
        )}

      </div>
    </div>
  );
};