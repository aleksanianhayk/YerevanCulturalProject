import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="py-6 text-center border-t border-stone-800/80 text-[11px] text-stone-500 bg-white">
      <p>{t('footerRights')}</p>
    </footer>
  );
};