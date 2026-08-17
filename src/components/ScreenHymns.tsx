import React, { useState } from 'react';
import { HymnItem } from '../types';
import { defaultHymns } from '../data/defaultMemorial';
import { BookOpen, Music, Volume2, VolumeX, Plus, Minus, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface ScreenHymnsProps {
  initialHymnId?: string;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
}

export const ScreenHymns: React.FC<ScreenHymnsProps> = ({
  initialHymnId,
  isAudioPlaying,
  onToggleAudio,
}) => {
  const [selectedHymn, setSelectedHymn] = useState<HymnItem>(
    defaultHymns.find((h) => initialHymnId && h.title.includes(initialHymnId)) || defaultHymns[0]
  );
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHymns = defaultHymns.filter(
    (h) =>
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.lyrics.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between overflow-y-auto bg-neutral-950 text-neutral-100 p-4 font-sans-custom select-none">
      {/* Top Header */}
      <div className="relative z-10 space-y-3 pb-3 border-b border-amber-500/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-cinzel tracking-[0.3em] text-amber-400 font-semibold uppercase">
              Hymnal of Praise & Hope
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient uppercase mt-0.5">
              Service Hymns
            </h2>
          </div>

          {/* Controls: Audio & Font Size */}
          <div className="flex items-center space-x-1.5">
            {onToggleAudio && (
              <button
                onClick={onToggleAudio}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
                  isAudioPlaying
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
                title={isAudioPlaying ? "Mute Organ Tone" : "Play Gentle Organ Tone"}
              >
                {isAudioPlaying ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}

            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
              <button
                onClick={() => setFontSize(fontSize === 'xlarge' ? 'large' : 'normal')}
                className="p-1 text-neutral-400 hover:text-white"
                title="Decrease font size"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] px-1 text-amber-300 font-mono font-bold">Aa</span>
              <button
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'xlarge')}
                className="p-1 text-neutral-400 hover:text-white"
                title="Increase font size"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filteredHymns.map((hymn) => (
            <button
              key={hymn.id}
              onClick={() => setSelectedHymn(hymn)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedHymn.id === hymn.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Music className="w-3 h-3" />
              <span>{hymn.title}</span>
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
          <span className="text-xs font-cinzel font-bold text-amber-400 tracking-widest uppercase">
            {selectedHymn.number} • {selectedHymn.category}
          </span>
          <h3 className="font-cinzel text-xl sm:text-2xl font-black text-gold-gradient mt-1 uppercase">
            {selectedHymn.title}
          </h3>
          {selectedHymn.hymnAuthor && (
            <p className="text-xs text-neutral-400 font-serif italic mt-1">
              Words by {selectedHymn.hymnAuthor}
            </p>
          )}
        </div>

        {/* Lyrics Stanzas */}
        <div className="space-y-4 bg-neutral-900/60 rounded-3xl p-5 sm:p-6 border border-neutral-800 shadow-inner">
          {selectedHymn.lyrics.map((stanza, idx) => {
            const isRefrain = stanza.startsWith('Refrain:');
            return (
              <div
                key={idx}
                className={`leading-relaxed ${
                  isRefrain
                    ? 'pl-4 border-l-2 border-amber-400/60 font-serif italic text-amber-200/95 my-3'
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
