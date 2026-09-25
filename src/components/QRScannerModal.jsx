import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Camera, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import jsQR from 'jsqr';

export const QRScannerModal = ({ isOpen, onClose, places, onSelectPlace }) => {
  const { t } = useLanguage();
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  
  const [cameraError, setCameraError] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    let stream = null;
    
    const startCamera = async () => {
      try {
        setCameraError(false);
        setScanSuccess(false);
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", true);
          videoRef.current.play();
          requestRef.current = requestAnimationFrame(tick);
        }
      } catch (err) {
        console.warn('Camera stream error:', err);
        setCameraError(true);
      }
    };

    if (isOpen) {
      startCamera();
    }

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isOpen]);

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        handleScan(code.data);
      }
    }
    
    if (!scanSuccess) {
      requestRef.current = requestAnimationFrame(tick);
    }
  };

  const handleScan = (data) => {
    try {
      let placeId = null;

      if (data.includes('/place/')) {
        const parts = data.split('/place/');
        placeId = parts[parts.length - 1].replace(/\/$/, "");
      } else {
        placeId = data;
      }

      // Verify the extracted ID exists in our places database
      if (places.some(p => p.id === placeId)) {
        setScanSuccess(true);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        
        // Show success ring briefly before navigating
        setTimeout(() => {
          onSelectPlace(placeId);
          onClose();
        }, 600);
      }
    } catch (err) {
      console.warn("QR parsing error:", err);
    }
  };

  if (!isOpen) return null;

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
        className="bg-white border border-stone-200 w-full max-w-md rounded-2xl p-5 pt-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-stone-100 text-stone-500 rounded-full flex items-center justify-center hover:bg-stone-200 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-700 border-b border-stone-200 pb-3 mt-2">
          <Camera className="w-5 h-5 text-amber-600" />
          <h3 className="font-black text-sm">QR Camera Scanner</h3>
        </div>

        {/* Camera Viewport */}
        <div className={`relative aspect-[4/3] w-full bg-stone-900 rounded-xl overflow-hidden border-4 flex items-center justify-center shadow-inner transition-colors duration-300 ${scanSuccess ? 'border-emerald-500' : 'border-stone-200'}`}>
          {!cameraError ? (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
              
              {scanSuccess ? (
                <div className="absolute inset-0 bg-emerald-500/20 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-md" />
                  <span className="text-white font-black mt-2 text-sm drop-shadow-md">Place Found!</span>
                </div>
              ) : (
                <div className="absolute inset-0 border-2 border-dashed border-amber-400 rounded-xl pointer-events-none m-8 animate-pulse" />
              )}
            </>
          ) : (
            <div className="p-4 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs text-stone-200 font-medium">{t('cameraPermissionDenied')}</p>
            </div>
          )}
        </div>
        
        <p className="text-center text-xs text-stone-500 font-medium mt-4 pb-2">
          Point your camera at a location's QR code to scan it.
        </p>

      </div>
    </div>
  );
};