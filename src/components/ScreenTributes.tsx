import React, { useState } from 'react';
import { TributeItem, FuneralProfile } from '../types';
import { Heart, Flame, MessageSquarePlus, Sparkles, Send, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { getThemeStyles } from '../utils/themeStyles';

interface ScreenTributesProps {
  memorial: FuneralProfile;
  tributes: TributeItem[];
  onAddTribute: (tribute: TributeItem) => void;
}

export const ScreenTributes: React.FC<ScreenTributesProps> = ({
  memorial,
  tributes,
  onAddTribute,
}) => {
  const isEn = memorial.language === 'en';
  const theme = getThemeStyles(memorial.themeColor);
  const [filter, setFilter] = useState<string>('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [litCandlesCount, setLitCandlesCount] = useState<number>(
    tributes.filter((t) => t.candleLit).length + 42
  );
  const [hasUserLitCandle, setHasUserLitCandle] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [relationship, setRelationship] = useState<string>(isEn ? 'Children' : 'Enfants');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [includeCandle, setIncludeCandle] = useState(true);

  // Quick candle light
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
      date: isEn ? 'Just now' : 'À l’instant',
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

    setAuthorName('');
    setMessage('');
    setLocation('');
    setIsModalOpen(false);
  };

  const filterCategories = isEn
    ? ['All', 'Spouse', 'Children', 'Grandchildren', 'Church', 'Friends']
    : ['Tous', 'Épouse', 'Enfants', 'Petits-enfants', 'Église', 'Amis'];

  const filteredTributes =
    filter === 'Tous' || filter === 'All'
      ? tributes
      : tributes.filter((t) => {
          const rel = (t.relationship || '').toLowerCase();
          const f = filter.toLowerCase();
          if (f === 'épouse' || f === 'spouse') return rel.includes('épous') || rel.includes('wife') || rel.includes('spouse');
          if (f === 'enfants' || f === 'children') return rel.includes('enfant') || rel.includes('child') || rel.includes('fils') || rel.includes('fille');
          if (f === 'petits-enfants' || f === 'grandchildren') return rel.includes('petit') || rel.includes('grand');
          if (f === 'église' || f === 'church') return rel.includes('églis') || rel.includes('church') || rel.includes('minist') || rel.includes('parois');
          if (f === 'amis' || f === 'friends') return rel.includes('ami') || rel.includes('friend') || rel.includes('collègue');
          return rel.includes(f);
        });

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between bg-neutral-950 text-neutral-100 p-4 font-sans-custom select-none pb-6">
      {/* Top Banner & Candle Lighting Station */}
      <div className={`relative z-10 space-y-3 pb-3 border-b ${theme.borderColor}`}>
        <div className="text-center">
          <span className={`text-[10px] font-cinzel tracking-[0.3em] ${theme.accentText} font-semibold uppercase`}>
            {isEn ? 'Tributes & Condolence Book' : 'Livre de Condoléances & Hommages'}
          </span>
          <h2 className={`font-cinzel text-xl sm:text-2xl font-bold ${theme.titleGradient} uppercase mt-0.5`}>
            {isEn ? 'Words of Love & Honor' : 'Mots d’Amour & Témoignages'}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {isEn ? 'In loving memory of ' : 'En hommage affectueux à '}
            <span className={`font-semibold ${theme.accentLightText}`}>{memorial.fullName}</span>
          </p>
        </div>

        {/* Virtual Candle Lighting Widget */}
        <div className={`bg-gradient-to-r ${theme.cardGradient} rounded-2xl p-4 border ${theme.borderColor} shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left`}>
          <div className="flex items-center space-x-3">
            <div className={`relative w-12 h-12 rounded-2xl ${theme.badgeBg} flex items-center justify-center shadow-lg`}>
              <Flame className={`w-7 h-7 ${theme.accentText} animate-pulse filter drop-shadow-[0_0_8px_rgba(245,215,127,0.8)]`} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-300 animate-ping" />
            </div>
            <div>
              <div className={`font-cinzel text-xs font-bold ${theme.accentLightText} uppercase tracking-wider`}>
                {isEn ? 'Virtual Memorial Flame' : 'Flamme du Souvenir Éternel'}
              </div>
              <p className="text-[11px] text-neutral-300">
                <strong className={theme.accentText}>{litCandlesCount}</strong> {isEn ? 'candles glowing in loving memory' : 'bougies allumées en mémoire'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickLightCandle}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                hasUserLitCandle
                  ? `${theme.badgeBg}`
                  : `bg-gradient-to-r ${theme.buttonGradient} text-neutral-950`
              }`}
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>{hasUserLitCandle ? (isEn ? 'Candle Lit 🕯️' : 'Bougie Allumée 🕯️') : (isEn ? 'Light a Candle' : 'Allumer une bougie')}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className={`px-3 py-2 rounded-xl ${theme.secondaryBtn} text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer`}
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{isEn ? 'Add Tribute' : 'Déposer un hommage'}</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 text-xs no-scrollbar">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                filter === cat
                  ? `bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold shadow-xs`
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
            className={`bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 hover:${theme.borderColor} shadow-lg space-y-2.5 transition-all`}
          >
            {/* Header: Author, Badge, Candle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full ${theme.badgeBg} font-cinzel font-bold text-xs flex items-center justify-center`}>
                  {trib.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-neutral-100">
                    {trib.author}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                    <span className={`${theme.accentLightText} font-medium`}>{trib.relationship}</span>
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
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${theme.badgeBg} text-[10px] font-medium`}>
                  <Flame className={`w-3 h-3 ${theme.accentText} fill-current`} />
                  <span>{isEn ? 'Candle' : 'Bougie'}</span>
                </div>
              )}
            </div>

            {/* Tribute Text */}
            <p className={`text-xs sm:text-sm text-neutral-200 font-serif italic leading-relaxed pl-2 border-l-2 ${theme.borderColor}`}>
              « {trib.content} »
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
              className={`bg-neutral-900 border ${theme.borderColor} rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4`}
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className={`w-5 h-5 ${theme.accentText} fill-current/30`} />
                  <h3 className={`font-cinzel text-base font-bold ${theme.accentLightText}`}>
                    {isEn ? 'Write a Tribute' : 'Rédiger un Hommage'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {isEn ? 'Your Full Name *' : 'Votre Nom & Prénom *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? 'e.g., Dr. Samuel Mensah' : 'Ex: Dr. Samuel Mensah'}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      {isEn ? 'Relationship *' : 'Lien avec le défunt *'}
                    </label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-hidden focus:border-amber-400"
                    >
                      {isEn ? (
                        <>
                          <option value="Children">Children</option>
                          <option value="Wife / Spouse">Wife / Spouse</option>
                          <option value="Grandchildren">Grandchildren</option>
                          <option value="Siblings">Siblings</option>
                          <option value="Church & Ministry">Church & Ministry</option>
                          <option value="Colleague / Friend">Colleague / Friend</option>
                          <option value="Well-Wisher">Well-Wisher</option>
                        </>
                      ) : (
                        <>
                          <option value="Enfants">Enfants</option>
                          <option value="Épouse">Épouse / Époux</option>
                          <option value="Petits-enfants">Petits-enfants</option>
                          <option value="Frères & Sœurs">Frères & Sœurs</option>
                          <option value="Église & Paroisse">Église & Paroisse</option>
                          <option value="Amis & Collègues">Amis & Collègues</option>
                          <option value="Proches & Famille">Proches & Famille</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      {isEn ? 'Your City / Country' : 'Votre Ville / Pays'}
                    </label>
                    <input
                      type="text"
                      placeholder={isEn ? 'e.g., Cotonou, Benin' : 'Ex: Cotonou, Bénin'}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-400"
                    >
                    </input>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {isEn ? 'Your Heartfelt Message *' : 'Votre Message de Condoléances *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={
                      isEn
                        ? 'Share a beloved memory, prayer, or tribute to celebrate Pa Peter’s glorious legacy...'
                        : 'Partagez un souvenir précieux, une prière ou des mots de réconfort pour honorer la mémoire de Papa...'
                    }
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
                    <Flame className={`w-3.5 h-3.5 ${theme.accentText} fill-current`} />
                    {isEn ? 'Light a virtual candle with this tribute' : 'Allumer une bougie virtuelle avec cet hommage'}
                  </span>
                </label>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold cursor-pointer"
                  >
                    {isEn ? 'Cancel' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Publish Tribute' : 'Publier l’Hommage'}</span>
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
