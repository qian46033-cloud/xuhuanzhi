import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Disc, Check, Copy } from 'lucide-react';

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  src: string;
  label: string;
  shortLabel: string;
  queryParam: string;
}

export const TRACKS: TrackInfo[] = [
  {
    id: 'mercury',
    title: '追逐水星',
    artist: '辛辛君',
    src: '/mercury.mp3',
    label: '追逐水星',
    shortLabel: '水星',
    queryParam: 'mercury',
  },
  {
    id: 'honest',
    title: 'Honest',
    artist: 'rei brown',
    src: '/honest.mp3',
    label: 'Honest',
    shortLabel: 'Honest',
    queryParam: '2',
  },
  {
    id: 'broken',
    title: 'broken heart',
    artist: 'FinalSay',
    src: '/broken_heart.mp3',
    label: 'broken heart',
    shortLabel: 'FinalSay',
    queryParam: '1',
  },
];

const detectInitialTrack = (): TrackInfo => {
  if (typeof window === 'undefined') return TRACKS[0];
  try {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.toLowerCase();
    const v = params.get('v') || params.get('version') || params.get('music') || params.get('bgm');
    
    if (v === '1' || v === 'broken' || v === 'broken_heart' || hash === '#v1') {
      return TRACKS[2];
    }
    if (v === '2' || v === 'honest' || hash === '#v2' || hash === '#honest') {
      return TRACKS[1];
    }
    if (v === 'mercury' || v === 'zhuzhuishuixing' || hash === '#mercury') {
      return TRACKS[0];
    }
  } catch {
    // fallback
  }
  // Default to 辛辛君 - 《追逐水星》
  return TRACKS[0];
};

export const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(detectInitialTrack);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasUserToggled, setHasUserToggled] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3200);
  };

  // Sync audio element when track changes
  useEffect(() => {
    const audio = new Audio();
    const pathPrefix = window.location.pathname.startsWith('/xuhuanzhi')
      ? '/xuhuanzhi'
      : window.location.pathname.startsWith('/wanai')
      ? '/wanai'
      : (import.meta as any).env?.BASE_URL?.replace(/\/$/, '') || '';
    const cleanSrc = currentTrack.src.startsWith('/') ? currentTrack.src.slice(1) : currentTrack.src;
    const audioUrl = currentTrack.src.startsWith('http')
      ? currentTrack.src
      : pathPrefix ? `${pathPrefix}/${cleanSrc}` : `/${cleanSrc}`;

    audio.src = audioUrl;
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Attempt autoplay immediately
    const attemptAutoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // Autoplay policy prevented playback until user interaction
        setIsPlaying(false);
        const handleFirstInteraction = () => {
          if (!hasUserToggled && audioRef.current && audioRef.current.paused) {
            audioRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
                triggerToast(`正在播放: ${currentTrack.artist} - 《${currentTrack.title}》`);
              })
              .catch(() => {});
          }
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('touchstart', handleFirstInteraction);
          window.removeEventListener('keydown', handleFirstInteraction);
        };
        window.addEventListener('click', handleFirstInteraction, { once: true });
        window.addEventListener('touchstart', handleFirstInteraction, { once: true });
        window.addEventListener('keydown', handleFirstInteraction, { once: true });
      }
    };

    attemptAutoplay();

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [currentTrack.src]);

  const togglePlay = () => {
    setHasUserToggled(true);
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          triggerToast(`继续播放: ${currentTrack.artist} - 《${currentTrack.title}》`);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
        });
    }
  };

  const switchTrack = (target: TrackInfo) => {
    if (target.id === currentTrack.id) return;
    setHasUserToggled(true);
    setCurrentTrack(target);
    
    // Update browser URL query param without reload
    try {
      const url = new URL(window.location.href);
      if (target.id === 'mercury') {
        url.searchParams.delete('v');
      } else {
        url.searchParams.set('v', target.queryParam);
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }

    triggerToast(`已切换为: ${target.artist} - 《${target.title}》`);
  };

  const copyCurrentVersionLink = () => {
    try {
      const url = new URL(window.location.href);
      if (currentTrack.id === 'mercury') {
        url.searchParams.delete('v');
      } else {
        url.searchParams.set('v', currentTrack.queryParam);
      }
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopiedLink(true);
        triggerToast(`已复制《${currentTrack.title}》专属链接！`);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Version Selector Pills: 水星 / Honest / FinalSay */}
      <div className="flex items-center bg-neutral-200/80 dark:bg-neutral-800/80 p-0.5 rounded-full border border-neutral-300/70 dark:border-neutral-700/70 text-[10px] font-mono">
        {TRACKS.map((t) => {
          const isActive = t.id === currentTrack.id;
          return (
            <button
              key={t.id}
              onClick={() => switchTrack(t)}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer font-medium ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
              title={`切换至《${t.title}》- ${t.artist}`}
            >
              {t.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Audio Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 cursor-pointer shadow-xs ${
          isPlaying
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-neutral-900/10'
            : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
        }`}
        title={isPlaying ? '点击暂停音乐' : '点击播放背景音乐'}
        aria-label={isPlaying ? '暂停音乐' : '播放音乐'}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-500 dark:text-amber-400" />
            <span className="max-w-[70px] sm:max-w-[100px] truncate text-[11px] font-sans">
              {currentTrack.title}
            </span>
            {/* Visualizer bars */}
            <span className="flex items-center gap-0.5 h-3 ml-0.5">
              <span className="w-0.5 h-2.5 bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-3.5 bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-2 bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-sans">音乐</span>
          </>
        )}
      </button>

      {/* Share / Copy current version link button */}
      <button
        onClick={copyCurrentVersionLink}
        className="p-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        title="复制当前版本链接"
        aria-label="复制当前版本链接"
      >
        {copiedLink ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900/95 dark:bg-white/95 text-white dark:text-neutral-950 px-4 py-2.5 rounded-lg shadow-lg text-xs font-mono backdrop-blur-xs border border-neutral-800 dark:border-neutral-200 animate-fade-in flex items-center gap-2">
          <Disc className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
