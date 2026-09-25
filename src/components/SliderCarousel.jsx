import React, { useState } from 'react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const SliderCarousel = ({ sliders }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!sliders || sliders.length === 0) return null;

  return (
    <div className="relative space-y-3">
      <BeforeAfterSlider sliderData={sliders[currentIndex]} />

      {sliders.length > 1 && (
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? sliders.length - 1 : prev - 1))}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-400 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {sliders.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-6 bg-amber-500' : 'w-2 bg-stone-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev === sliders.length - 1 ? 0 : prev + 1))}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-400 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};