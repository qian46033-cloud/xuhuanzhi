import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { MusicPlayer } from './MusicPlayer';

interface NavigationHeaderProps {
  currentStep: string;
  onNavigate: (step: 'welcome' | 'intro' | 'style' | 'categories') => void;
  siteTitle: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentStep,
  onNavigate,
  siteTitle,
  isDarkMode,
  onToggleTheme,
}) => {
  const steps = [
    { key: 'welcome', num: '01', label: 'WELCOME' },
    { key: 'intro', num: '02', label: 'INFO' },
    { key: 'style', num: '03', label: 'MUST-READ' },
    { key: 'categories', num: '04', label: 'DIRECTORY' },
  ] as const;

  const currentStepNum =
    currentStep === 'welcome'
      ? '01'
      : currentStep === 'intro'
      ? '02'
      : currentStep === 'style'
      ? '03'
      : currentStep === 'categories'
      ? '04'
      : '04';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#f8f8f6]/90 dark:bg-[#0e0f11]/90 backdrop-blur-md border-b border-neutral-300/70 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between font-mono text-xs">
        {/* Left: Brand title like "Prince PPT" */}
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
        >
          <span className="w-1.5 h-1.5 bg-neutral-900 dark:bg-white transition-colors"></span>
          <span className="font-serif tracking-wider text-sm font-normal text-neutral-900 dark:text-neutral-100">
            {siteTitle}
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono hidden sm:inline">
            / PORTFOLIO
          </span>
        </button>

        {/* Right: Step pills + Page count + Theme switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Step buttons */}
          <div className="flex items-center gap-1 bg-neutral-200/60 dark:bg-neutral-800/60 p-0.5 rounded border border-neutral-300/60 dark:border-neutral-700/60 text-[10px]">
            {steps.map(step => {
              const isActive = currentStep === step.key;
              return (
                <button
                  key={step.key}
                  onClick={() => onNavigate(step.key)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-medium'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <span className="mr-0.5">{step.num}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Page Counter like "15页 / 26页" in the PPT layout */}
          <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
            {currentStepNum}/04页
          </span>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded border border-neutral-300/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            title={isDarkMode ? '切换浅色模式' : '切换深色模式'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Music Player Button */}
          <MusicPlayer />
        </div>
      </div>
    </header>
  );
};
