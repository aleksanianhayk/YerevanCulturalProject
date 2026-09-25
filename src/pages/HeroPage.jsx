import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { MapPin, Sparkles, Target, Eye, ChevronRight } from 'lucide-react';

export const HeroPage = ({ onExplorePlace, places }) => {
  const { t, getLocalizedText } = useLanguage();

  return (
    <div className="space-y-16 pb-12">
      
      {/* Enhanced Hero Header */}
      <section className="text-center space-y-6 pt-10 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Yerevan Cultural Time Travel Startup
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-tight">
          Step Into Yerevan's <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600">
            Living History
          </span>
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed font-medium">
          {t('tagline')}
        </p>
      </section>

      {/* Featured Sites Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-amber-700 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            {t('exploreSites')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div
              key={place.id}
              onClick={() => onExplorePlace(place.id)}
              className="group cursor-pointer bg-white border border-stone-200 hover:border-amber-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col"
            >
              <div className="aspect-video w-full relative overflow-hidden bg-stone-100">
                <img
                  src={place.sliders[0]?.oldImage}
                  alt={getLocalizedText(place.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-stone-900 bg-white/90 px-2.5 py-1 rounded-lg shadow-sm">
                  {place.sliders[0]?.oldYear || 'PAST'}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                <div>
                  <h3 className="text-base font-black text-stone-900 group-hover:text-amber-700 transition">
                    {getLocalizedText(place.title)}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">{getLocalizedText(place.subtitle)}</p>
                </div>
                <div className="text-[11px] font-bold text-amber-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Story <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Section (Business/Startup Focus) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-amber-500/20 transition duration-700" />
          <Target className="w-10 h-10 text-amber-500 mb-6" />
          <h2 className="text-2xl font-black mb-4">{t('missionTitle')}</h2>
          <p className="text-sm text-stone-300 leading-relaxed font-medium">
            We aim to bridge the gap between Yerevan's rich history and modern technology. Our mission is to transform urban exploration into an interactive learning experience, empowering locals and tourists to connect with the city's heritage through augmented storytelling and gamification.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition duration-700" />
          <Eye className="w-10 h-10 text-orange-200 mb-6" />
          <h2 className="text-2xl font-black mb-4">{t('visionTitle')}</h2>
          <p className="text-sm text-amber-50 leading-relaxed font-medium">
            Our vision is to create a digital museum without walls, where every street corner tells a story. We strive to build an ecosystem that not only preserves cultural heritage but also supports local businesses by guiding mindful explorers to historical cafes, restaurants, and artisan shops.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 space-y-10 shadow-sm text-center">
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          {t('howItWorks')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-600 font-black text-xl flex items-center justify-center shadow-inner">1</div>
            <h3 className="text-sm font-extrabold text-stone-900">{t('step1')}</h3>
            <p className="text-xs text-stone-500 leading-relaxed font-medium px-4">{t('step1Desc')}</p>
          </div>

          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100 text-orange-600 font-black text-xl flex items-center justify-center shadow-inner">2</div>
            <h3 className="text-sm font-extrabold text-stone-900">{t('step2')}</h3>
            <p className="text-xs text-stone-500 leading-relaxed font-medium px-4">{t('step2Desc')}</p>
          </div>

          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 font-black text-xl flex items-center justify-center shadow-inner">3</div>
            <h3 className="text-sm font-extrabold text-stone-900">{t('step3')}</h3>
            <p className="text-xs text-stone-500 leading-relaxed font-medium px-4">{t('step3Desc')}</p>
          </div>
        </div>
      </section>
      
    </div>
  );
};