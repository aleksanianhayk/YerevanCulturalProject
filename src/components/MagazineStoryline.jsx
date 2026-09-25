import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { PlayCircle, Maximize2 } from 'lucide-react';
import { MediaModal } from './MediaModal';

export const MagazineStoryline = ({ storyline }) => {
  const { getLocalizedText } = useLanguage();
  const [modalState, setModalState] = useState({ isOpen: false, type: null, url: null, index: 0 });

  // Extract all images for the carousel feature
  const galleryImages = storyline
    .filter(item => item.mediaType === 'image')
    .map(item => item.mediaUrl);

  const openImageGallery = (imageUrl) => {
    const idx = galleryImages.indexOf(imageUrl);
    setModalState({ isOpen: true, type: 'gallery', url: null, index: idx });
  };

  const openVideo = (videoUrl) => {
    setModalState({ isOpen: true, type: 'video', url: videoUrl, index: 0 });
  };

  return (
    <>
      <div className="space-y-12">
        {storyline.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div key={item.id} className={`flex flex-col gap-6 md:gap-10 items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              
              {/* Media Section */}
              <div className="w-full md:w-5/12 shrink-0 relative group rounded-2xl overflow-hidden shadow-lg border border-stone-100 bg-stone-100">
                {item.mediaType === 'image' ? (
                  <div 
                    className="relative cursor-pointer w-full aspect-square md:aspect-[4/5]"
                    onClick={() => openImageGallery(item.mediaUrl)}
                  >
                    <img 
                      src={item.mediaUrl} 
                      alt={getLocalizedText(item.title)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition duration-300 flex items-center justify-center">
                      <Maximize2 className="text-white opacity-0 group-hover:opacity-100 w-8 h-8 drop-shadow-md transform scale-75 group-hover:scale-100 transition duration-300" />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full aspect-square md:aspect-[4/5] bg-stone-800">
                    <img 
                      src={item.mediaUrl.replace('embed/', 'vi/').split('?')[0] + '/maxresdefault.jpg'} 
                      className="w-full h-full object-cover opacity-60"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1485001564903-56e6a54d46ce?w=800&q=80'; }} 
                      alt="Video thumbnail"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <button 
                        onClick={() => openVideo(item.mediaUrl)}
                        className="group-hover:scale-110 transition duration-300 bg-amber-500/90 hover:bg-amber-500 text-white p-4 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.5)] backdrop-blur-sm flex items-center justify-center"
                      >
                        <PlayCircle className="w-10 h-10 ml-1" />
                      </button>
                      <span className="text-white text-xs font-bold uppercase tracking-widest mt-4 drop-shadow-md">
                        Watch Video
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Content Section */}
              <div className="w-full md:w-7/12 space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                  {getLocalizedText(item.title)}
                </h3>
                <div className="w-12 h-1 bg-amber-500 rounded-full"></div>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
                  {getLocalizedText(item.description)}
                </p>
                
                {item.mediaType === 'video' && (
                  <button 
                    onClick={() => openVideo(item.mediaUrl)}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-md"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Play Related Video
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      <MediaModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null, url: null, index: 0 })}
        images={galleryImages}
        initialIndex={modalState.index}
        videoUrl={modalState.type === 'video' ? modalState.url : null}
      />
    </>
  );
};