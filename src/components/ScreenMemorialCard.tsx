import React, { useState } from 'react';
import { MemorialProfile } from '../types';
import { waxSealDefault } from '../data/defaultMemorial';
import { ChevronLeft, Share2, Download, RotateCw, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ScreenMemorialCardProps {
  memorial: MemorialProfile;
  onBack: () => void;
  onShare: () => void;
}

export const ScreenMemorialCard: React.FC<ScreenMemorialCardProps> = ({
  memorial,
  onBack,
  onShare,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between overflow-y-auto overflow-x-hidden select-none bg-neutral-950">
      {/* Background Heavenly Clouds */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={memorial.backgroundUrl}
          alt="Celestial Clouds"
          className="w-full h-full object-cover object-top opacity-85 filter brightness-105"
          referrerPolicy="no-referrer"
        />
        {/* Soft Golden Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/20 via-transparent to-neutral-950/70" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 pt-2 px-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-[#6D1B28] font-bold text-sm sm:text-base hover:text-amber-900 transition-colors py-1 px-2 rounded-lg bg-amber-100/60 backdrop-blur-xs shadow-xs"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          <span className="font-sans-custom font-semibold">Memorial</span>
        </button>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="p-1.5 rounded-lg bg-white/70 backdrop-blur-xs text-[#6D1B28] hover:bg-white transition-all shadow-xs flex items-center gap-1 text-xs font-semibold"
            title="Flip to view memorial scripture"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flip Verse</span>
          </button>
          <button
            onClick={onShare}
            className="p-1.5 rounded-lg bg-[#6D1B28] text-amber-100 hover:bg-[#852333] transition-all shadow-xs flex items-center gap-1 text-xs font-semibold"
            title="Share Memorial Card"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center p-3 gap-3">
        {/* Left Side Portrait (Prominent in Image 2) */}
        <div className="relative w-full max-w-[280px] md:max-w-[320px] flex justify-center items-end">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
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

        {/* Right Side Regal Burgundy / Maroon Card */}
        <motion.div
          key={isFlipped ? 'verse' : 'front'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-[360px] bg-gradient-to-b from-[#4A0E18] via-[#350A11] to-[#20050A] text-amber-100 rounded-3xl p-5 sm:p-6 border-2 border-amber-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Subtle Golden Inner Border */}
          <div className="absolute inset-1.5 border border-amber-300/30 rounded-2xl pointer-events-none" />

          {!isFlipped ? (
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              {/* "H E A V E N ' S   G A I N" */}
              <div className="tracking-[0.45em] text-[11px] sm:text-xs font-cinzel font-semibold text-amber-200/90 uppercase">
                {memorial.headerSuperTitle}
              </div>

              {/* "TRANSITION TO GLORY" */}
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <span className="font-cinzel text-xl sm:text-2xl font-black tracking-tight text-gold-gradient leading-none">
                    TRANSITION
                  </span>
                  <span className="w-5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-amber-700 text-[9px] font-bold text-neutral-950 flex items-center justify-center shadow-xs">
                    TO
                  </span>
                </div>
                <span className="font-cinzel text-2xl sm:text-3xl font-black tracking-wider text-gold-gradient -mt-1 leading-none">
                  GLORY
                </span>
              </div>

              {/* Preamble */}
              <p className="text-[11px] sm:text-xs text-neutral-200 leading-relaxed font-sans-custom px-2">
                {memorial.transitionPreamble}
              </p>

              {/* Prominent Name */}
              <div className="pt-1">
                <h2 className="font-cormorant text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  {memorial.fullName}
                </h2>
                <p className="font-montserrat text-xs tracking-widest text-amber-300 font-semibold mt-0.5">
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
                    AGED
                  </span>
                  <span className="text-base sm:text-xl font-cinzel font-black text-amber-950 leading-none">
                    {memorial.age}
                  </span>
                  <span className="text-[6px] tracking-wider text-amber-950 font-bold font-montserrat uppercase">
                    YEARS
                  </span>
                </div>
              </div>

              {/* OBSEQUIES Section */}
              <div className="w-full space-y-2 text-center pt-1 border-t border-amber-500/20">
                <h3 className="font-cinzel text-lg font-bold tracking-widest text-gold-gradient uppercase">
                  OBSEQUIES
                </h3>

                {/* Service of Songs */}
                <div className="space-y-0.5">
                  <div className="font-cinzel text-xs font-bold text-amber-300 tracking-wider uppercase">
                    {memorial.serviceOfSongs.title}
                  </div>
                  <div className="text-[11px] text-neutral-100">
                    {memorial.serviceOfSongs.dateTime}
                  </div>
                  <div className="text-[10px] text-amber-200/80">
                    {memorial.serviceOfSongs.venueName}, {memorial.serviceOfSongs.address}
                  </div>
                </div>

                {/* FAREWELL / FUNERAL SERVICE */}
                <div className="space-y-0.5 pt-1">
                  <div className="font-cinzel text-xs font-bold text-amber-300 tracking-wider uppercase">
                    FAREWELL
                  </div>
                  <div className="text-[11px] text-neutral-100 leading-tight">
                    {memorial.funeralService.dateTime}
                    <br />
                    {memorial.funeralService.lyingInState}
                    <br />
                    {memorial.funeralService.serviceStartTime}
                  </div>
                  <div className="text-[10px] text-amber-200/80">
                    {memorial.funeralService.venueName}, {memorial.funeralService.address}
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
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>

              <h3 className="font-cinzel text-lg font-bold text-gold-gradient uppercase">
                Scripture of Hope
              </h3>

              <blockquote className="font-cormorant italic text-base sm:text-lg text-neutral-100 leading-relaxed px-2 border-y border-amber-400/20 py-3">
                “I have fought a good fight, I have finished my course, I have kept the faith: Henceforth there is laid up for me a crown of righteousness, which the Lord, the righteous judge, shall give me at that day.”
              </blockquote>

              <p className="font-cinzel text-xs tracking-widest text-amber-300 font-bold">
                — 2 TIMOTHY 4:7-8
              </p>

              <div className="pt-3 text-xs text-neutral-300 space-y-1">
                <p className="font-semibold text-amber-200">The Oyenuga & Extended Families</p>
                <p className="text-[11px] text-neutral-400">
                  Gratefully acknowledge all prayers, visits, and support during this season of celebration.
                </p>
              </div>

              <button
                onClick={() => setIsFlipped(false)}
                className="mt-3 px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-200 text-xs font-semibold"
              >
                Back to Memorial Card
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom helper */}
      <div className="relative z-20 pb-3 px-4 text-center">
        <span className="text-[11px] text-neutral-400">
          Tip: Click <span className="text-amber-300 font-semibold">Share</span> to copy dynamic embed links or download this card.
        </span>
      </div>
    </div>
  );
};
