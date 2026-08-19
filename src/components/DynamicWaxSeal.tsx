import React from 'react';
import { ThemeColor } from '../types';
import { getThemeStyles } from '../utils/themeStyles';

interface DynamicWaxSealProps {
  age?: number;
  label?: string;
  language?: 'fr' | 'en';
  themeColor?: ThemeColor;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const DynamicWaxSeal: React.FC<DynamicWaxSealProps> = ({
  age = 71,
  label,
  language = 'fr',
  themeColor,
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  const isEn = language === 'en';
  const theme = getThemeStyles(themeColor);

  const displayAge = age || 71;
  const topText = isEn ? 'AGED' : 'ÂGÉ DE';
  const bottomText = isEn ? (displayAge > 1 ? 'YEARS' : 'YEAR') : (displayAge > 1 ? 'ANS' : 'AN');
  const badgeText = label || (isEn ? `AGED ${displayAge} YEARS` : `ÂGÉ DE ${displayAge} ANS`);

  const sizeClasses = {
    sm: {
      box: 'w-16 h-16 sm:w-20 sm:h-20',
      topText: 'text-[7px]',
      ageNum: 'text-xl sm:text-2xl',
      bottomText: 'text-[7px]',
      badge: 'text-[8px] px-2 py-0.5 -bottom-2',
    },
    md: {
      box: 'w-24 h-24 sm:w-28 sm:h-28',
      topText: 'text-[8px] sm:text-[9px]',
      ageNum: 'text-2xl sm:text-3xl',
      bottomText: 'text-[8px] sm:text-[9px]',
      badge: 'text-[9px] sm:text-[10px] px-2.5 py-0.5 -bottom-2.5',
    },
    lg: {
      box: 'w-28 h-28 sm:w-32 sm:h-32',
      topText: 'text-[10px] sm:text-[11px]',
      ageNum: 'text-3xl sm:text-4xl',
      bottomText: 'text-[10px] sm:text-[11px]',
      badge: 'text-[10px] px-3 py-1 -bottom-3',
    },
  }[size];

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D Embossed Metallic Wax Seal Medallion */}
      <div
        className={`relative ${sizeClasses.box} rounded-full p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.65),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.7)] bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 border border-amber-300/60 flex items-center justify-center transition-transform duration-300`}
        style={{
          boxShadow:
            '0 10px 30px rgba(0,0,0,0.75), inset 0 3px 6px rgba(255,235,160,0.7), inset 0 -4px 8px rgba(70,30,0,0.9)',
        }}
      >
        {/* Scalloped / Irregular organic wax seal rim */}
        <div className="absolute inset-0 rounded-full border-2 border-amber-900/40 opacity-70 pointer-events-none" />

        {/* Concentric beaded ring */}
        <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900/60 p-1 flex items-center justify-center bg-gradient-to-tr from-amber-700 via-amber-500 to-amber-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          {/* Inner Stamped Plate */}
          <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800 border border-amber-900/60 flex flex-col items-center justify-center text-amber-950 text-center leading-none p-1 shadow-[inset_0_3px_5px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.6)]">
            {/* Top Text (AGED / ÂGÉ DE) */}
            <span
              className={`${sizeClasses.topText} font-cinzel font-black tracking-widest uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] opacity-95`}
            >
              {topText}
            </span>

            {/* Center Age Value (e.g. 71, 54, 85) */}
            <span
              className={`${sizeClasses.ageNum} font-cinzel font-black tracking-tight text-amber-950 my-0.5 drop-shadow-[0_1px_1px_rgba(255,245,200,0.8)]`}
              style={{
                textShadow: '0 1px 1px rgba(255,255,255,0.6), 0 -1px 1px rgba(0,0,0,0.5)',
              }}
            >
              {displayAge}
            </span>

            {/* Bottom Text (YEARS / ANS) */}
            <span
              className={`${sizeClasses.bottomText} font-cinzel font-black tracking-widest uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] opacity-95`}
            >
              {bottomText}
            </span>
          </div>
        </div>
      </div>

      {/* Outer Pill Badge */}
      {showBadge && (
        <span
          className={`absolute ${sizeClasses.badge} bg-neutral-950 border ${theme.borderColor} rounded-full font-cinzel ${theme.accentText} uppercase tracking-widest font-bold shadow-lg whitespace-nowrap z-10`}
        >
          {badgeText}
        </span>
      )}
    </div>
  );
};
