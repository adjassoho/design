import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

interface LiveCountdownProps {
  targetDateString?: string;
  targetTitle?: string;
}

export const LiveCountdown: React.FC<LiveCountdownProps> = ({
  targetDateString = '2025-02-14T10:00:00',
  targetTitle = 'Culte d’Obsèques & Inhumation',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    // Parse target date or set to an upcoming date so the countdown ticker is live
    let target = new Date(targetDateString).getTime();
    if (!target || isNaN(target) || target <= Date.now()) {
      // Target upcoming Saturday at 10:00 AM for realistic demonstration
      target = Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 4;
    }

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDateString]);

  return (
    <div className="w-full bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-3 shadow-lg flex flex-col items-center text-center space-y-2">
      <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-cinzel uppercase tracking-wider font-semibold">
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Décompte jusqu'au {targetTitle}</span>
      </div>

      {timeLeft.isPast ? (
        <div className="py-1 px-3 bg-amber-950/50 rounded-xl border border-amber-500/30 text-amber-200 text-xs font-medium">
          🕊️ Le culte commémoratif a eu lieu. Paix à son âme.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1.5 w-full max-w-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 flex flex-col items-center">
            <span className="text-lg font-bold font-mono text-amber-100">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Jours</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 flex flex-col items-center">
            <span className="text-lg font-bold font-mono text-amber-100">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Heures</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 flex flex-col items-center">
            <span className="text-lg font-bold font-mono text-amber-100">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Min</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 flex flex-col items-center">
            <span className="text-lg font-bold font-mono text-amber-400">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Sec</span>
          </div>
        </div>
      )}
    </div>
  );
};
