import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ThemeColor } from '../types';
import { getThemeStyles } from '../utils/themeStyles';
import { DynamicWaxSeal } from './DynamicWaxSeal';

interface GuestWaxSealEnvelopeProps {
  guestName?: string | null;
  deceasedName: string;
  isCollective?: boolean;
  sealText?: string;
  sealLabel?: string;
  age?: number;
  portraitUrl?: string;
  bibleVerse?: string;
  themeColor?: ThemeColor;
  onOpen?: () => void;
  onOpenEnvelope?: () => void;
  language?: 'fr' | 'en';
}

export const GuestWaxSealEnvelope: React.FC<GuestWaxSealEnvelopeProps> = ({
  guestName,
  deceasedName,
  isCollective = false,
  sealText,
  sealLabel,
  age,
  bibleVerse,
  themeColor,
  onOpen,
  onOpenEnvelope,
  language = 'fr',
}) => {
  const isEn = language === 'en';
  const theme = getThemeStyles(themeColor);
  const [isOpening, setIsOpening] = useState(false);

  const displaySealText = sealLabel || sealText || (age ? (isEn ? `AGED ${age} YEARS` : `ÂGÉ DE ${age} ANS`) : '71 ANS');

  const handleBreakSeal = () => {
    setIsOpening(true);
    setTimeout(() => {
      if (onOpenEnvelope) {
        onOpenEnvelope();
      } else if (onOpen) {
        onOpen();
      }
    }, 1000);
  };

  const recipientGreeting = guestName || (isEn ? 'Madam / Sir' : 'Madame / Monsieur');

  return (
    <div className="fixed inset-0 z-40 bg-neutral-950 flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      {/* Heavenly ambient background with gentle glow */}
      <div className="absolute inset-0 bg-radial from-amber-950/30 via-neutral-950/80 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

      {/* Main Envelope Card Structure */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`relative w-full max-w-sm bg-gradient-to-b ${theme.cardGradient} border-2 ${theme.borderColor} rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-6 overflow-hidden`}
      >
        {/* Gold Trim Corner accents */}
        <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${theme.borderColor} rounded-tl-2xl`} />
        <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${theme.borderColor} rounded-tr-2xl`} />
        <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${theme.borderColor} rounded-bl-2xl`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${theme.borderColor} rounded-br-2xl`} />

        {/* Envelope Top Flap Simulation */}
        <div className="w-full pt-2 flex flex-col items-center space-y-1">
          <span className={`text-[10px] tracking-[0.25em] font-cinzel uppercase ${theme.accentText} font-bold`}>
            {isEn ? 'F U N E R A L   I N V I T A T I O N' : 'F A I R E - P A R T   D ’ O B S È Q U E S'}
          </span>
          <div className={`h-px w-28 bg-gradient-to-r from-transparent via-current ${theme.accentText} to-transparent`} />
        </div>

        {/* Guest Personalized Greeting Title */}
        <div className="space-y-1.5 z-10">
          <p className={`text-xs ${theme.accentLightText} font-serif italic`}>
            {isEn ? 'To the attention of' : 'À l’attention de'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide drop-shadow-sm">
            {recipientGreeting}
          </h2>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-black/40 border ${theme.borderColor} rounded-full text-[11px] ${theme.accentLightText} font-medium`}>
            <Sparkles className={`w-3.5 h-3.5 ${theme.accentText}`} />
            {isEn ? 'Solemn Funeral Announcement' : 'Faire-part & Invitation au Culte'}
          </span>
        </div>

        {/* The 3D Wax Seal with Breaking Animation */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Gentle pulsing aura */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className={`absolute -inset-4 ${theme.badgeBg} rounded-full blur-md`}
          />

          <motion.div
            animate={
              isOpening
                ? {
                    scale: [1, 1.3, 0],
                    rotate: [0, 15, -20],
                    opacity: [1, 1, 0],
                  }
                : {
                    scale: 1,
                  }
            }
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            onClick={handleBreakSeal}
            className="relative cursor-pointer group flex flex-col items-center"
          >
            <DynamicWaxSeal
              age={age}
              label={displaySealText}
              language={language}
              themeColor={themeColor}
              size="md"
              showBadge={true}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
        </div>

        {/* Memorial Preamble hint */}
        <div className="space-y-1 z-10 px-2">
          <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
            {isEn ? 'In loving memory of' : 'En hommage et mémoire éternelle de'}
          </p>
          <h3 className={`font-cinzel text-sm sm:text-base font-bold ${theme.accentText} tracking-wider`}>
            {deceasedName}
          </h3>
          <p className="text-[10px] text-neutral-300 font-serif italic">
            « {bibleVerse || (isEn ? 'I have fought the good fight, I have kept the faith.' : 'J’ai combattu le bon combat, j’ai gardé la foi.')} »
          </p>
        </div>

        {/* Interactive CTA to break the seal */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBreakSeal}
          disabled={isOpening}
          className={`w-full py-3.5 px-4 bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-cinzel cursor-pointer transition-all active:scale-95`}
        >
          {isOpening ? (
            <span className="animate-pulse">{isEn ? 'Opening the card...' : 'Ouverture de la carte...'}</span>
          ) : (
            <>
              <span>{isEn ? 'Break the seal & Enter' : 'Rompre le sceau & Entrer'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>

        <p className="text-[10px] text-neutral-500">
          {isEn
            ? 'Tap the seal or button to view the schedule and solemn order of service'
            : 'Touchez le sceau ou le bouton pour révéler le programme et le culte'}
        </p>
      </motion.div>
    </div>
  );
};

