import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, X, Flame, Heart, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GuestItem, RsvpSubmission, ThemeColor } from '../types';
import { getThemeStyles } from '../utils/themeStyles';

interface GuestRsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: GuestItem | null;
  deceasedName: string;
  isCollective?: boolean;
  onSubmitRsvp: (submission: RsvpSubmission) => void;
  themeColor?: ThemeColor;
}

export const GuestRsvpModal: React.FC<GuestRsvpModalProps> = ({
  isOpen,
  onClose,
  guest,
  deceasedName,
  isCollective = false,
  onSubmitRsvp,
  themeColor = 'imperial-gold',
}) => {
  const theme = getThemeStyles(themeColor);
  const [status, setStatus] = useState<'yes' | 'no'>('yes');
  const [name, setName] = useState(guest?.displayName || '');
  const [seats, setSeats] = useState(guest?.seats || 1);
  const [condolence, setCondolence] = useState(guest?.condolenceMessage || '');
  const [candleLit, setCandleLit] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmitRsvp({
      id: `rsvp-${Date.now()}`,
      guestId: guest?.id,
      guestSlug: guest?.slug,
      name: name.trim() || guest?.displayName || 'Ami(e) de la famille',
      status,
      seats: status === 'yes' ? seats : 0,
      condolence: condolence.trim(),
      candleLit,
      createdAt: new Date().toISOString(),
    });

    if (candleLit || status === 'yes') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          colors: ['#f59e0b', '#d97706', '#ffffff'],
        });
      } catch (e) {}
    }

    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`bg-neutral-900 border ${theme.borderColor} rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 text-xs font-sans text-neutral-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Heart className={`w-4 h-4 ${theme.accentText} fill-current`} />
            <div>
              <h3 className={`font-cinzel text-sm font-bold ${theme.accentLightText}`}>
                Réponse de Présence & Condoléances
              </h3>
              <p className="text-[10px] text-neutral-400">
                Hommage à {deceasedName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-cinzel text-sm font-bold text-emerald-300">
              Votre réponse a bien été transmise
            </h4>
            <p className="text-xs text-neutral-400">
              La famille vous remercie chaleureusement pour vos prières et votre soutien.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* If Collective, ask for guest name */}
            {(isCollective || !guest?.displayName) && (
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">
                  Votre Nom & Prénom
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aïcha Mensah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs"
                />
              </div>
            )}

            {/* Attendance Choice */}
            <div className="space-y-1.5">
              <label className="block text-neutral-300 font-medium">
                Serez-vous présent(e) aux obsèques ?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('yes')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-medium transition-all cursor-pointer ${
                    status === 'yes'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200 shadow'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Oui, je serai présent</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('no')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-medium transition-all cursor-pointer ${
                    status === 'no'
                      ? 'border-red-400 bg-red-950/40 text-red-200 shadow'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Empêché(e)</span>
                </button>
              </div>
            </div>

            {/* Number of seats if YES */}
            {status === 'yes' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-neutral-200">
                    Nombre de personnes
                  </span>
                  <p className="text-[10px] text-neutral-400">
                    Places souhaitées pour le culte et la réception
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSeats(Math.max(1, seats - 1))}
                    className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className={`w-6 text-center font-mono font-bold ${theme.accentText}`}>
                    {seats}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSeats(Math.min(guest?.seats || 5, seats + 1))}
                    className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Condolence Message */}
            <div>
              <label className="block text-neutral-300 mb-1 font-medium">
                Message de condoléances / Hommage (optionnel)
              </label>
              <textarea
                rows={3}
                placeholder="Un mot de réconfort pour la famille..."
                value={condolence}
                onChange={(e) => setCondolence(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white focus:border-amber-400 text-xs"
              />
            </div>

            {/* Light Memorial Candle Toggle */}
            <div
              onClick={() => setCandleLit(!candleLit)}
              className={`bg-neutral-950/80 border ${theme.borderColor} rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:border-amber-500/50 transition-all`}
            >
              <div className="flex items-center gap-2">
                <Flame
                  className={`w-4 h-4 ${
                    candleLit ? `${theme.accentText} fill-current animate-pulse` : 'text-neutral-500'
                  }`}
                />
                <span className={`text-xs font-medium ${theme.accentLightText}`}>
                  Allumer une bougie virtuelle en sa mémoire
                </span>
              </div>
              <input
                type="checkbox"
                checked={candleLit}
                onChange={() => {}}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className={`w-full py-3 px-4 bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider font-cinzel`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer ma réponse à la famille</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
