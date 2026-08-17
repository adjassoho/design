import React from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
  Sliders,
  Eye,
  CheckCircle2,
  Globe,
} from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
  onOpenCustomizer?: () => void;
  onNewMemorial?: () => void;
  onOpenPayment?: () => void;
  title?: string;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
  isPaid?: boolean;
  isGuestMode?: boolean;
  onToggleGuestMode?: () => void;
  language?: 'fr' | 'en';
  onToggleLanguage?: () => void;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({
  children,
  onOpenCustomizer,
  onNewMemorial,
  onOpenPayment,
  title = "Convive • Obsèques",
  isAudioPlaying = false,
  onToggleAudio,
  isPaid = false,
  isGuestMode = false,
  onToggleGuestMode,
  language = 'fr',
  onToggleLanguage,
}) => {
  return (
    <div className="min-h-[100dvh] w-full bg-neutral-950 text-neutral-100 font-sans-custom flex justify-center selection:bg-amber-500 selection:text-neutral-950">
      {/* Central App Wrapper (Native Full-Screen on Mobile, Clean Centered on Tablet/Desktop) */}
      <div className="w-full max-w-lg min-h-[100dvh] bg-neutral-950 flex flex-col justify-between relative shadow-2xl sm:border-x sm:border-neutral-800/80">
        
        {/* Sleek Top Header */}
        <header className="sticky top-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md border-b border-amber-500/20 px-3 py-2 flex items-center justify-between gap-2 shadow-md">
          {/* Brand Logo / Memorial Info */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-700 via-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-neutral-950 font-cinzel">CV</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-cinzel text-xs sm:text-sm font-bold text-amber-200 tracking-wider truncate">
                  {isGuestMode ? (language === 'en' ? 'In Loving Memory' : 'Faire-part d’Obsèques') : title}
                </h1>
                {!isGuestMode && (
                  isPaid ? (
                    <span className="px-1.5 py-0.2 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 rounded-full text-[8px] font-bold shrink-0 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>{language === 'en' ? 'Paid' : 'Payé'}</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 bg-amber-950/90 border border-amber-500/50 text-amber-300 rounded-full text-[8px] font-bold shrink-0">
                      {language === 'en' ? 'Draft' : 'Brouillon'}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Audio Organ Requiem Toggle - Always available to guests and organizers */}
            {onToggleAudio && (
              <button
                onClick={onToggleAudio}
                title={isAudioPlaying ? "Couper la musique nécrologique" : "Jouer la musique nécrologique"}
                className={`px-2 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all border cursor-pointer ${
                  isAudioPlaying
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20 animate-pulse'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-amber-200'
                }`}
              >
                {isAudioPlaying ? (
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span className="text-[10px] hidden xs:inline font-medium">
                  {isAudioPlaying ? (language === 'en' ? 'Music ON' : 'Musique') : (language === 'en' ? 'Muted' : 'Couper')}
                </span>
              </button>
            )}

            {/* ONLY VISIBLE IN ORGANIZER MODE */}
            {!isGuestMode && (
              <>
                {/* Language Switcher (FR / EN) */}
                {onToggleLanguage && (
                  <button
                    onClick={onToggleLanguage}
                    className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs flex items-center gap-1 transition-all cursor-pointer"
                    title={language === 'fr' ? "Basculer l'invitation en Anglais" : "Switch invitation to French"}
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] font-bold uppercase">{language}</span>
                  </button>
                )}

                {/* Create/Edit Memorial Button */}
                {(onNewMemorial || onOpenCustomizer) && (
                  <button
                    onClick={onNewMemorial || onOpenCustomizer}
                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                    title="Créer ou modifier le faire-part"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-neutral-950 shrink-0" />
                    <span className="text-[11px]">{language === 'en' ? 'Create' : 'Créer'}</span>
                  </button>
                )}

                {/* FedaPay Button (if not yet paid) */}
                {!isPaid && onOpenPayment && (
                  <button
                    onClick={onOpenPayment}
                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                    title="Payer 500 FCFA avec FedaPay"
                  >
                    <Zap className="w-3.5 h-3.5 fill-neutral-950 shrink-0" />
                    <span className="text-[11px]">500 F</span>
                  </button>
                )}

                {/* Customizer / Settings Icon */}
                {onOpenCustomizer && (
                  <button
                    onClick={onOpenCustomizer}
                    className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs flex items-center justify-center transition-all cursor-pointer"
                    title="Personnaliser les informations"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                )}
              </>
            )}

            {/* Toggle Guest / Organizer Mode Simulation */}
            {onToggleGuestMode && (
              <button
                onClick={onToggleGuestMode}
                className={`p-1.5 sm:px-2 rounded-xl text-xs flex items-center gap-1 transition-all border cursor-pointer ${
                  isGuestMode
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title={isGuestMode ? (language === 'en' ? 'Return to Created for you' : 'Revenir à l’espace : Créé pour vous') : (language === 'en' ? 'Guest Preview' : 'Tester la vue Invité')}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">
                  {isGuestMode ? (language === 'en' ? 'Created for you' : 'Créé pour vous') : (language === 'en' ? 'Guest Preview' : 'Vue Invité')}
                </span>
              </button>
            )}
          </div>
        </header>

        {/* Fluid Native Content Container */}
        <main className="w-full flex-1 flex flex-col relative">
          {children}
        </main>
      </div>
    </div>
  );
};
