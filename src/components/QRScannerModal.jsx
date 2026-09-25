import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Camera, MapPin, AlertCircle } from 'lucide-react';

export const QRScannerModal = ({ isOpen, onClose, places, onSelectPlace }) => {
  const { getLocalizedText, t } = useLanguage();
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    let stream = null;
    if (isOpen) {
      setCameraError(false);
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Camera stream error:', err);
          setCameraError(true);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2 text-amber-700">
            <Camera className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-sm">QR Camera Scanner</h3>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-900 text-xs font-bold px-2 py-1 bg-stone-100 rounded-lg">✕</button>
        </div>

        {/* Camera Viewport / Scanning Reticle */}
        <div className="relative aspect-video w-full bg-stone-900 rounded-xl overflow-hidden border border-stone-200 flex items-center justify-center shadow-inner">
          {!cameraError ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-dashed border-amber-400 rounded-xl pointer-events-none m-6 animate-pulse" />
            </>
          ) : (
            <div className="p-4 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs text-stone-200 font-medium">{t('cameraPermissionDenied')}</p>
            </div>
          )}
        </div>

        {/* Location Selection List */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-stone-500 block">{t('selectPlace')}</span>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {places.map((place) => (
              <button
                key={place.id}
                onClick={() => {
                  onSelectPlace(place.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 hover:bg-amber-50 hover:border-amber-300 transition text-left group"
              >
                <div>
                  <h4 className="text-xs font-extrabold text-stone-900 group-hover:text-amber-700">{getLocalizedText(place.title)}</h4>
                  <p className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3 h-3 text-amber-600" />
                    {getLocalizedText(place.location)}
                  </p>
                </div>
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                  {t('viewLocation')}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};