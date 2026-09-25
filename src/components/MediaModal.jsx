import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const MediaModal = ({ isOpen, onClose, initialIndex, images, videoUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    setCurrentIndex(initialIndex || 0);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [initialIndex, isOpen]);

  if (!isOpen) return null;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Close modal when clicking on the blurred background
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] w-screen h-[100dvh] bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-5xl bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        
        {/* Unified Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {videoUrl ? (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mt-6">
            <iframe
              src={videoUrl}
              title="Video player"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="relative w-full flex items-center justify-center mt-6 mb-2">
            <img 
              src={images[currentIndex]} 
              alt="Gallery view" 
              className="max-h-[75vh] max-w-full object-contain rounded-lg select-none"
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 md:left-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 md:right-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                <div className="absolute -bottom-6 text-white/50 text-xs font-bold tracking-widest">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};