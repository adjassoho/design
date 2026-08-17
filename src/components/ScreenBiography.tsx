import React from 'react';
import { FuneralProfile } from '../types';
import { defaultMilestones } from '../data/defaultMemorial';
import { Award, Heart, Star, Sparkles, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface ScreenBiographyProps {
  memorial: FuneralProfile;
}

export const ScreenBiography: React.FC<ScreenBiographyProps> = ({ memorial }) => {
  const isEn = memorial.language === 'en';

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between bg-neutral-950 text-neutral-100 p-4 font-sans-custom select-none pb-6">
      {/* Header */}
      <div className="relative z-10 space-y-1.5 pb-3 border-b border-amber-500/20 text-center">
        <span className="text-[10px] font-cinzel tracking-[0.3em] text-amber-400 font-semibold uppercase">
          {isEn ? 'Life, Faith & Legacy' : 'Vie, Foi & Héritage'}
        </span>
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200 uppercase">
          {isEn ? 'Biography & Milestones' : 'Biographie & Grandes Étapes'}
        </h2>
        <p className="text-xs text-neutral-400">
          {isEn
            ? `A celebration of ${memorial.age || 71} blessed years (${memorial.birthYear} – ${memorial.passingYear})`
            : `Célébration de ${memorial.age || 71} années de vie bénie (${memorial.birthYear} – ${memorial.passingYear})`}
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 py-4 space-y-4">
        {/* Profile Card Summary */}
        <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 rounded-3xl p-4 sm:p-5 border border-amber-500/40 shadow-xl flex items-center gap-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg shrink-0">
            <img
              src={memorial.portraitUrl}
              alt={memorial.fullName}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 leading-tight">
              {memorial.fullName}
            </h3>
            <p className="text-xs text-amber-300 tracking-wider font-semibold mt-0.5">
              {memorial.birthYear} — {memorial.passingYear} ({isEn ? `Aged ${memorial.age}` : `Âgé de ${memorial.age} ans`})
            </p>
            <p className="text-[11px] text-neutral-300 italic font-serif mt-1">
              {memorial.epitaph ||
                (isEn
                  ? 'Husband, Father, Grandfather, Community Patriarch & Devout Christian.'
                  : 'Époux dévoué, Père bienveillant, Grand-père chéri, Patriarche et serviteur de Dieu.')}
            </p>
          </div>
        </div>

        {/* Narrative Biography Sections */}
        <div className="bg-neutral-900/90 rounded-3xl p-5 border border-neutral-800 space-y-4 text-xs sm:text-sm leading-relaxed text-neutral-200">
          <div>
            <h4 className="font-cinzel text-amber-300 font-bold text-sm tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400" />
              <span>
                {memorial.biography?.earlyLifeTitle ||
                  (isEn ? 'Early Life & Educational Foundation' : 'Enfance, Racines & Formation')}
              </span>
            </h4>
            <p className="font-serif text-neutral-300 leading-relaxed whitespace-pre-line">
              {memorial.biography?.earlyLifeText ||
                (isEn
                  ? `Born on ${memorial.exactDateOfBirth || 'August 14, 1953'}, ${memorial.fullName} grew up with a relentless thirst for knowledge and moral uprightness. His formative years were defined by hard work, scholarly excellence, and an innate calling towards service and community development.`
                  : `Né le ${memorial.exactDateOfBirth || '14 Août 1953'}, ${memorial.fullName} a grandi au sein d'une famille attachée aux valeurs d'intégrité, de travail et de piété. Ses jeunes années ont été marquées par une brillante assiduité intellectuelle et un engagement précoce au service des siens.`)}
            </p>
          </div>

          <div className="border-t border-neutral-800 pt-3">
            <h4 className="font-cinzel text-amber-300 font-bold text-sm tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>
                {memorial.biography?.careerTitle ||
                  (isEn ? 'Career & Community Impact' : 'Carrière Professionnelle & Impact')}
              </span>
            </h4>
            <p className="font-serif text-neutral-300 leading-relaxed whitespace-pre-line">
              {memorial.biography?.careerText ||
                (isEn
                  ? `Throughout a distinguished career spanning over three decades, ${memorial.fullName} served with unblemished honesty and dedication. He mentored hundreds of young professionals, established educational endowments, and was widely sought after for his peacemaking wisdom.`
                  : `Tout au long d’une carrière exemplaire de plus de trois décennies, il a incarné la rigueur, l’équité et la probité. Mentor généreux pour les jeunes générations, il a soutenu l’éducation de nombreux orphelins et a toujours œuvré comme artisan de paix dans sa communauté.`)}
            </p>
          </div>

          <div className="border-t border-neutral-800 pt-3">
            <h4 className="font-cinzel text-amber-300 font-bold text-sm tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-amber-400" />
              <span>
                {memorial.biography?.faithTitle ||
                  (isEn ? 'Devotion to God & Family Legacy' : 'Foi en Christ & Héritage Familial')}
              </span>
            </h4>
            <p className="font-serif text-neutral-300 leading-relaxed whitespace-pre-line">
              {memorial.biography?.faithText ||
                (isEn
                  ? `Above all professional accolades, ${memorial.fullName} cherished his relationship with the Lord and his beloved family. As a dedicated servant, he spent his retirement years in daily intercessory prayers, philanthropic giving, and nurturing his descendants in the ways of righteousness.`
                  : `Par-dessus tout, il chérissait sa marche quotidienne avec le Seigneur et l’amour inconditionnel de sa famille. En tant qu’ancien d’église respecté, il a consacré ses années de retraite à la prière d’intercession, aux œuvres de charité et à la transmission des valeurs de justice et de foi à ses enfants et petits-enfants.`)}
            </p>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-3 pt-2">
          <h4 className="font-cinzel text-amber-300 text-sm font-bold tracking-wider uppercase text-center">
            {isEn ? 'Key Life Milestones' : 'Grandes Étapes de Vie'}
          </h4>
          <div className="space-y-2.5">
            {(memorial.milestones || defaultMilestones).map((ms, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-neutral-900/80 rounded-2xl p-3.5 border border-neutral-800 flex items-start gap-3"
              >
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-cinzel font-bold text-xs shrink-0 mt-0.5">
                  {ms.year}
                </span>
                <div>
                  <h5 className="font-cinzel text-xs font-bold text-neutral-100">
                    {ms.title}
                  </h5>
                  <p className="text-xs text-neutral-300 font-serif mt-0.5 leading-relaxed">
                    {ms.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
