import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, X, ShieldCheck, QrCode, CheckCircle2, Clock } from 'lucide-react';
import { ThemeColor } from '../types';
import { getThemeStyles } from '../utils/themeStyles';

interface PaymentReminderPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPayment: () => void;
  language?: 'fr' | 'en';
  themeColor?: ThemeColor;
}

export const PaymentReminderPopup: React.FC<PaymentReminderPopupProps> = ({
  isOpen,
  onClose,
  onOpenPayment,
  language = 'fr',
  themeColor,
}) => {
  const isEn = language === 'en';
  const theme = getThemeStyles(themeColor);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-sm bg-gradient-to-b ${theme.cardGradient} border-2 ${theme.borderColor} rounded-3xl p-6 shadow-2xl space-y-4 text-center overflow-hidden`}
        >
          {/* Top Corner Accents */}
          <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${theme.borderColor} rounded-tl-3xl`} />
          <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${theme.borderColor} rounded-tr-3xl`} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer transition-all"
            title={isEn ? 'Close reminder' : 'Fermer le rappel'}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Sceau Icon & Badge */}
          <div className="flex flex-col items-center pt-2">
            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-tr ${theme.buttonGradient} p-0.5 shadow-lg flex items-center justify-center animate-pulse`}>
              <div className="w-full h-full bg-neutral-950 rounded-2xl flex items-center justify-center">
                <Zap className={`w-7 h-7 ${theme.accentText} fill-current`} />
              </div>
            </div>

            <span className={`mt-2 inline-flex items-center gap-1 px-3 py-1 ${theme.badgeBg} border ${theme.borderColor} ${theme.accentLightText} rounded-full text-[10px] font-cinzel font-bold tracking-widest uppercase`}>
              <Clock className={`w-3 h-3 ${theme.accentText}`} />
              {isEn ? 'Finalization Reminder' : 'Rappel de Finalisation'}
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-1">
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
              {isEn ? 'Pay 500 FCFA to Share' : 'Régler 500 FCFA avant de Partager'}
            </h3>
            <p className="text-xs text-neutral-300 font-serif leading-relaxed px-1">
              {isEn
                ? 'Before you finish and distribute the memorial invitation to your family & church on WhatsApp, a one-time activation fee of 500 FCFA is required.'
                : 'Avant de partager ce faire-part officiel à la famille et sur WhatsApp, un règlement unique de 500 FCFA est nécessaire.'}
            </p>
          </div>

          {/* Perks list */}
          <div className="bg-neutral-900/90 rounded-2xl p-3 border border-neutral-800 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-neutral-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isEn ? 'Direct WhatsApp & SMS invitation link' : 'Lien WhatsApp & SMS illimité'}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-200">
              <QrCode className={`w-4 h-4 ${theme.accentText} shrink-0`} />
              <span>{isEn ? 'High-definition Church bulletin QR Code' : 'QR Code Église haute définition'}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-200">
              <ShieldCheck className={`w-4 h-4 ${theme.accentText} shrink-0`} />
              <span>{isEn ? 'Instant FedaPay (MTN, Moov, Wave, Card)' : 'Paiement FedaPay (MTN, Moov, Wave, Carte)'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenPayment();
              }}
              className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all cursor-pointer`}
            >
              <Zap className="w-4 h-4 fill-neutral-950" />
              <span>{isEn ? 'Pay 500 FCFA Now (FedaPay)' : 'Payer 500 FCFA maintenant (FedaPay)'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs text-neutral-400 hover:text-neutral-200 font-medium transition-all cursor-pointer"
            >
              {isEn ? 'Continue editing for now' : 'Continuer l’édition'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
