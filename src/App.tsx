/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationHeader } from './components/NavigationHeader';
import { WelcomeCard } from './components/WelcomeCard';
import { PersonalInfoCard } from './components/PersonalInfoCard';
import { MyStyleCard } from './components/MyStyleCard';
import { CategoriesCard } from './components/CategoriesCard';
import { ImageLightbox } from './components/ImageLightbox';
import { ORIGINAL_PROFILE_DATA } from './data/profileData';

type StepType = 'welcome' | 'intro' | 'style' | 'categories';

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepType>('welcome');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sky_profile_theme_mode');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    url: string;
    caption: string;
  }>({
    isOpen: false,
    url: '',
    caption: '',
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('sky_profile_theme_mode', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('sky_profile_theme_mode', 'light');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const goToStep = (target: StepType) => {
    setCurrentStep(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLightbox = (url: string, caption: string) => {
    setLightbox({ isOpen: true, url, caption });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 select-none bg-ppt-texture overflow-x-hidden touch-pan-y ${
        isDarkMode
          ? 'dark bg-[#0f1012] text-neutral-100 selection:bg-neutral-200 selection:text-neutral-900'
          : 'bg-[#f7f7f5] text-neutral-900 selection:bg-neutral-800 selection:text-white'
      }`}
    >
      {/* Top Navigation Bar with Page Counter */}
      <NavigationHeader
        currentStep={currentStep}
        onNavigate={step => goToStep(step)}
        siteTitle={ORIGINAL_PROFILE_DATA.siteTitle}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Slide Presentation View - Fixed and stable, transitions with elegant fade */}
      <main
        key={currentStep}
        className="flex-1 pb-12 animate-fade-in"
      >
        {currentStep === 'welcome' && (
          <WelcomeCard
            onStart={() => goToStep('intro')}
            onImageClick={openLightbox}
          />
        )}

        {currentStep === 'intro' && (
          <PersonalInfoCard
            onNext={() => goToStep('style')}
            onPrev={() => goToStep('welcome')}
            onImageClick={openLightbox}
          />
        )}

        {currentStep === 'style' && (
          <MyStyleCard
            onNext={() => goToStep('categories')}
            onPrev={() => goToStep('intro')}
          />
        )}

        {currentStep === 'categories' && (
          <CategoriesCard
            onPrev={() => goToStep('style')}
            onRestart={() => goToStep('welcome')}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="mt-auto py-6 border-t border-neutral-300/60 dark:border-neutral-800/80 bg-white/70 dark:bg-[#121316]/70 backdrop-blur-xs text-xs text-neutral-400 dark:text-neutral-500 font-mono transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white transition-colors"></span>
            <span className="text-neutral-700 dark:text-neutral-300">
              {ORIGINAL_PROFILE_DATA.siteTitle} · ARCHIVE
            </span>
          </div>
          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 tracking-wider uppercase">
            BEFORE RESPIRATORY ARREST · PERSONAL PORTFOLIO
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={lightbox.isOpen}
        imageUrl={lightbox.url}
        caption={lightbox.caption}
        onClose={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
