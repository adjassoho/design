import { ThemeColor } from '../types';

export interface ThemeConfig {
  id: ThemeColor;
  label: string;
  sublabel: string;
  // Colors
  primaryHex: string;
  secondaryHex: string;
  // Tailwind Text Classes
  textAccent: string; // e.g. text-amber-400
  textAccentLight: string; // e.g. text-amber-200
  textAccentDark: string; // e.g. text-amber-500
  // Tailwind Background & Surface Classes
  bgAccentSoft: string; // e.g. bg-amber-500/15
  bgAccentMedium: string; // e.g. bg-amber-500/25
  bgAccentSolid: string; // e.g. bg-amber-500
  bgHeroGradient: string; // Background gradient for main screens
  bgCardGradient: string; // Subtle card background tint
  // Tailwind Border & Ring Classes
  borderAccent: string; // e.g. border-amber-400/40
  borderAccentLight: string; // e.g. border-amber-300/60
  ringAccent: string; // e.g. ring-amber-400
  // Tailwind Button Classes
  btnPrimaryGradient: string; // e.g. bg-gradient-to-r from-amber-600 to-amber-500 text-neutral-950
  btnSecondary: string;
  // Wax seal styling
  sealHex: string;
  sealGradient: string;
  // Glow & Box Shadow
  glowAccent: string;
}

export const THEME_CONFIGS: Record<ThemeColor, ThemeConfig> = {
  'imperial-gold': {
    id: 'imperial-gold',
    label: 'Or Impérial',
    sublabel: 'Lumière, triomphe et sainteté céleste',
    primaryHex: '#f59e0b',
    secondaryHex: '#d97706',
    textAccent: 'text-amber-400',
    textAccentLight: 'text-amber-200',
    textAccentDark: 'text-amber-500',
    bgAccentSoft: 'bg-amber-500/15',
    bgAccentMedium: 'bg-amber-500/25',
    bgAccentSolid: 'bg-amber-500',
    bgHeroGradient: 'from-amber-950/60 via-neutral-950 to-neutral-900',
    bgCardGradient: 'from-amber-950/30 via-neutral-900/90 to-neutral-950',
    borderAccent: 'border-amber-400/40',
    borderAccentLight: 'border-amber-300/60',
    ringAccent: 'ring-amber-400',
    btnPrimaryGradient: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-neutral-950',
    btnSecondary: 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-400/30',
    sealHex: '#b45309',
    sealGradient: 'radial-gradient(circle at 35% 35%, #f59e0b 0%, #b45309 60%, #78350f 100%)',
    glowAccent: 'rgba(245, 158, 11, 0.35)',
  },
  burgundy: {
    id: 'burgundy',
    label: 'Pourpre Royal & Bordeau Doré',
    sublabel: 'Solennité, noblesse et transition éternelle',
    primaryHex: '#e11d48',
    secondaryHex: '#9f1239',
    textAccent: 'text-rose-400',
    textAccentLight: 'text-rose-200',
    textAccentDark: 'text-rose-500',
    bgAccentSoft: 'bg-rose-500/15',
    bgAccentMedium: 'bg-rose-500/25',
    bgAccentSolid: 'bg-rose-600',
    bgHeroGradient: 'from-rose-950/70 via-neutral-950 to-neutral-900',
    bgCardGradient: 'from-rose-950/35 via-neutral-900/90 to-neutral-950',
    borderAccent: 'border-rose-400/40',
    borderAccentLight: 'border-rose-300/60',
    ringAccent: 'ring-rose-400',
    btnPrimaryGradient: 'bg-gradient-to-r from-rose-700 via-rose-600 to-amber-500 hover:from-rose-600 text-white',
    btnSecondary: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-400/30',
    sealHex: '#881337',
    sealGradient: 'radial-gradient(circle at 35% 35%, #fb7185 0%, #be123c 55%, #4c0519 100%)',
    glowAccent: 'rgba(225, 29, 72, 0.35)',
  },
  onyx: {
    id: 'onyx',
    label: 'Onyx Noir & Argent Pur',
    sublabel: 'Élégance sobre, or brossé et noir absolu',
    primaryHex: '#e2e8f0',
    secondaryHex: '#94a3b8',
    textAccent: 'text-zinc-200',
    textAccentLight: 'text-white',
    textAccentDark: 'text-zinc-400',
    bgAccentSoft: 'bg-zinc-500/20',
    bgAccentMedium: 'bg-zinc-500/30',
    bgAccentSolid: 'bg-zinc-300',
    bgHeroGradient: 'from-zinc-900 via-neutral-950 to-black',
    bgCardGradient: 'from-zinc-900/40 via-neutral-900/90 to-neutral-950',
    borderAccent: 'border-zinc-400/40',
    borderAccentLight: 'border-zinc-300/60',
    ringAccent: 'ring-zinc-300',
    btnPrimaryGradient: 'bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-100 hover:from-white text-neutral-950',
    btnSecondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600/40',
    sealHex: '#18181b',
    sealGradient: 'radial-gradient(circle at 35% 35%, #71717a 0%, #27272a 55%, #09090b 100%)',
    glowAccent: 'rgba(226, 232, 240, 0.3)',
  },
  'royal-blue': {
    id: 'royal-blue',
    label: 'Bleu Nuit Céleste & Étoiles',
    sublabel: 'Paix éternelle, élévation de l’âme et sérénité',
    primaryHex: '#38bdf8',
    secondaryHex: '#0284c7',
    textAccent: 'text-sky-400',
    textAccentLight: 'text-sky-200',
    textAccentDark: 'text-sky-500',
    bgAccentSoft: 'bg-sky-500/15',
    bgAccentMedium: 'bg-sky-500/25',
    bgAccentSolid: 'bg-sky-500',
    bgHeroGradient: 'from-sky-950/70 via-indigo-950/50 to-neutral-950',
    bgCardGradient: 'from-sky-950/35 via-neutral-900/90 to-neutral-950',
    borderAccent: 'border-sky-400/40',
    borderAccentLight: 'border-sky-300/60',
    ringAccent: 'ring-sky-400',
    btnPrimaryGradient: 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 text-white',
    btnSecondary: 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 border border-sky-400/30',
    sealHex: '#0369a1',
    sealGradient: 'radial-gradient(circle at 35% 35%, #38bdf8 0%, #0369a1 55%, #082f49 100%)',
    glowAccent: 'rgba(56, 189, 248, 0.35)',
  },
  emerald: {
    id: 'emerald',
    label: 'Vert Émeraude & Espérance',
    sublabel: 'Vie éternelle, grâce et renouveau',
    primaryHex: '#10b981',
    secondaryHex: '#059669',
    textAccent: 'text-emerald-400',
    textAccentLight: 'text-emerald-200',
    textAccentDark: 'text-emerald-500',
    bgAccentSoft: 'bg-emerald-500/15',
    bgAccentMedium: 'bg-emerald-500/25',
    bgAccentSolid: 'bg-emerald-500',
    bgHeroGradient: 'from-emerald-950/70 via-neutral-950 to-neutral-900',
    bgCardGradient: 'from-emerald-950/35 via-neutral-900/90 to-neutral-950',
    borderAccent: 'border-emerald-400/40',
    borderAccentLight: 'border-emerald-300/60',
    ringAccent: 'ring-emerald-400',
    btnPrimaryGradient: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 text-neutral-950',
    btnSecondary: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-400/30',
    sealHex: '#047857',
    sealGradient: 'radial-gradient(circle at 35% 35%, #34d399 0%, #047857 55%, #064e3b 100%)',
    glowAccent: 'rgba(16, 185, 129, 0.35)',
  },
};

export function getTheme(themeColor?: ThemeColor): ThemeConfig {
  if (!themeColor || !THEME_CONFIGS[themeColor]) {
    return THEME_CONFIGS['imperial-gold'];
  }
  return THEME_CONFIGS[themeColor];
}
