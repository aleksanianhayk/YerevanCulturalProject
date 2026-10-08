import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SliderCarousel } from '../components/SliderCarousel';
import { MagazineStoryline } from '../components/MagazineStoryline';
import { BusinessModal } from '../components/BusinessModal';
import { MapPin, Award, CheckCircle, Clock, Volume2, VolumeX, Store, BookOpen, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export const PlacePage = ({ place }) => {
  const { getLocalizedText, t, lang } = useLanguage();
  const { user, claimStamp, setIsAuthModalOpen, setAuthMode, setPendingStampPlaceId } = useAuth();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  
  const audioRef = useRef(null);

  // Stop audio playback when language or place changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsLoadingAudio(false);
  }, [lang, place?.id]);

  if (!place) return null;

  const isStampCollected = user?.collectedStamps?.some(s => s.placeId === place.id);

  const handleGetStamp = () => {
    if (!user) {
      setPendingStampPlaceId(place.id);
      setAuthMode('login');
      setIsAuthModalOpen(true);
    } else {
      claimStamp(user.id, place.id);
    }
  };

  const fullText = place.storyline?.map(s => getLocalizedText(s.description)).join(' ') || '';
  const wordCount = fullText.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleTTS = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoadingAudio(true);
      
      const response = await fetch(`${API_BASE_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText, lang })
      });

      if (!response.ok) throw new Error('Audio generation failed');

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        setIsLoadingAudio(false);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoadingAudio(false);
      };

      await audio.play();
      setIsLoadingAudio(false);
      setIsPlaying(true);
    } catch (err) {
      console.error('Audio playback error:', err);
      setIsLoadingAudio(false);
      setIsPlaying(false);
      alert('Could not generate voiceover for this storyline.');
    }
  };

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="space-y-2 text-center md:text-left">
        <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
          <MapPin className="w-3 h-3 text-amber-600" />
          {getLocalizedText(place.location)}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          {getLocalizedText(place.title)}
        </h1>
        <p className="text-sm sm:text-lg text-stone-500 font-medium max-w-3xl">
          {getLocalizedText(place.subtitle)}
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 shadow-sm">
        <SliderCarousel sliders={place.sliders} />
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-100 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900 uppercase tracking-wide">{t('historicalNarrative')}</h2>
              <div className="flex items-center gap-1.5 text-stone-500 font-bold text-[11px] uppercase tracking-wider mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{readTime} {t('readTime')}</span>
              </div>
            </div>
          </div>
          
          
{lang !== 'hy' && (
  <button 
    onClick={handleTTS}
    disabled={isLoadingAudio}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm ${
      isPlaying 
        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200'
        : 'bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50'
    }`}
  >
    {isLoadingAudio ? (
      <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
    ) : isPlaying ? (
      <VolumeX className="w-4 h-4" />
    ) : (
      <Volume2 className="w-4 h-4" />
    )}
    
    {isLoadingAudio ? 'Loading...' : isPlaying ? t('stopListen') : t('listen')}
  </button>
)}

        </div>

        {/* Narrative Core */}
        <MagazineStoryline storyline={place.storyline} />

        {/* Stamp CTA */}
        <div className="pt-8 mt-8 border-t border-stone-200 max-w-sm mx-auto">
          {isStampCollected ? (
            <div className="w-full py-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold rounded-2xl flex items-center justify-center gap-2 text-sm shadow-inner">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              {t('stampCollected')}
            </div>
          ) : (
            <button
              onClick={handleGetStamp}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <Award className="w-5 h-5" />
              {t('getStamp')}
            </button>
          )}
        </div>
      </div>

      {/* Business Model: Recommended Nearby Places */}
      {place.nearbyBusinesses && place.nearbyBusinesses.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-base font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-600" />
            {t('nearbyPlaces')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {place.nearbyBusinesses.map((biz) => (
              <button
                key={biz.id}
                onClick={() => setSelectedBusiness(biz)}
                className="group text-left bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all flex flex-col"
              >
                <div className="h-40 w-full overflow-hidden relative">
                  <img 
                    src={biz.image} 
                    alt={getLocalizedText(biz.name)}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-amber-700 shadow-sm">
                    {getLocalizedText(biz.type)}
                  </div>
                </div>
                <div className="p-5 space-y-2 flex-grow">
                  <h4 className="font-black text-stone-900 text-base group-hover:text-amber-600 transition">
                    {getLocalizedText(biz.name)}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium line-clamp-2 leading-relaxed">
                    {getLocalizedText(biz.description)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <BusinessModal 
        business={selectedBusiness} 
        isOpen={!!selectedBusiness} 
        onClose={() => setSelectedBusiness(null)} 
      />
    </div>
  );
};