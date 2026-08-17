import React, { useState } from 'react';
import { HymnItem } from '../types';
import { defaultHymns } from '../data/defaultMemorial';
import { Music, Volume2, VolumeX, Plus, Minus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ScreenHymnsProps {
  initialHymnId?: string;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
  language?: 'fr' | 'en';
}

export const ScreenHymns: React.FC<ScreenHymnsProps> = ({
  initialHymnId,
  isAudioPlaying,
  onToggleAudio,
  language = 'fr',
}) => {
  const isEn = language === 'en';
  const [selectedHymn, setSelectedHymn] = useState<HymnItem>(
    defaultHymns.find((h) => initialHymnId && h.id === initialHymnId) || defaultHymns[0]
  );
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [searchQuery, setSearchQuery] = useState('');

  const getHymnLines = (h: HymnItem): string[] => {
    if (h.lyrics && h.lyrics.length > 0) return h.lyrics;
    if (h.stanzas && h.stanzas.length > 0) {
      return h.stanzas.map((s) => s.lines.join('\n'));
    }
    return [];
  };

  const filteredHymns = defaultHymns.filter((h) => {
    const lines = getHymnLines(h);
    return (
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.category && h.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lines.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const activeLines = getHymnLines(selectedHymn);
  const currentIndex = defaultHymns.findIndex((h) => h.id === selectedHymn.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedHymn(defaultHymns[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < defaultHymns.length - 1) {
      setSelectedHymn(defaultHymns[currentIndex + 1]);
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between bg-neutral-950 text-neutral-100 p-4 font-sans-custom select-none pb-6">
      {/* Top Header */}
      <div className="relative z-10 space-y-3 pb-3 border-b border-amber-500/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-cinzel tracking-[0.3em] text-amber-400 font-semibold uppercase">
              {isEn ? 'Collection of Sacred Hymns' : 'Recueil des Cantiques d’Espérance'}
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200 uppercase mt-0.5">
              {isEn ? 'Hymns & Prayers' : 'Cantiques du Culte'}
            </h2>
          </div>

          {/* Controls: Audio & Font Size */}
          <div className="flex items-center space-x-1.5">
            {onToggleAudio && (
              <button
                onClick={onToggleAudio}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                  isAudioPlaying
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
                title={isAudioPlaying ? (isEn ? 'Mute Organ' : "Couper l'orgue") : (isEn ? 'Play Organ Requiem' : 'Jouer la mélodie céleste')}
              >
                {isAudioPlaying ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}

            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
              <button
                onClick={() => setFontSize(fontSize === 'xlarge' ? 'large' : 'normal')}
                className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
                title={isEn ? 'Decrease text' : 'Diminuer taille'}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] px-1 font-mono text-amber-300">Aa</span>
              <button
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'xlarge')}
                className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
                title={isEn ? 'Increase text' : 'Agrandir taille'}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search a hymn, number or lyrics...' : 'Rechercher un cantique, titre ou parole...'}
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
          />
        </div>

        {/* Hymns Selector Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filteredHymns.map((hymn) => (
            <button
              key={hymn.id}
              onClick={() => setSelectedHymn(hymn)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedHymn.id === hymn.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Music className="w-3 h-3" />
              <span>{hymn.title.split('(')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Hymn View */}
      <motion.div
        key={selectedHymn.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex-1 py-4 space-y-4"
      >
        {/* Hymn Title Card */}
        <div className="text-center bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-2xl p-4 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between px-2 text-xs text-amber-400/90 mb-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 text-[11px] font-medium transition-all ${
                currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-amber-200 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Previous' : 'Précédent'}</span>
            </button>

            <span className="font-cinzel font-bold tracking-widest uppercase text-[10px]">
              {selectedHymn.number} • {selectedHymn.category || (isEn ? 'Sacred' : 'Sacré')}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === defaultHymns.length - 1}
              className={`flex items-center gap-1 text-[11px] font-medium transition-all ${
                currentIndex === defaultHymns.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-amber-200 cursor-pointer'
              }`}
            >
              <span>{isEn ? 'Next' : 'Suivant'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="font-cinzel text-lg sm:text-xl font-black text-amber-100 mt-1 uppercase">
            {selectedHymn.title}
          </h3>
          {selectedHymn.hymnAuthor && (
            <p className="text-[11px] text-neutral-400 font-serif italic mt-0.5">
              {isEn ? 'Author / Composition: ' : 'Auteur / Composition : '} {selectedHymn.hymnAuthor}
            </p>
          )}
        </div>

        {/* Lyrics Stanzas */}
        <div className="space-y-4 bg-neutral-900/60 rounded-3xl p-5 sm:p-6 border border-neutral-800 shadow-inner">
          {activeLines.map((stanza, idx) => {
            const isRefrain = stanza.startsWith('Refrain :') || stanza.startsWith('Chorus:');
            return (
              <div
                key={idx}
                className={`leading-relaxed ${
                  isRefrain
                    ? 'pl-4 border-l-2 border-amber-400/60 font-serif italic text-amber-200/95 my-3 bg-amber-950/20 py-2 rounded-r-xl pr-2'
                    : 'text-neutral-100 font-serif'
                } ${
                  fontSize === 'normal'
                    ? 'text-sm sm:text-base'
                    : fontSize === 'large'
                    ? 'text-base sm:text-lg'
                    : 'text-lg sm:text-xl'
                }`}
              >
                {stanza.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className="mb-0.5">
                    {line}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
