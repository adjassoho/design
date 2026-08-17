import React from 'react';
import { MemorialProfile } from '../types';
import { waxSealDefault } from '../data/defaultMemorial';
import { Calendar, MapPin, ChevronRight, BookOpen, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ScreenProgramProps {
  memorial: MemorialProfile;
  onNavigateTab: (tab: any) => void;
  onLightCandle?: () => void;
}

export const ScreenProgram: React.FC<ScreenProgramProps> = ({
  memorial,
  onNavigateTab,
  onLightCandle,
}) => {
  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between overflow-y-auto overflow-x-hidden select-none bg-neutral-950">
      {/* Background Heavenly Clouds & Radiant Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={memorial.backgroundUrl}
          alt="Celestial Clouds"
          className="w-full h-full object-cover object-top opacity-85 scale-105 filter brightness-105"
          referrerPolicy="no-referrer"
        />
        {/* Soft Golden Sunlight Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/30 via-transparent to-neutral-950/80 pointer-events-none" />
      </div>

      {/* Top Header Elements */}
      <header className="relative z-10 pt-2 px-6 flex flex-col items-center">
        {/* "H E A V E N ' S   G A I N" */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full text-center tracking-[0.45em] text-[13px] sm:text-[14px] font-cinzel font-semibold text-amber-900/90 uppercase drop-shadow-sm mb-1"
        >
          {memorial.headerSuperTitle}
        </motion.div>

        {/* "TRANSITION TO GLORY" Logo Banner on Top Right */}
        <div className="w-full flex justify-end pr-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex flex-col items-end"
          >
            <div className="flex items-center space-x-1">
              <span className="font-cinzel text-xl sm:text-2xl font-black tracking-tight text-[#6D1B28] leading-none">
                TRANSITION
              </span>
              {/* Circular "TO" medallion */}
              <span className="w-5 h-5 rounded-full bg-gradient-to-b from-amber-600 to-amber-800 text-[9px] font-bold text-amber-100 flex items-center justify-center shadow-sm">
                TO
              </span>
            </div>
            <span className="font-cinzel text-2xl sm:text-3xl font-black tracking-wide text-[#6D1B28] -mt-1 leading-none">
              GLORY
            </span>
          </motion.div>
        </div>
      </header>

      {/* Center Section: Dignified Portrait with Cloud Mist */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-4 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative max-w-[340px] w-full flex justify-center"
        >
          {/* Portrait Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={memorial.portraitUrl}
              alt={memorial.fullName}
              className="w-full max-h-[320px] object-cover object-top filter contrast-105"
              referrerPolicy="no-referrer"
            />
            {/* Ethereal bottom cloud blend */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
          </div>

          {/* Gold Wax Seal Badge ("AGED 71 YEARS") */}
          <motion.button
            whileHover={{ scale: 1.06, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateTab('biography')}
            title="Click to view Life Milestones"
            className="absolute -right-3 sm:-right-4 top-[62%] -translate-y-1/2 z-20 focus:outline-hidden"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
              {/* Wax Seal Image or Custom Gold Seal */}
              <img
                src={waxSealDefault}
                alt={memorial.sealLabel}
                className="w-full h-full object-contain filter drop-shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                <span className="text-[7px] sm:text-[8px] tracking-wider text-amber-950 font-bold font-montserrat uppercase">
                  AGED
                </span>
                <span className="text-xl sm:text-2xl font-cinzel font-black text-amber-950 leading-none my-0.5">
                  {memorial.age}
                </span>
                <span className="text-[7px] sm:text-[8px] tracking-wider text-amber-950 font-bold font-montserrat uppercase">
                  YEARS
                </span>
              </div>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Main Dark Onyx Obsequies Card matching Image 1 */}
      <div className="relative z-20 px-3 pb-3 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative bg-[#141619] rounded-2xl p-4 sm:p-5 border border-amber-500/50 shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Inner Golden Hairline Frame */}
          <div className="absolute inset-1.5 border border-amber-400/30 rounded-xl pointer-events-none" />

          {/* Top Notch Decorative Arch */}
          <div className="text-center mb-3">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-widest text-gold-gradient drop-shadow uppercase">
              OBSEQUIES
            </h2>
            {/* Elegant curved gold divider */}
            <div className="flex items-center justify-center space-x-2 mt-0.5">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-amber-400"></div>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400"></div>
            </div>
          </div>

          {/* Program Schedule Details */}
          <div className="space-y-3.5 text-center text-xs sm:text-sm font-sans-custom relative z-10">
            {/* 1. Service of Songs */}
            <div className="space-y-0.5">
              <div className="font-cinzel font-bold text-amber-300 text-sm tracking-wider uppercase">
                {memorial.serviceOfSongs.title}
              </div>
              <div className="text-neutral-100 font-medium text-[12px] sm:text-xs">
                {memorial.serviceOfSongs.dateTime}
              </div>
            </div>

            {/* 2. Funeral Service */}
            <div className="space-y-0.5 pt-1">
              <div className="font-cinzel font-bold text-amber-300 text-sm tracking-wider uppercase">
                {memorial.funeralService.title}
              </div>
              <div className="text-neutral-100 font-medium text-[12px] sm:text-xs leading-relaxed">
                {memorial.funeralService.dateTime}
                <br />
                {memorial.funeralService.lyingInState}
                <br />
                {memorial.funeralService.serviceStartTime}
              </div>
              <div className="text-amber-200/90 text-[11px] sm:text-xs mt-1 font-normal flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{memorial.officiatingChurch}</span>
              </div>
            </div>

            {/* Prominent Name & Lifespan Typography */}
            <div className="pt-2 text-right pr-2">
              <h3 className="font-cormorant italic text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">
                {memorial.fullName}
              </h3>
              <p className="font-montserrat text-xs tracking-widest text-amber-400 font-semibold mt-1">
                {memorial.birthYear} — {memorial.passingYear}
              </p>
            </div>

            {/* Private Interment Note */}
            <div className="pt-2 text-center">
              <p className="font-cormorant italic text-xs text-neutral-400">
                {memorial.intermentNote}
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Bars */}
          <div className="mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigateTab('order-of-service')}
              className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Order of Service</span>
            </button>
            <button
              onClick={() => onNavigateTab('tributes')}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Light a Candle</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
