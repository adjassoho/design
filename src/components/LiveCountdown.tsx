import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle } from 'lucide-react';
import { ThemeColor } from '../types';
import { getThemeStyles } from '../utils/themeStyles';
import { parseCeremonyDate } from '../utils/dateHelper';

interface LiveCountdownProps {
  targetDateString?: string;
  targetTitle?: string;
  themeColor?: ThemeColor;
  language?: 'fr' | 'en';
}

export const LiveCountdown: React.FC<LiveCountdownProps> = ({
  targetDateString,
  targetTitle,
  themeColor,
  language = 'fr',
}) => {
  const isEn = language === 'en';
  const theme = getThemeStyles(themeColor);
  const displayTitle = targetTitle || (isEn ? 'Funeral Service & Obsequies' : 'Culte d’Obsèques & Inhumation');

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
    targetFormatted: string;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
    targetFormatted: '',
  });

  useEffect(() => {
    // Parse target date dynamically
    const parsedDate = parseCeremonyDate(targetDateString);
    let targetTime = parsedDate ? parsedDate.getTime() : 0;

    // Fallback: If no date specified or unparseable, set to an upcoming date in 10 days
    if (!targetTime || isNaN(targetTime)) {
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 10);
      fallback.setHours(10, 0, 0, 0);
      targetTime = fallback.getTime();
    }

    const targetDateObj = new Date(targetTime);
    const formatted = targetDateObj.toLocaleDateString(isEn ? 'en-US' : 'fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const calculate = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
          targetFormatted: formatted,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
        targetFormatted: formatted,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDateString, isEn]);

  return (
    <div className={`w-full bg-neutral-950/85 border ${theme.borderColor} rounded-2xl p-3.5 shadow-xl flex flex-col items-center text-center space-y-2.5 backdrop-blur-xs`}>
      <div className="flex flex-col items-center gap-0.5">
        <div className={`flex items-center gap-1.5 ${theme.accentLightText} text-[11px] font-cinzel uppercase tracking-wider font-bold`}>
          <Clock className={`w-3.5 h-3.5 ${theme.accentText} animate-pulse`} />
          <span>{isEn ? 'Countdown to ' : 'Décompte solennel : '}{displayTitle}</span>
        </div>
        {timeLeft.targetFormatted && (
          <span className="text-[10px] text-neutral-400 font-serif italic capitalize">
            {timeLeft.targetFormatted}
          </span>
        )}
      </div>

      {timeLeft.isPast ? (
        <div className={`py-2 px-4 ${theme.badgeBg} rounded-xl border ${theme.borderColor} text-xs font-medium text-center space-y-1`}>
          <p className="text-amber-200 font-semibold">🕊️ {isEn ? 'The memorial service has concluded.' : 'Le culte commémoratif a eu lieu.'}</p>
          <p className="text-[10px] text-neutral-400">{isEn ? 'May the soul rest in eternal peace.' : 'Que son âme repose dans la paix céleste.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1.5 w-full max-w-xs">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-2 flex flex-col items-center shadow-inner">
            <span className="text-xl font-bold font-mono text-white tracking-tight">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans font-semibold mt-0.5">
              {isEn ? 'Days' : 'Jours'}
            </span>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-2 flex flex-col items-center shadow-inner">
            <span className="text-xl font-bold font-mono text-white tracking-tight">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans font-semibold mt-0.5">
              {isEn ? 'Hours' : 'Heures'}
            </span>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-2 flex flex-col items-center shadow-inner">
            <span className="text-xl font-bold font-mono text-white tracking-tight">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans font-semibold mt-0.5">
              Min
            </span>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-2 flex flex-col items-center shadow-inner">
            <span className={`text-xl font-bold font-mono ${theme.accentText} tracking-tight`}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans font-semibold mt-0.5">
              Sec
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

