import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Award, Lock, LogOut } from 'lucide-react';

export const PassportPage = ({ places, onSelectPlace }) => {
  const { t, getLocalizedText } = useLanguage();
  const { user, logoutUser } = useAuth();

  if (!user) return null;

  const collectedPlaceIds = new Set(user.collectedStamps?.map(s => s.placeId) || []);

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* User Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black flex items-center justify-center text-lg shadow-md shadow-orange-500/20">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">{user.name}</h2>
              <p className="text-xs text-stone-500 font-medium">{user.email}</p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 transition border border-stone-200"
            title={t('logout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-3 border-t border-stone-200 flex justify-between text-xs font-bold">
          <span className="text-stone-500">Total Unlocked Stamps:</span>
          <span className="font-black text-amber-700">
            {collectedPlaceIds.size} / {places.length}
          </span>
        </div>
      </div>

      {/* Stamps Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600" />
          {t('passport')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {places.map((place) => {
            const isCollected = collectedPlaceIds.has(place.id);

            return (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place.id)}
                className={`cursor-pointer rounded-2xl p-4 border transition flex flex-col items-center text-center space-y-3 relative overflow-hidden ${
                  isCollected
                    ? 'bg-white border-amber-400 shadow-md hover:shadow-lg hover:scale-105'
                    : 'bg-stone-100/70 border-stone-200 opacity-60 grayscale hover:opacity-80'
                }`}
              >
                <div className="relative w-20 h-20 rounded-full border-2 border-amber-500 p-1 flex items-center justify-center bg-white shadow-inner">
                  <img
                    src={place.stampImage}
                    alt={getLocalizedText(place.title)}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {!isCollected && (
                    <div className="absolute inset-0 bg-stone-900/60 rounded-full flex items-center justify-center backdrop-blur-xs">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-stone-900 line-clamp-1">
                    {getLocalizedText(place.title)}
                  </h4>
                  <span className={`text-[10px] font-bold mt-1 block ${isCollected ? 'text-emerald-700' : 'text-stone-500'}`}>
                    {isCollected ? t('stampCollected') : t('passiveStamps')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};