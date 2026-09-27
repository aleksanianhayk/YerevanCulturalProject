import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/Header'; // <-- Default import
import { BottomNav } from './components/BottomNav'; // <-- Named imports
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { QRScannerModal } from './components/QRScannerModal';

// Pages
import { HeroPage } from './pages/HeroPage';
import { PlacePage } from './pages/PlacePage';
import { PassportPage } from './pages/PassportPage';

import { API_BASE_URL } from './config';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [places, setPlaces] = useState([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Sync URL changes with state
  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // NEW: Scroll to top whenever the route (currentPath) changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPath]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/places`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPlaces(data);
      })
      .catch(err => console.error('Error fetching places:', err));
  }, []);

  // Parse placeId from route /place/:id
  const isPlaceRoute = currentPath.startsWith('/place/');
  const currentPlaceId = isPlaceRoute ? currentPath.replace('/place/', '') : null;
  const currentPlace = places.find(p => p.id === currentPlaceId);

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-amber-50/40 text-stone-900 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
          <div>
            <Header
              onNavigate={navigateTo}
              currentPage={currentPath}
              onOpenQR={() => setIsQRModalOpen(true)}
            />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
              {currentPath === '/' && (
                <HeroPage
                  onExplorePlace={(id) => navigateTo(`/place/${id}`)}
                  places={places}
                  onNavigate={navigateTo}
                  onOpenQR={() => setIsQRModalOpen(true)} 
                />
              )}

              {isPlaceRoute && (
                <PlacePage place={currentPlace || places[0]} />
              )}

              {currentPath === '/profile' && (
                <PassportPage
                  places={places}
                  onSelectPlace={(id) => navigateTo(`/place/${id}`)}
                />
              )}
            </main>
          </div>

          <Footer />

          {/* Phone Bottom Navigation Bar */}
          <BottomNav
            onNavigate={navigateTo}
            currentPage={currentPath}
            onOpenQR={() => setIsQRModalOpen(true)}
          />

          <AuthModal />

          <QRScannerModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            places={places}
            onSelectPlace={(id) => navigateTo(`/place/${id}`)}
          />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}