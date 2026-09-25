import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const MediaModal = ({ isOpen, onClose, initialIndex, images, videoUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  useEffect(() => {
    setCurrentIndex(initialIndex || 0);
  }, [initialIndex, isOpen]);

  if (!isOpen) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {videoUrl ? (
        <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-stone-900 shadow-2xl">
          <iframe
            src={videoUrl}
            title="Video player"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="relative w-full max-w-5xl flex items-center justify-center">
          <img 
            src={images[currentIndex]} 
            alt="Gallery view" 
            className="max-h-[85vh] max-w-full object-contain rounded-lg select-none"
          />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 md:left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 md:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-[-2rem] text-white/50 text-sm font-medium tracking-widest">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};