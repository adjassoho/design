import React from 'react';
import { FuneralProfile, GuestItem } from '../types';
import { cloudsDefault } from '../data/defaultMemorial';
import {
  Calendar,
  MapPin,
  ChevronRight,
  BookOpen,
  Heart,
  Sparkles,
  Navigation,
  Flame,
  CheckCircle2,
  Shirt,
  Phone,
  Clock,
  Church,
} from 'lucide-react';
import { motion } from 'motion/react';
import { LiveCountdown } from './LiveCountdown';
import { LiveItineraryButton } from './LiveItineraryButton';
import { getThemeStyles } from '../utils/themeStyles';

interface ScreenProgramProps {
  memorial: FuneralProfile;
  activeGuest?: GuestItem | null;
  isCollective?: boolean;
  onNavigateTab: (tab: any) => void;
  onOpenRsvpModal?: () => void;
  onLightCandle?: () => void;
}

export const ScreenProgram: React.FC<ScreenProgramProps> = ({
  memorial,
  activeGuest,
  isCollective,
  onNavigateTab,
  onOpenRsvpModal,
  onLightCandle,
}) => {
  const isEn = memorial.language === 'en';
  const theme = getThemeStyles(memorial.themeColor);

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-x-hidden select-none bg-neutral-950 pb-6">
      {/* Background Heavenly Clouds & Radiant Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={memorial.backgroundUrl || cloudsDefault}
          alt="Celestial Clouds"
          className="w-full h-full object-cover object-top opacity-90 scale-105 filter brightness-105"
          referrerPolicy="no-referrer"
        />
        {/* Soft Golden Sunlight Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-neutral-950/90 pointer-events-none" />
      </div>

      {/* Guest Personalized Top Welcome Banner */}
      <div className={`relative z-20 mx-3 mt-2 px-3 py-1.5 bg-neutral-900/90 border ${theme.borderColor} rounded-xl shadow-lg flex items-center justify-between text-xs backdrop-blur-xs`}>
        <div className={`flex items-center gap-1.5 ${theme.accentLightText}`}>
          <Sparkles className={`w-3.5 h-3.5 ${theme.accentText}`} />
          <span className="font-serif italic">{isEn ? 'Welcome,' : 'Bienvenue,'}</span>
          <span className="font-bold text-white truncate max-w-[130px] sm:max-w-none">
            {activeGuest?.displayName || (isEn ? 'Madam / Sir' : 'Madame / Monsieur')}
          </span>
        </div>
        {activeGuest?.rsvpStatus === 'yes' ? (
          <span className="text-[10px] px-2 py-0.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-full font-bold">
            {isEn ? '✓ RSVP Confirmed' : '✓ Présence confirmée'}
          </span>
        ) : (
          <button
            onClick={onOpenRsvpModal}
            className={`text-[10px] px-2.5 py-1 bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold rounded-lg cursor-pointer transition-all active:scale-95 shadow-xs`}
          >
            {isEn ? 'Confirm RSVP' : 'Confirmer RSVP'}
          </button>
        )}
      </div>

      {/* Top Header Elements - Dignified, Centered & Fully Legible */}
      <header className="relative z-10 pt-3 px-4 flex flex-col items-center text-center">
        {/* Header Super Title */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`w-full text-center tracking-[0.35em] text-[11px] sm:text-[12px] font-cinzel font-semibold ${theme.accentLightText} uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mb-1`}
        >
          {memorial.headerSuperTitle || (isEn ? "H E A V E N ' S   G A I N" : "R E P O S   É T E R N E L")}
        </motion.div>

        {/* Main Headline Banner - Centered, Uncut & High Contrast */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="w-full text-center px-2"
        >
          <h1 className="font-cinzel text-xl sm:text-2xl font-black tracking-wide text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            {memorial.mainHeadline || (isEn ? 'TRANSITION TO GLORY' : 'TRANSITION VERS LA GLOIRE')}
          </h1>
        </motion.div>
      </header>

      {/* Center Section: Dignified Portrait without intrusive badge */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center mt-2 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="relative max-w-[340px] w-full flex justify-center"
        >
          {/* Portrait Image */}
          <div className={`relative rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.8)] border-2 ${theme.borderColor}`}>
            <img
              src={memorial.portraitUrl}
              alt={memorial.fullName}
              className="w-full max-h-[310px] object-cover object-top filter contrast-105"
              referrerPolicy="no-referrer"
            />
            {/* Ethereal bottom cloud blend */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Main Obsequies Card matching dynamic theme */}
      <div className="relative z-20 px-3 pb-3 -mt-4 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`relative bg-gradient-to-b ${theme.cardGradient} rounded-2xl p-4 sm:p-5 border ${theme.borderColor} shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden`}
        >
          {/* Inner Golden Hairline Frame */}
          <div className="absolute inset-1.5 border border-amber-400/30 rounded-xl pointer-events-none" />

          {/* Top Notch Decorative Arch */}
          <div className="text-center mb-3">
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-extrabold tracking-widest ${theme.titleGradient} drop-shadow uppercase`}>
              {isEn ? 'OBSEQUIES' : 'OBSÈQUES'}
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
              <div className={`font-cinzel font-bold ${theme.accentText} text-sm tracking-wider uppercase`}>
                {memorial.serviceOfSongs.title}
              </div>
              <div className="text-neutral-100 font-medium text-[12px] sm:text-xs">
                {memorial.serviceOfSongs.dateTime}
              </div>
              <div className="text-neutral-300 text-[11px]">
                {memorial.serviceOfSongs.venueName}
              </div>
            </div>

            {/* 2. Funeral Service */}
            <div className="space-y-0.5 pt-1">
              <div className={`font-cinzel font-bold ${theme.accentText} text-sm tracking-wider uppercase`}>
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
                <span>{memorial.officiatingChurch || memorial.funeralService.venueName}</span>
              </div>
            </div>

            {/* Reception Banner if configured */}
            {memorial.receptionDetail?.venue && (
              <div className="p-2.5 bg-black/40 border border-amber-500/30 rounded-xl text-left text-xs space-y-0.5">
                <span className="font-cinzel text-amber-300 font-bold uppercase text-[10px] tracking-wider block">
                  🍽️ {isEn ? 'Reception / Banquet' : 'Réception & Collation'}
                </span>
                <p className="text-neutral-200 font-semibold">{memorial.receptionDetail.venue}</p>
                <p className="text-[11px] text-neutral-400">
                  {memorial.receptionDetail.time} — {memorial.receptionDetail.note}
                </p>
              </div>
            )}

            {/* Dress Code Badge if provided */}
            {memorial.dressCode && (
              <div className="py-1 px-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl inline-flex items-center gap-1.5 text-[11px] text-neutral-300 mx-auto">
                <Shirt className="w-3 h-3 text-amber-400" />
                <span>{isEn ? 'Dress Code:' : 'Tenue recommandée :'} <strong className="text-white">{memorial.dressCode}</strong></span>
              </div>
            )}

            {/* Prominent Name & Lifespan Typography */}
            <div className="pt-2 text-right pr-2">
              <h3 className="font-cormorant italic text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">
                {memorial.fullName}
              </h3>
              <p className={`font-montserrat text-xs tracking-widest ${theme.accentLightText} font-semibold mt-1`}>
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
          <div className={`mt-4 pt-3 border-t ${theme.borderColor} grid grid-cols-2 gap-2`}>
            <button
              onClick={() => onNavigateTab('order-of-service')}
              className={`py-2 px-3 rounded-xl ${theme.secondaryBtn} text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isEn ? 'Order of Service' : 'Ordre du Culte'}</span>
            </button>
            <button
              onClick={onOpenRsvpModal || onLightCandle}
              className={`py-2 px-3 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95`}
            >
              <Flame className="w-3.5 h-3.5 fill-current text-neutral-950" />
              <span>{isEn ? 'RSVP & Condolences' : 'RSVP & Condoléances'}</span>
            </button>
          </div>
        </motion.div>

        {/* Live Countdown to Funeral Service */}
        <LiveCountdown
          targetDateString={memorial.funeralService.isoDateTime || memorial.funeralService.dateTime}
          targetTitle={memorial.funeralService.title}
          themeColor={memorial.themeColor}
          language={memorial.language || 'fr'}
        />

        {/* GPS Itinerary Direct Action */}
        <LiveItineraryButton
          venueName={memorial.funeralService.venueName}
          venueAddress={memorial.funeralService.address}
          destinationLat={memorial.venueLat}
          destinationLng={memorial.venueLng}
          themeColor={memorial.themeColor}
          language={memorial.language || 'fr'}
        />
      </div>
    </div>
  );
};

