import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MUST_READ_NOTICES, SPECIAL_TERMS } from '../data/profileData';

interface MyStyleCardProps {
  onNext: () => void;
  onPrev: () => void;
}

export const MyStyleCard: React.FC<MyStyleCardProps> = ({ onNext, onPrev }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in space-y-4 font-light">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-1.5 text-xs font-mono font-light text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-300/80 dark:border-neutral-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK / 返回个人信息</span>
        </button>
        <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 font-light">
          STEP 03 / 04 · MUST-READ
        </span>
      </div>

      {/* Main Slide Card: Clean Editorial Layout */}
      <div className="bg-white dark:bg-[#121316] rounded-xl border border-neutral-300/70 dark:border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-colors duration-200 p-6 sm:p-8">
        {/* Slide Header */}
        <div className="pb-4 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
              PAGE 03 · GUIDELINES
            </span>
            <h1 className="text-lg sm:text-xl font-normal text-neutral-900 dark:text-white tracking-wider uppercase font-serif">
              须知
            </h1>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 uppercase">
            NOTICE
          </span>
        </div>

        {/* Content Body: All notices together in one unified container */}
        <div className="py-6">
          <div className="p-4 sm:p-6 rounded-lg bg-neutral-50/70 dark:bg-neutral-800/30 border border-neutral-200/70 dark:border-neutral-800/80 text-left space-y-4">
            {/* Main notices - text flowing together without numbers */}
            <div className="space-y-3 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-light">
              {MUST_READ_NOTICES.map((item, idx) => (
                <p key={idx} className="tracking-wide">
                  {item}
                </p>
              ))}
            </div>

            {/* Subtle Divider */}
            <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-700/60"></div>

            {/* Special Terms */}
            <div className="space-y-2 font-mono text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
              {SPECIAL_TERMS.map((term, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0">◎</span>
                  <span>{term}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PPT Dotted Rule with Solid Marker (Matching Image 1) */}
        <div className="my-5 relative flex items-center justify-center">
          <div className="w-full border-t border-dashed border-neutral-300 dark:border-neutral-700"></div>
          <div className="absolute w-12 h-1 bg-neutral-900 dark:bg-white rounded-full"></div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-1 flex items-center justify-between">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 text-xs font-mono font-light text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PREV</span>
          </button>
          <button
            onClick={onNext}
            className="px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-light text-xs flex items-center gap-1.5 transition-all cursor-pointer group active:scale-[0.98]"
          >
            <span className="font-mono tracking-widest text-xs">PROCEED TO DIRECTORY</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
