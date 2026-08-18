import React, { useState } from 'react';
import { FuneralProfile } from '../types';
import { waxSealDefault } from '../data/defaultMemorial';
import { ChevronLeft, Share2, RotateCw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { getThemeStyles } from '../utils/themeStyles';

interface ScreenMemorialCardProps {
  memorial: FuneralProfile;
  onBack: () => void;
  onShare?: () => void;
  isGuestMode?: boolean;
}

export const ScreenMemorialCard: React.FC<ScreenMemorialCardProps> = ({
  memorial,
  onBack,
  onShare,
  isGuestMode = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isEn = memorial.language === 'en';
  const theme = getThemeStyles(memorial.themeColor);

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-x-hidden select-none bg-neutral-950 pb-6">
      {/* Background Heavenly Clouds */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={memorial.backgroundUrl}
          alt="Celestial Clouds"
          className="w-full h-full object-cover object-top opacity-85 filter brightness-105"
          referrerPolicy="no-referrer"
        />
        {/* Soft Theme Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/20 via-transparent to-neutral-950/70" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 pt-2 px-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-neutral-900 font-bold text-xs sm:text-sm hover:text-amber-900 transition-colors py-1 px-2.5 rounded-lg bg-amber-100/90 backdrop-blur-xs shadow-xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span className="font-sans-custom font-semibold">{isEn ? 'Program' : 'Programme'}</span>
        </button>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="p-1.5 px-2.5 rounded-lg bg-white/90 backdrop-blur-xs text-neutral-900 hover:bg-white transition-all shadow-xs flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title={isEn ? 'Flip to view scripture' : 'Retourner pour lire le verset'}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Scripture' : 'Verset'}</span>
          </button>

          {/* Share button ONLY visible for organizer, hidden for guest */}
          {!isGuestMode && onShare && (
            <button
              onClick={onShare}
              className={`p-1.5 px-2.5 rounded-lg bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold hover:brightness-110 transition-all shadow-xs flex items-center gap-1 text-xs cursor-pointer`}
              title="Partager le faire-part"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Share' : 'Partager'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center p-3 gap-3">
        {/* Left Side Portrait */}
        <div className="relative w-full max-w-[280px] md:max-w-[320px] flex justify-center items-end">
          <div className={`relative rounded-2xl overflow-hidden shadow-2xl border ${theme.borderColor}`}>
            <img
              src={memorial.portraitUrl}
              alt={memorial.fullName}
              className="w-full max-h-[380px] object-cover object-top filter contrast-105"
              referrerPolicy="no-referrer"
            />
            {/* Ethereal bottom cloud smoke blend */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Side Regal Card with Dynamic Theme Palette */}
        <motion.div
          key={isFlipped ? 'verse' : 'front'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative w-full max-w-[360px] bg-gradient-to-b ${theme.cardGradient} text-amber-100 rounded-3xl p-5 sm:p-6 border-2 ${theme.borderColor} shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden`}
        >
          {/* Subtle Inner Border */}
          <div className="absolute inset-1.5 border border-amber-300/30 rounded-2xl pointer-events-none" />

          {!isFlipped ? (
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              {/* Header super title */}
              <div className={`tracking-[0.45em] text-[11px] sm:text-xs font-cinzel font-semibold ${theme.accentLightText} uppercase`}>
                {memorial.headerSuperTitle || (isEn ? "H E A V E N ' S   G A I N" : "R E P O S   É T E R N E L")}
              </div>

              {/* Headline announcement */}
              <div className="flex flex-col items-center text-center">
                <span className={`font-cinzel text-xl sm:text-2xl font-black tracking-tight ${theme.titleGradient} leading-none`}>
                  {memorial.mainHeadline || (isEn ? 'TRANSITION TO GLORY' : 'TRANSITION VERS LA GLOIRE')}
                </span>
              </div>

              {/* Preamble */}
              <p className="text-[11px] sm:text-xs text-neutral-200 leading-relaxed font-sans-custom px-2">
                {memorial.transitionPreamble}
              </p>

              {/* Prominent Name & Lifetime */}
              <div className="pt-1">
                {memorial.honorific && (
                  <p className={`text-[10px] uppercase tracking-widest ${theme.accentText} font-mono font-bold`}>
                    {memorial.honorific}
                  </p>
                )}
                <h2 className="font-cormorant text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  {memorial.fullName}
                </h2>
                <p className={`font-montserrat text-xs tracking-widest ${theme.accentLightText} font-semibold mt-0.5`}>
                  {memorial.birthYear} — {memorial.passingYear}
                </p>
              </div>

              {/* Gold Wax Seal Badge */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 my-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                <img
                  src={waxSealDefault}
                  alt={memorial.sealLabel}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-[6px] tracking-wider text-amber-950 font-bold font-montserrat uppercase">
                    {isEn ? 'AGED' : 'ÂGÉ DE'}
                  </span>
                  <span className="text-base sm:text-xl font-cinzel font-black text-amber-950 leading-none">
                    {memorial.age}
                  </span>
                  <span className="text-[6px] tracking-wider text-amber-950 font-bold font-montserrat uppercase">
                    {isEn ? 'YEARS' : 'ANS'}
                  </span>
                </div>
              </div>

              {/* OBSEQUIES Section */}
              <div className={`w-full space-y-2 text-center pt-1 border-t ${theme.borderColor}`}>
                <h3 className={`font-cinzel text-lg font-bold tracking-widest ${theme.titleGradient} uppercase`}>
                  {isEn ? 'OBSEQUIES' : 'OBSÈQUES'}
                </h3>

                {/* Service of Songs */}
                <div className="space-y-0.5">
                  <div className={`font-cinzel text-xs font-bold ${theme.accentText} tracking-wider uppercase`}>
                    {memorial.serviceOfSongs.title}
                  </div>
                  <div className="text-[11px] text-neutral-100">
                    {memorial.serviceOfSongs.dateTime}
                  </div>
                  <div className={`text-[10px] ${theme.accentLightText}`}>
                    {memorial.serviceOfSongs.venueName}
                  </div>
                </div>

                {/* FAREWELL / FUNERAL SERVICE */}
                <div className="space-y-0.5 pt-1">
                  <div className={`font-cinzel text-xs font-bold ${theme.accentText} tracking-wider uppercase`}>
                    {memorial.funeralService.title}
                  </div>
                  <div className="text-[11px] text-neutral-100 leading-tight">
                    {memorial.funeralService.dateTime}
                    <br />
                    {memorial.funeralService.lyingInState}
                    <br />
                    {memorial.funeralService.serviceStartTime}
                  </div>
                  <div className={`text-[10px] ${theme.accentLightText}`}>
                    {memorial.funeralService.venueName}
                  </div>
                </div>

                {/* Footer interment */}
                <p className="font-cormorant italic text-[11px] text-neutral-400 pt-1">
                  {memorial.intermentNote}
                </p>
              </div>
            </div>
          ) : (
            /* Flipped Side: Memorial Scripture & Family Benediction */
            <div className="relative z-10 flex flex-col items-center text-center space-y-4 py-4">
              <div className={`w-10 h-10 rounded-full bg-neutral-900 border ${theme.borderColor} flex items-center justify-center`}>
                <Sparkles className={`w-5 h-5 ${theme.accentText}`} />
              </div>

              <h3 className={`font-cinzel text-lg font-bold ${theme.titleGradient} uppercase`}>
                {isEn ? 'Scripture of Hope' : 'Verset d’Espérance'}
              </h3>

              <blockquote className={`font-cormorant italic text-base sm:text-lg text-neutral-100 leading-relaxed px-2 border-y ${theme.borderColor} py-3`}>
                « {memorial.bibleVerse} »
              </blockquote>

              <p className={`font-cinzel text-xs tracking-widest ${theme.accentText} font-bold`}>
                — {memorial.verseReference}
              </p>

              <div className="pt-3 text-xs text-neutral-300 space-y-1">
                <p className={`font-semibold ${theme.accentLightText}`}>
                  {isEn ? 'The Bereaved Family & Relatives' : 'La Famille éplorée & les Proches'}
                </p>
                <p className="text-[11px] text-neutral-400">
                  {isEn
                    ? 'Gratefully acknowledge all prayers, visits, and support during this season.'
                    : 'Vous remercient sincèrement pour vos prières, vos visites et votre précieux soutien.'}
                </p>
              </div>

              <button
                onClick={() => setIsFlipped(false)}
                className={`mt-3 px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border ${theme.borderColor} ${theme.accentLightText} text-xs font-semibold cursor-pointer`}
              >
                {isEn ? 'Back to Memorial Card' : 'Retour au Faire-part'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

