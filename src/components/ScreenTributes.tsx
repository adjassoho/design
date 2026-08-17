import React, { useState } from 'react';
import { TributeItem, MemorialProfile } from '../types';
import { Heart, Flame, MessageSquarePlus, Filter, Sparkles, Send, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface ScreenTributesProps {
  memorial: MemorialProfile;
  tributes: TributeItem[];
  onAddTribute: (tribute: TributeItem) => void;
}

export const ScreenTributes: React.FC<ScreenTributesProps> = ({
  memorial,
  tributes,
  onAddTribute,
}) => {
  const [filter, setFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [litCandlesCount, setLitCandlesCount] = useState<number>(
    tributes.filter((t) => t.candleLit).length + 42
  );
  const [hasUserLitCandle, setHasUserLitCandle] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [relationship, setRelationship] = useState<TributeItem['relationship']>('Children');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [includeCandle, setIncludeCandle] = useState(true);

  // Trigger celebration petals & candle
  const handleQuickLightCandle = () => {
    if (!hasUserLitCandle) {
      setLitCandlesCount((c) => c + 1);
      setHasUserLitCandle(true);
    }
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F5D77F', '#E8C15A', '#FFFAF0', '#6D1B28'],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    const newTribute: TributeItem = {
      id: `tribute-${Date.now()}`,
      author: authorName.trim(),
      relationship,
      content: message.trim(),
      date: 'Just now',
      candleLit: includeCandle,
      candleColor: '#F5D77F',
      location: location.trim() || undefined,
    };

    onAddTribute(newTribute);
    if (includeCandle) {
      setLitCandlesCount((c) => c + 1);
    }

    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF0D0', '#7A1C28'],
    });

    // Reset
    setAuthorName('');
    setMessage('');
    setLocation('');
    setIsModalOpen(false);
  };

  const filteredTributes =
    filter === 'All'
      ? tributes
      : tributes.filter((t) => t.relationship.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between overflow-y-auto bg-neutral-950 text-neutral-100 p-4 font-sans-custom select-none">
      {/* Top Banner & Candle Lighting Station */}
      <div className="relative z-10 space-y-3 pb-3 border-b border-amber-500/20">
        <div className="text-center">
          <span className="text-[10px] font-cinzel tracking-[0.3em] text-amber-400 font-semibold uppercase">
            Tributes & Condolence Book
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient uppercase mt-0.5">
            Words of Love & Honor
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Forever Cherishing <span className="text-amber-200 font-semibold">{memorial.fullName}</span>
          </p>
        </div>

        {/* Virtual Candle Lighting Widget */}
        <div className="bg-gradient-to-r from-[#2B080D] via-neutral-900 to-[#2B080D] rounded-2xl p-4 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shadow-lg">
              <Flame className="w-7 h-7 text-amber-400 animate-pulse filter drop-shadow-[0_0_8px_rgba(245,215,127,0.8)]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-300 animate-ping" />
            </div>
            <div>
              <div className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-wider">
                Virtual Memorial Flame
              </div>
              <p className="text-[11px] text-neutral-300">
                <strong className="text-amber-300">{litCandlesCount}</strong> candles glowing in loving memory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickLightCandle}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                hasUserLitCandle
                  ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950'
              }`}
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>{hasUserLitCandle ? 'Candle Lit 🕯️' : 'Light a Candle'}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-400" />
              <span>Add Tribute</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 text-xs no-scrollbar">
          {['All', 'Spouse', 'Children', 'Grandchildren', 'Church', 'Friend'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tribute Cards Feed */}
      <div className="relative z-10 flex-1 py-4 space-y-3.5">
        {filteredTributes.map((trib, idx) => (
          <motion.div
            key={trib.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 hover:border-amber-500/40 shadow-lg space-y-2.5 transition-all"
          >
            {/* Header: Author, Badge, Candle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-cinzel font-bold text-xs flex items-center justify-center">
                  {trib.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-amber-200">
                    {trib.author}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                    <span className="text-amber-400/90 font-medium">{trib.relationship}</span>
                    {trib.location && (
                      <>
                        <span>•</span>
                        <span>{trib.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {trib.candleLit && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] text-amber-300 font-medium">
                  <Flame className="w-3 h-3 text-amber-400 fill-current" />
                  <span>Candle</span>
                </div>
              )}
            </div>

            {/* Tribute Text */}
            <p className="text-xs sm:text-sm text-neutral-200 font-serif italic leading-relaxed pl-1 border-l-2 border-amber-500/30">
              “{trib.content}”
            </p>

            {/* Date */}
            <div className="text-right text-[10px] text-neutral-500 font-sans-custom">
              {trib.date}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tribute Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-amber-400 fill-current/30" />
                  <h3 className="font-cinzel text-base font-bold text-amber-200">
                    Write a Tribute
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Adeola Oyenuga"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Relationship *
                    </label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="Children">Children</option>
                      <option value="Wife / Spouse">Wife / Spouse</option>
                      <option value="Grandchildren">Grandchildren</option>
                      <option value="Siblings">Siblings</option>
                      <option value="Church & Ministry">Church & Ministry</option>
                      <option value="Colleague / Friend">Colleague / Friend</option>
                      <option value="Well-Wisher">Well-Wisher</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Your City / Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Ibadan, Nigeria"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Your Heartfelt Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share a beloved memory, prayer, or tribute to celebrate Pa Peter's glorious legacy..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={includeCandle}
                    onChange={(e) => setIncludeCandle(e.target.checked)}
                    className="rounded-xs text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-neutral-300 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    Light a virtual candle with this tribute
                  </span>
                </label>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-neutral-950 font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Tribute</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
