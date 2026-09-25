import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Camera, User, Globe, QrCode, ChevronDown } from 'lucide-react';

export const Header = ({ onNavigate, currentPage, onOpenQR }) => {
  const { lang, setLang, t } = useLanguage();
  const { user, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hy', label: 'Հայերեն' },
    { code: 'ru', label: 'Русский' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <button onClick={() => onNavigate('/')} className="flex items-center gap-2.5 text-left group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black tracking-tight text-stone-900 block text-lg leading-none">TimeLens</span>
            <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider">YEREVAN</span>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200/80 text-stone-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-stone-200 transition"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span className="uppercase">{lang}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-stone-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-amber-50 transition ${
                      lang === l.code ? 'text-amber-700 bg-amber-100/60' : 'text-stone-700'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] uppercase text-stone-400">{l.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop-only Navigation Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenQR}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs transition shadow-md shadow-orange-500/20"
            >
              <QrCode className="w-4 h-4" />
              {t('scanQR')}
            </button>

            {user ? (
              <button
                onClick={() => onNavigate('/profile')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                  currentPage === '/profile'
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-stone-100 border-stone-200 text-stone-800 hover:bg-stone-200'
                }`}
              >
                <User className="w-4 h-4 text-amber-600" />
                {t('passport')}
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="text-xs font-extrabold bg-stone-900 hover:bg-stone-800 text-white px-4 py-1.5 rounded-xl transition shadow-sm"
              >
                {t('login')}
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};