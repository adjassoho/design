import React from 'react';
import { Calendar, Clock, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { ThemeColor } from '../types';
import { getThemeStyles } from '../utils/themeStyles';

interface ExpiredMemorialNoticeProps {
  fullName?: string;
  createdAt?: string;
  expiresAt?: string;
  themeColor?: ThemeColor;
  language?: 'fr' | 'en';
  onHomeClick?: () => void;
}

export const ExpiredMemorialNotice: React.FC<ExpiredMemorialNoticeProps> = ({
  fullName = 'Défunt(e)',
  createdAt,
  expiresAt,
  themeColor = 'burgundy',
  language = 'fr',
  onHomeClick,
}) => {
  const isEn = language === 'en';
  const theme = getThemeStyles(themeColor);

  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString(isEn ? 'en-US' : 'fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
        {/* Solemn icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center">
          <Clock className="w-8 h-8 text-amber-400" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-widest text-amber-400 font-cinzel font-bold">
            {isEn ? 'Archived Notice' : 'Faire-part Archivé'}
          </span>
          <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-white uppercase">
            {isEn ? '30-Day Validity Period Concluded' : 'Période de Validité de 30 Jours Échue'}
          </h1>
          <p className="text-sm font-cormorant italic text-neutral-300">
            {isEn ? 'In blessed memory of' : 'À la mémoire pieuse de'}{' '}
            <strong className="text-amber-200 font-bold not-italic">{fullName}</strong>
          </p>
        </div>

        {/* Details Box */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-400 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span>{isEn ? 'Validity duration:' : 'Durée de validité :'}</span>
            <span className="text-neutral-200 font-medium font-mono">30 {isEn ? 'days' : 'jours'}</span>
          </div>
          {formattedExpiry && (
            <div className="flex items-center justify-between">
              <span>{isEn ? 'Expired on:' : 'Échu le :'}</span>
              <span className="text-amber-300/90 font-medium font-mono">{formattedExpiry}</span>
            </div>
          )}
          <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
            {isEn
              ? 'This unique memorial link has expired after its 30-day active period. Please contact the bereaved family or the event organizer.'
              : 'Ce lien unique de faire-part est arrivé au terme de sa période de diffusion de 30 jours. Veuillez contacter la famille organisatrice pour toute information.'}
          </div>
        </div>

        {/* Action */}
        {onHomeClick && (
          <button
            onClick={onHomeClick}
            className={`w-full py-3 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Return to Home' : 'Retourner à l’accueil'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
