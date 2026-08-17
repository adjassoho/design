import React, { useState } from 'react';
import { FuneralProfile, OrderOfServiceItem } from '../types';
import { defaultOrderOfService } from '../data/defaultMemorial';
import { Clock, BookOpen, User, Church, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ScreenOrderOfServiceProps {
  memorial: FuneralProfile;
  onOpenHymn?: (hymnRef: string) => void;
}

export const ScreenOrderOfService: React.FC<ScreenOrderOfServiceProps> = ({
  memorial,
  onOpenHymn,
}) => {
  const isEn = memorial.language === 'en';
  const [activeTab, setActiveTab] = useState<'funeral' | 'songs'>('funeral');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between bg-neutral-950 text-neutral-100 p-4 select-none font-sans-custom pb-6">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 pt-2 pb-3 text-center border-b border-amber-500/20">
        <div className="text-[11px] font-cinzel font-semibold tracking-[0.3em] text-amber-400 uppercase">
          {isEn ? 'Order of Solemn Proceedings' : 'Déroulement de la Cérémonie'}
        </div>
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200 mt-0.5 uppercase">
          {isEn ? 'Order of Service' : 'Programme du Culte'}
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          {isEn ? 'In loving celebration of ' : 'Célébration solennelle pour '}
          <span className="text-amber-200 font-semibold">{memorial.fullName}</span>
        </p>

        {/* Tab Switcher: Funeral Service vs Service of Songs */}
        <div className="flex items-center justify-center mt-3 bg-neutral-900 p-1 rounded-xl border border-neutral-800 max-w-xs mx-auto">
          <button
            onClick={() => setActiveTab('funeral')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'funeral'
                ? 'bg-amber-500 text-neutral-950 shadow font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {isEn ? 'Funeral Service' : 'Culte d’Obsèques'}
          </button>
          <button
            onClick={() => setActiveTab('songs')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'songs'
                ? 'bg-amber-500 text-neutral-950 shadow font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {isEn ? 'Service of Songs' : 'Veillée de Prières'}
          </button>
        </div>
      </div>

      {/* Program Content */}
      <div className="relative z-10 flex-1 py-4 space-y-3">
        {activeTab === 'funeral' ? (
          <div className="space-y-3">
            {/* Venue Card */}
            <div className="bg-neutral-900/90 rounded-2xl p-3.5 border border-amber-500/30 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Church className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <h4 className="font-cinzel font-bold text-amber-200 text-sm">
                  {memorial.funeralService.venueName}
                </h4>
                <p className="text-neutral-300">{memorial.funeralService.address}</p>
                <div className="flex items-center gap-3 text-amber-400/90 font-medium pt-1">
                  <span>⏱ {memorial.funeralService.lyingInState}</span>
                  <span>•</span>
                  <span>🕊 {memorial.funeralService.serviceStartTime}</span>
                </div>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-2.5">
              {(memorial.orderOfService || defaultOrderOfService).map((item, idx) => {
                const isChecked = !!completedSteps[item.id];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => toggleStep(item.id)}
                    className={`rounded-2xl p-3.5 border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-neutral-900/40 border-neutral-800 opacity-60'
                        : 'bg-neutral-900/90 border-neutral-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-cinzel flex items-center justify-center shrink-0 mt-0.5">
                          {item.orderNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`text-xs sm:text-sm font-bold font-cinzel ${isChecked ? 'line-through text-neutral-400' : 'text-neutral-100'}`}>
                              {item.title}
                            </h4>
                            {item.timeEstimate && (
                              <span className="text-[10px] bg-neutral-800 text-amber-300/90 px-1.5 py-0.5 rounded-md font-mono">
                                {item.timeEstimate}
                              </span>
                            )}
                          </div>

                          {item.details && (
                            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                              {item.details}
                            </p>
                          )}

                          {item.conductedBy && (
                            <div className="flex items-center gap-1 text-[11px] text-amber-400/80 mt-1.5">
                              <User className="w-3 h-3 shrink-0" />
                              <span>{item.conductedBy}</span>
                            </div>
                          )}

                          {item.hymnRef && (
                            <div className="mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onOpenHymn) onOpenHymn(item.hymnRef!);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-[11px] font-semibold transition-all cursor-pointer"
                              >
                                <BookOpen className="w-3 h-3 text-amber-400" />
                                <span>{isEn ? 'Sing Cantique' : 'Chanter ce Cantique'}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        title={isChecked ? (isEn ? "Mark as upcoming" : "Marquer comme à venir") : (isEn ? "Mark as completed" : "Marquer comme terminé")}
                        className="text-neutral-500 hover:text-amber-400 p-1 cursor-pointer"
                      >
                        <CheckCircle2 className={`w-4 h-4 ${isChecked ? 'text-amber-400' : 'text-neutral-700'}`} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Reception Detail */}
            {memorial.receptionDetail && (
              <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 rounded-2xl p-4 border border-amber-500/40 mt-4 text-xs space-y-1">
                <div className="font-cinzel font-bold text-amber-300 text-sm">
                  {isEn ? 'RECEPTION & THANKSGIVING BANQUET' : 'RÉCEPTION & RAFRAÎCHISSEMENTS'}
                </div>
                <p className="text-neutral-200 font-semibold">{memorial.receptionDetail.venue}</p>
                <p className="text-neutral-400">{memorial.receptionDetail.time}</p>
                <p className="text-amber-200/80 italic pt-1">{memorial.receptionDetail.note}</p>
              </div>
            )}
          </div>
        ) : (
          /* Service of Songs View */
          <div className="space-y-4">
            <div className="bg-neutral-900/90 rounded-2xl p-4 border border-amber-500/30 space-y-2">
              <div className="font-cinzel text-sm font-bold text-amber-300">
                {isEn ? 'CHRISTIAN WAKE KEEP & SERVICE OF SONGS' : 'VEILLÉE DE PRIÈRES & CHANTS D’HOMMAGE'}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {isEn
                  ? `A night of praise, worship, scripture reflections, and heartfelt tributes honoring the exemplary Christian life of ${memorial.fullName}.`
                  : `Une soirée de louanges, d’adoration, de méditation des Écritures et de chaleureux hommages en l’honneur de la mémoire bénie de ${memorial.fullName}.`}
              </p>
              <div className="text-xs text-amber-200/90 flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{memorial.serviceOfSongs.dateTime}</span>
              </div>
            </div>

            <div className="bg-neutral-900/70 rounded-2xl p-4 border border-neutral-800 space-y-3 text-xs">
              <h4 className="font-cinzel text-amber-200 font-bold uppercase tracking-wider text-xs">
                {isEn ? 'Evening Program Outline' : 'Déroulement de la Veillée'}
              </h4>
              <ul className="space-y-2.5 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>{isEn ? 'Praise & Worship Session — Worship Team' : 'Louanges & Adoration — Chœur de la Paroisse'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>{isEn ? 'Opening Prayer & Hymn of Faith' : 'Prière d’Ouverture & Cantique de Foi'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span>{isEn ? 'Scripture Exhortation (1 Corinthians 15:51-58)' : 'Exhortation Biblique (1 Corinthiens 15:51-58)'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                  <span>{isEn ? 'Words of Tribute from Family & Friends' : 'Témoignages de la Famille, des Amis & Collègues'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">5</span>
                  <span>{isEn ? 'Musical Renditions & Candle Lighting of Remembrance' : 'Moments de Recueillement & Allumage des Bougies'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">6</span>
                  <span>{isEn ? 'Closing Benediction & Refreshment' : 'Bénédiction Pastorale Finale & Collation'}</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
