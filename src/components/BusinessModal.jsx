import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { MapPin, ExternalLink, Instagram, Facebook, X } from 'lucide-react';

export const BusinessModal = ({ business, isOpen, onClose }) => {
  const { getLocalizedText, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !business) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] w-screen h-[100dvh] bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 w-full bg-stone-200">
          <img 
            src={business.image} 
            alt={getLocalizedText(business.name)} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-black text-stone-900">{getLocalizedText(business.name)}</h2>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-1 rounded-md">
                {getLocalizedText(business.type)}
              </span>
            </div>
            <p className="text-sm text-stone-500 flex items-center gap-1.5 mt-1 font-medium">
              <MapPin className="w-4 h-4 text-amber-600" />
              {getLocalizedText(business.address)}
            </p>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">
            {getLocalizedText(business.description)}
          </p>

          <div className="pt-4 border-t border-stone-100 flex flex-col gap-3">
            <a 
              href={business.mapLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl text-xs font-bold transition shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              {t('viewOnMap')}
            </a>

            {business.socials && (
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="text-xs font-bold text-stone-400">{t('socials')}:</span>
                {business.socials.instagram && (
                  <a href={business.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 text-stone-500 hover:text-rose-600 bg-stone-100 rounded-full transition">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {business.socials.facebook && (
                  <a href={business.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 text-stone-500 hover:text-blue-600 bg-stone-100 rounded-full transition">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};