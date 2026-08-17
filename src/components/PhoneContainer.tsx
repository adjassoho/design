import React, { useState } from 'react';
import { Smartphone, Monitor, Sliders, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
  onOpenCustomizer?: () => void;
  title?: string;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({
  children,
  onOpenCustomizer,
  title = "Transition to Glory",
  isAudioPlaying = false,
  onToggleAudio,
}) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 text-neutral-100 font-sans-custom relative overflow-x-hidden">
      {/* Top App Bar & Quick Tools */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 px-3 mb-3 bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-lg text-sm">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-400 p-0.5 shadow-md flex items-center justify-center">
            <span className="text-[10px] font-bold text-neutral-950 font-cinzel">TG</span>
          </div>
          <div>
            <h1 className="font-cinzel text-xs sm:text-sm font-bold text-amber-200 tracking-wider">
              {title}
            </h1>
            <p className="text-[10px] sm:text-xs text-amber-400/80 hidden sm:block">
              Celebration of Life & Digital Memorial Program
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Audio Chime / Ambient organ toggle */}
          {onToggleAudio && (
            <button
              onClick={onToggleAudio}
              title={isAudioPlaying ? "Mute Memorial Music" : "Play Gentle Memorial Chime"}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all border ${
                isAudioPlaying
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-amber-200'
              }`}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline text-[11px]">{isAudioPlaying ? "Music Playing" : "Hymn Chime"}</span>
            </button>
          )}

          {/* Customize / Edit Profile button */}
          {onOpenCustomizer && (
            <button
              onClick={onOpenCustomizer}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize Program</span>
            </button>
          )}

          {/* View Mode Toggle (Mobile / Responsive) */}
          <div className="bg-neutral-800/90 rounded-xl p-0.5 border border-neutral-700/60 hidden sm:flex items-center">
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                viewMode === 'mobile'
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Smartphone Screen View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">Phone</span>
            </button>
            <button
              onClick={() => setViewMode('responsive')}
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                viewMode === 'responsive'
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Responsive Wide View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px]">Full</span>
            </button>
          </div>
        </div>
      </header>

      {/* Screen Frame Container */}
      <main
        className={`w-full transition-all duration-300 flex justify-center ${
          viewMode === 'mobile' ? 'max-w-[430px]' : 'max-w-4xl'
        }`}
      >
        <div
          className={`w-full relative overflow-hidden transition-all bg-neutral-900 border border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] ${
            viewMode === 'mobile'
              ? 'rounded-[44px] ring-12 ring-neutral-900/90 aspect-[9/19.5] min-h-[780px] max-h-[920px] flex flex-col justify-between'
              : 'rounded-3xl min-h-[750px] flex flex-col justify-between'
          }`}
        >
          {/* iOS Status Bar for Phone Mockup */}
          {viewMode === 'mobile' && (
            <div className="w-full pt-3 px-6 pb-1 flex justify-between items-center text-[12px] font-medium tracking-tight text-neutral-800 z-40 select-none bg-transparent">
              {/* Cellular Carrier & Signal */}
              <div className="flex items-center space-x-1.5">
                <div className="flex items-end space-x-[2px] h-3">
                  <div className="w-[3px] h-[3px] bg-neutral-800 rounded-xs"></div>
                  <div className="w-[3px] h-[6px] bg-neutral-800 rounded-xs"></div>
                  <div className="w-[3px] h-[9px] bg-neutral-800 rounded-xs"></div>
                  <div className="w-[3px] h-[12px] bg-neutral-800 rounded-xs"></div>
                </div>
                <span className="font-semibold text-neutral-800">iOS</span>
              </div>

              {/* Time */}
              <div className="font-semibold text-[13px] text-neutral-800 tracking-normal pl-2">
                2:26 AM
              </div>

              {/* Battery & Status */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-semibold text-neutral-800">93%</span>
                <div className="w-5 h-2.5 border border-neutral-800 rounded-sm p-[1px] flex items-center">
                  <div className="w-3.5 h-full bg-neutral-800 rounded-[1px]"></div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Content Body */}
          <div className="w-full flex-1 flex flex-col relative overflow-hidden">
            {children}
          </div>
        </div>
      </main>

      {/* Footer info note */}
      <footer className="mt-4 text-center text-xs text-neutral-500 max-w-md">
        <p className="flex items-center justify-center gap-1.5 text-neutral-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Memorial Experience • Dynamic Image & Link Ready</span>
        </p>
      </footer>
    </div>
  );
};
