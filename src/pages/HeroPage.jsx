import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Sparkles, 
  ChevronRight, 
  Camera, 
  Clock, 
  Award,
  BookOpen,
  ArrowRight,
  Map as MapIcon
} from 'lucide-react';

export const HeroPage = ({ onExplorePlace, places, onNavigate, onOpenQR }) => {
  const { t, getLocalizedText } = useLanguage();
  const { user, setIsAuthModalOpen, setAuthMode } = useAuth();

  const handlePassportClick = () => {
    if (user) {
      if (typeof onNavigate === 'function') {
        onNavigate('/profile');
      }
    } else {
      if (typeof setAuthMode === 'function' && typeof setIsAuthModalOpen === 'function') {
        setAuthMode('login');
        setIsAuthModalOpen(true);
      }
    }
  };

  const handleScanQRClick = () => {
    if (typeof onOpenQR === 'function') {
      onOpenQR();
    }
  };

  const scrollToMap = () => {
    const el = document.getElementById('interactive-map');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const mapPins = [
    { id: 1, top: '40%', left: '30%', address: 'Tumanyan 2, Yerevan' },
    { id: 2, top: '25%', left: '55%', address: 'Abovyan 14, Yerevan' },
    { id: 3, top: '60%', left: '45%', address: 'Republic Square, Yerevan' },
    { id: 4, top: '35%', left: '70%', address: 'Aram Street 30, Yerevan' },
    { id: 5, top: '75%', left: '35%', address: 'Mashtots Ave 43, Yerevan' },
    { id: 6, top: '50%', left: '80%', address: 'Nalbandyan 21, Yerevan' },
  ];

  return (
    <div className="space-y-24 pb-16 font-sans">
      
      {/* 1. Hero Header */}
      <section className="relative w-full overflow-hidden rounded-b-[3rem] bg-gradient-to-b from-stone-50 to-stone-100 pt-20 pb-24 shadow-sm">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        <div className="text-center space-y-8 max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-amber-200 text-amber-700 text-xs sm:text-sm font-extrabold shadow-md">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
            {t('appName')}
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-stone-900 tracking-tight leading-[1.1]">
            <span className="block mb-2">{t('heroTitleLine1')}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 drop-shadow-sm">
              {t('heroTitleLine2')}
            </span>
          </h1>

          <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('tagline')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={handleScanQRClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-900 text-white font-bold hover:bg-stone-800 shadow-xl shadow-stone-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {t('scanQR')}
            </button>
            <button 
              onClick={handlePassportClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-stone-200 text-stone-700 font-bold hover:border-amber-400 hover:text-amber-700 shadow-sm transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              {t('passport')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. How It Works */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            {t('howItWorks')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 z-0" />
          
          <div className="relative z-10 bg-white p-8 rounded-3xl border border-stone-100 shadow-lg shadow-stone-200/50 hover:shadow-xl transition-shadow text-center space-y-4 group">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-stone-900">{t('step1')}</h3>
            <p className="text-sm text-stone-500 font-medium leading-relaxed">{t('step1Desc')}</p>
          </div>

          <div className="relative z-10 bg-white p-8 rounded-3xl border border-stone-100 shadow-lg shadow-stone-200/50 hover:shadow-xl transition-shadow text-center space-y-4 group">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-stone-900">{t('step2')}</h3>
            <p className="text-sm text-stone-500 font-medium leading-relaxed">{t('step2Desc')}</p>
          </div>

          <div className="relative z-10 bg-white p-8 rounded-3xl border border-stone-100 shadow-lg shadow-stone-200/50 hover:shadow-xl transition-shadow text-center space-y-4 group">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-stone-900">{t('step3')}</h3>
            <p className="text-sm text-stone-500 font-medium leading-relaxed">{t('step3Desc')}</p>
          </div>
        </div>
      </section>

     

      {/* 4. Featured Sites Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
            <MapPin className="w-8 h-8 text-amber-600 bg-amber-100 p-1.5 rounded-lg" />
            {t('exploreSites')}
          </h2>
          <button 
            onClick={scrollToMap}
            className="text-amber-700 font-bold hover:text-amber-800 flex items-center gap-1 group cursor-pointer"
          >
            {t('viewMap')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places?.map((place) => (
            <div
              key={place.id}
              onClick={() => onExplorePlace(place.id)}
              className="group cursor-pointer bg-white border border-stone-200 hover:border-amber-400 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
            >
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-stone-100">
                <img
                  src={place.sliders[0]?.oldImage || '/placeholder.png'}
                  alt={getLocalizedText(place.title)}
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-black text-stone-900">
                    {place.sliders[0]?.oldYear || 'PAST'}
                  </span>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-black text-white mb-1 drop-shadow-md">
                    {getLocalizedText(place.title)}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-1 font-medium">
                    {getLocalizedText(place.subtitle)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                    <Award className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-stone-500 group-hover:text-stone-900 transition-colors">
                    {t('getStamp')}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

 {/* 3. Interactive Map */}
      <section id="interactive-map" className="max-w-6xl mx-auto px-4 space-y-8 scroll-mt-24">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-stone-900 tracking-tight flex items-center justify-center gap-3">
            <MapIcon className="w-8 h-8 text-orange-600" />
            {t('mapTitle')}
          </h2>
          <p className="text-stone-500 font-medium">{t('mapDesc')}</p>
        </div>

        <div className="relative w-full aspect-square md:aspect-[21/9] bg-stone-100 rounded-[2.5rem] overflow-hidden border border-stone-200 shadow-inner group">
          <img 
            src="https://stevensonam.wordpress.com/wp-content/uploads/2014/02/hotels.jpg" 
            alt="Yerevan City Map" 
            className="w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-stone-900/10 pointer-events-none" />
          
          {mapPins.map((pin) => (
            <div 
              key={pin.id}
              className="absolute group/pin cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{ top: pin.top, left: pin.left }}
            >
              <div className="relative z-10 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-amber-500 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors text-amber-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-stone-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                {pin.address}
              </div>
              <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-30 animate-ping pointer-events-none" />
            </div>
          ))}
        </div>
      </section>
      {/* 5. Mission & Vision */}
      <section className="max-w-5xl mx-auto px-4 pb-10 space-y-12">
        <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50">
          <div className="flex-1 space-y-6">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center shadow-inner">
              <Camera className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-3xl font-black text-stone-900">
              {t('missionTitle')}
            </h2>
            <p className="text-stone-600 leading-relaxed font-medium">
              {t('missionDetailedText')}
            </p>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-amber-500/10 rounded-[2.5rem] transform translate-x-4 translate-y-4" />
            <img 
              src="https://static.time.com/v3/assets/bltea6093859af6183b/bltcc4942058e797e58/698a8a0cc9e9412dbd122940/Republic-Square-Yerevan-Armenia.jpg?branch=production&width=3008&quality=75&auto=webp&crop=16:9" 
              alt="Mission" 
              className="relative z-10 w-full aspect-video object-cover rounded-[2.5rem] shadow-lg border border-stone-200"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-10 bg-stone-900 text-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-rose-600/20 rounded-full blur-3xl" />
          
          <div className="flex-1 space-y-6 relative z-10">
            <div className="w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center border border-stone-700 shadow-inner">
              <Sparkles className="w-8 h-8 text-orange-400" />
            </div>
            <h2 className="text-3xl font-black text-white">
              {t('visionTitle')}
            </h2>
            <p className="text-stone-300 leading-relaxed font-medium">
              {t('visionDetailedText')}
            </p>
          </div>
          <div className="flex-1 w-full relative z-10">
            <div className="absolute inset-0 bg-stone-800 rounded-[2.5rem] transform -translate-x-4 translate-y-4" />
            <img 
              src="https://www.yerevan.am/uploads/media/default/0002/56/407de8c0158d8d54b8d3f2456ebf9ebf4dc6e36c.jpeg" 
              alt="Vision" 
              className="relative z-10 w-full aspect-video object-cover rounded-[2.5rem] shadow-2xl border border-stone-700"
            />
          </div>
        </div>
      </section>
      
    </div>
  );
};