import { ThemeColor } from '../types';

export interface ThemePalette {
  id: ThemeColor;
  name: string;
  // Core Text Accents
  accentText: string; // e.g. text-amber-400
  accentLightText: string; // e.g. text-amber-200
  accentDarkText: string; // e.g. text-amber-500
  // Backgrounds & Surfaces
  cardGradient: string;
  pageHeaderGradient: string;
  sectionBg: string;
  badgeBg: string;
  pillBg: string;
  // Borders & Outlines
  borderColor: string;
  borderColorLight: string;
  ringColor: string;
  // Buttons & Controls
  buttonGradient: string;
  secondaryBtn: string;
  // Titles & Typography
  titleGradient: string;
  headerTextColor: string;
  // Wax seal styling
  sealBg: string;
  sealBorder: string;
  sealText: string;
  sealDot: string;
  glowColor: string;
  // Navigation active tab indicator
  navActiveBg: string;
  navActiveText: string;
  navActiveBorder: string;
}

export const getThemeStyles = (theme?: ThemeColor | string): ThemePalette => {
  switch (theme) {
    case 'burgundy':
      return {
        id: 'burgundy',
        name: 'Pourpre Royal & Bordeau Doré',
        accentText: 'text-rose-400',
        accentLightText: 'text-rose-200',
        accentDarkText: 'text-rose-500',
        cardGradient: 'from-[#4A0E18] via-[#2A070E] to-[#140306]',
        pageHeaderGradient: 'from-rose-950/80 via-neutral-950 to-neutral-900',
        sectionBg: 'bg-rose-950/30',
        badgeBg: 'bg-rose-950/80 text-rose-200 border-rose-500/40',
        pillBg: 'bg-rose-950/80 border-rose-800/60 text-rose-200',
        borderColor: 'border-rose-500/50',
        borderColorLight: 'border-rose-400/60',
        ringColor: 'ring-rose-400',
        buttonGradient: 'bg-gradient-to-r from-rose-700 via-rose-600 to-amber-500 hover:from-rose-600 text-white',
        secondaryBtn: 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-500/30',
        titleGradient: 'bg-gradient-to-r from-rose-200 via-amber-200 to-rose-300 bg-clip-text text-transparent',
        headerTextColor: 'text-rose-100',
        sealBg: 'bg-gradient-to-br from-rose-700 via-rose-900 to-rose-950',
        sealBorder: 'border-rose-400/60',
        sealText: 'text-amber-200',
        sealDot: 'bg-rose-400',
        glowColor: 'rgba(225, 29, 72, 0.4)',
        navActiveBg: 'bg-rose-950/80',
        navActiveText: 'text-rose-300',
        navActiveBorder: 'border-rose-400',
      };

    case 'onyx':
      return {
        id: 'onyx',
        name: 'Onyx Noir & Argent Pur',
        accentText: 'text-zinc-200',
        accentLightText: 'text-white',
        accentDarkText: 'text-zinc-400',
        cardGradient: 'from-[#222226] via-[#151518] to-[#0a0a0c]',
        pageHeaderGradient: 'from-zinc-900/90 via-neutral-950 to-black',
        sectionBg: 'bg-zinc-900/40',
        badgeBg: 'bg-zinc-800/90 text-zinc-100 border-zinc-500/40',
        pillBg: 'bg-zinc-900/90 border-zinc-700 text-zinc-200',
        borderColor: 'border-zinc-500/50',
        borderColorLight: 'border-zinc-400/60',
        ringColor: 'ring-zinc-300',
        buttonGradient: 'bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-100 hover:from-white text-neutral-950 font-bold',
        secondaryBtn: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600/40',
        titleGradient: 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent',
        headerTextColor: 'text-zinc-100',
        sealBg: 'bg-gradient-to-br from-zinc-700 via-zinc-900 to-black',
        sealBorder: 'border-zinc-400/60',
        sealText: 'text-zinc-100',
        sealDot: 'bg-zinc-300',
        glowColor: 'rgba(226, 232, 240, 0.3)',
        navActiveBg: 'bg-zinc-800/80',
        navActiveText: 'text-zinc-100',
        navActiveBorder: 'border-zinc-300',
      };

    case 'royal-blue':
      return {
        id: 'royal-blue',
        name: 'Bleu Nuit Céleste & Étoiles',
        accentText: 'text-sky-400',
        accentLightText: 'text-sky-200',
        accentDarkText: 'text-sky-500',
        cardGradient: 'from-[#0e2340] via-[#081528] to-[#040c17]',
        pageHeaderGradient: 'from-sky-950/80 via-indigo-950/50 to-neutral-950',
        sectionBg: 'bg-sky-950/30',
        badgeBg: 'bg-blue-950/90 text-sky-200 border-sky-400/40',
        pillBg: 'bg-blue-950/80 border-sky-800 text-sky-200',
        borderColor: 'border-sky-500/50',
        borderColorLight: 'border-sky-400/60',
        ringColor: 'ring-sky-400',
        buttonGradient: 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 text-white font-bold',
        secondaryBtn: 'bg-sky-950/60 hover:bg-sky-900/80 text-sky-200 border border-sky-500/30',
        titleGradient: 'bg-gradient-to-r from-sky-200 via-blue-100 to-sky-300 bg-clip-text text-transparent',
        headerTextColor: 'text-sky-100',
        sealBg: 'bg-gradient-to-br from-sky-600 via-blue-900 to-indigo-950',
        sealBorder: 'border-sky-400/60',
        sealText: 'text-sky-100',
        sealDot: 'bg-sky-400',
        glowColor: 'rgba(56, 189, 248, 0.4)',
        navActiveBg: 'bg-sky-950/80',
        navActiveText: 'text-sky-300',
        navActiveBorder: 'border-sky-400',
      };

    case 'emerald':
      return {
        id: 'emerald',
        name: 'Vert Émeraude & Espérance',
        accentText: 'text-emerald-400',
        accentLightText: 'text-emerald-200',
        accentDarkText: 'text-emerald-500',
        cardGradient: 'from-[#082a20] via-[#041913] to-[#020d0a]',
        pageHeaderGradient: 'from-emerald-950/80 via-neutral-950 to-neutral-900',
        sectionBg: 'bg-emerald-950/30',
        badgeBg: 'bg-emerald-950/90 text-emerald-200 border-emerald-400/40',
        pillBg: 'bg-emerald-950/80 border-emerald-800 text-emerald-200',
        borderColor: 'border-emerald-500/50',
        borderColorLight: 'border-emerald-400/60',
        ringColor: 'ring-emerald-400',
        buttonGradient: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 text-neutral-950 font-bold',
        secondaryBtn: 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-500/30',
        titleGradient: 'bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-300 bg-clip-text text-transparent',
        headerTextColor: 'text-emerald-100',
        sealBg: 'bg-gradient-to-br from-emerald-600 via-emerald-900 to-emerald-950',
        sealBorder: 'border-emerald-400/60',
        sealText: 'text-emerald-100',
        sealDot: 'bg-emerald-400',
        glowColor: 'rgba(16, 185, 129, 0.4)',
        navActiveBg: 'bg-emerald-950/80',
        navActiveText: 'text-emerald-300',
        navActiveBorder: 'border-emerald-400',
      };

    case 'imperial-gold':
    default:
      return {
        id: 'imperial-gold',
        name: 'Or Impérial & Sacré',
        accentText: 'text-amber-400',
        accentLightText: 'text-amber-200',
        accentDarkText: 'text-amber-500',
        cardGradient: 'from-[#382b06] via-[#241c04] to-[#120d01]',
        pageHeaderGradient: 'from-amber-950/80 via-neutral-950 to-neutral-900',
        sectionBg: 'bg-amber-950/30',
        badgeBg: 'bg-amber-950/90 text-amber-200 border-amber-400/50',
        pillBg: 'bg-amber-950/80 border-amber-700 text-amber-200',
        borderColor: 'border-amber-400/50',
        borderColorLight: 'border-amber-300/60',
        ringColor: 'ring-amber-400',
        buttonGradient: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 text-neutral-950 font-bold',
        secondaryBtn: 'bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-500/30',
        titleGradient: 'bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300 bg-clip-text text-transparent',
        headerTextColor: 'text-amber-100',
        sealBg: 'bg-gradient-to-br from-amber-600 via-amber-800 to-amber-950',
        sealBorder: 'border-amber-400/60',
        sealText: 'text-amber-950',
        sealDot: 'bg-amber-400',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        navActiveBg: 'bg-amber-950/80',
        navActiveText: 'text-amber-300',
        navActiveBorder: 'border-amber-400',
      };
  }
};

