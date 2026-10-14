import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { ORIGINAL_PROFILE_DATA } from '../data/profileData';

interface WelcomeCardProps {
  onStart: () => void;
  onImageClick: (url: string, caption: string) => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ onStart, onImageClick }) => {
  const data = ORIGINAL_PROFILE_DATA;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in font-light">
      {/* Editorial Slide Card Container */}
      <div className="bg-[#ffffff] dark:bg-[#121316] rounded-xl border border-neutral-300/70 dark:border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-colors duration-200 p-6 sm:p-10 relative">
        {/* Top Slide Meta Line */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80 font-mono text-[10px] tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
          <div className="flex items-center gap-2">
            <span className="text-neutral-900 dark:text-white font-medium">COVER</span>
            <span>/</span>
            <span>PERSONAL PORTFOLIO</span>
          </div>
          <div className="flex items-center gap-2">
            <span>STATUS: ONLINE</span>
            <span>·</span>
            <span>01 / 04</span>
          </div>
        </div>

        {/* Main Composition: Layout matching Image 1 & Image 2 (Portfolio / Less is More) */}
        <div className="py-8 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Typographic Focus (7 cols) */}
          <div className="md:col-span-7 space-y-4 text-left">
            {/* Elegant Calligraphic Accent */}
            <div className="font-serif italic text-2xl sm:text-3xl text-neutral-400 dark:text-neutral-500 font-light tracking-wide">
              Love must be beyond recognition.
            </div>

            {/* PORTFOLIO Header */}
            <div>
              <div className="text-xs font-mono tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-500 mb-2">
                PORTFOLIO
              </div>

              {/* Nickname in Songti between PORTFOLIO and the quote */}
              <div className="flex items-center gap-3 mb-2">
                <h1
                  style={{ fontFamily: '"SimSun", "Songti SC", "STSong", "Noto Serif SC", serif' }}
                  className="text-3xl sm:text-4xl font-normal text-neutral-900 dark:text-white tracking-[0.2em] leading-none"
                >
                  {data.nickname}
                </h1>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 uppercase tracking-widest shrink-0 inline-flex items-center">
                  {data.badgeTitle}
                </span>
              </div>

              {/* Quote right after nickname - refined editorial serif italic with moderate weight */}
              <p
                style={{
                  fontFamily: '"Noto Serif SC", "Songti SC", "SimSun", "Cormorant Garamond", serif',
                  fontWeight: 400,
                  letterSpacing: '0.03em',
                  lineHeight: 1.5,
                }}
                className="text-sm sm:text-[15px] text-neutral-700 dark:text-neutral-300 pt-1"
              >
                {data.welcomeGreeting}
              </p>
            </div>

            {/* Style tags as text badges */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {data.styleTags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-light px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono tracking-wide pt-1">
              {data.welcomeFooterQuote}
            </p>
          </div>

          {/* Right Column: Architectural Circle Framing (5 cols) matching Image 2 */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              {/* Outer decorative geometric circle arc */}
              <div className="absolute inset-0 rounded-full border border-neutral-200 dark:border-neutral-800"></div>
              <div className="absolute -inset-2 rounded-full border border-dashed border-neutral-300/70 dark:border-neutral-800/60 pointer-events-none"></div>

              {/* Minimal Avatar Circle */}
              <div
                className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-white dark:border-neutral-800 shadow-md cursor-pointer group bg-white"
                onClick={() => onImageClick(data.avatarUrl, '许焕之 头像')}
              >
                <img
                  src={data.avatarUrl}
                  alt={data.nickname}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-neutral-950/10 group-hover:opacity-0 transition-opacity"></div>
              </div>

              {/* Architectural Axis label */}
              <div className="absolute -bottom-3 bg-white dark:bg-neutral-900 px-2 py-0.5 border border-neutral-200 dark:border-neutral-800 text-[9px] font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">
                ARCHIVE · 2026
              </div>
            </div>
          </div>
        </div>

        {/* PPT Dotted Rule with Solid Marker (Exact match to Image 1) */}
        <div className="my-6 relative flex items-center justify-center">
          <div className="w-full border-t border-dashed border-neutral-300 dark:border-neutral-700"></div>
          <div className="absolute w-14 h-1 bg-neutral-900 dark:bg-white rounded-full"></div>
        </div>

        {/* Bottom Bar matching PPT Footer & Original Text */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs text-left">
            <span className="font-normal text-neutral-800 dark:text-neutral-200 flex items-center gap-1 font-mono tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
              IP属地：{data.ipLocation}
            </span>
            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">|</span>
            <span className="text-[11px] font-light text-neutral-400 dark:text-neutral-500 tracking-wide font-mono">
              {data.ipSub}
            </span>
          </div>

          <button
            onClick={onStart}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-light text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer group active:scale-[0.98]"
          >
            <span className="font-mono tracking-widest text-xs">START / 开始了解</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] font-mono font-light text-neutral-400 dark:text-neutral-500 mt-4 tracking-widest uppercase transition-colors">
        STEP 01 OF 04 · PROCEED TO PERSONAL INFORMATION
      </p>
    </div>
  );
};
