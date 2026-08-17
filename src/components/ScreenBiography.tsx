import React from 'react';
import { MemorialProfile } from '../types';
import { defaultMilestones, waxSealDefault } from '../data/defaultMemorial';
import { Award, BookOpen, Heart, Users, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface ScreenBiographyProps {
  memorial: MemorialProfile;
}

export const ScreenBiography: React.FC<ScreenBiographyProps> = ({ memorial }) => {
  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between overflow-y-auto bg-neutral-950 text-neutral-100 p-4 font-sans-custom select-none">
      {/* Header */}
      <div className="relative z-10 space-y-2 pb-3 border-b border-amber-500/20 text-center">
        <span className="text-[10px] font-cinzel tracking-[0.3em] text-amber-400 font-semibold uppercase">
          Life, Faith & Legacy
        </span>
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient uppercase">
          Biography & Milestones
        </h2>
        <p className="text-xs text-neutral-400">
          A Celebration of 71 Victorious Years (1953 – 2024)
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 py-4 space-y-4">
        {/* Profile Card Summary */}
        <div className="bg-gradient-to-r from-[#320A10] via-neutral-900 to-neutral-900 rounded-3xl p-4 sm:p-5 border border-amber-500/40 shadow-xl flex items-center gap-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg shrink-0">
            <img
              src={memorial.portraitUrl}
              alt={memorial.fullName}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-cormorant text-xl sm:text-2xl font-bold text-amber-100 leading-tight">
              {memorial.fullName}
            </h3>
            <p className="text-xs text-amber-300 font-montserrat tracking-wider font-semibold mt-0.5">
              {memorial.birthYear} — {memorial.passingYear} (Aged {memorial.age})
            </p>
            <p className="text-[11px] text-neutral-300 italic font-serif mt-1">
              Husband, Father, Grandfather, Community Patriarch & Devout Christian.
            </p>
          </div>
        </div>

        {/* Narrative Biography Sections */}
        <div className="bg-neutral-900/90 rounded-3xl p-5 border border-neutral-800 space-y-4 text-xs sm:text-sm leading-relaxed text-neutral-200">
          <div>
            <h4 className="font-cinzel text-amber-300 font-bold text-sm tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Early Life & Educational Foundation</span>
            </h4>
            <p className="font-serif text-neutral-300 leading-relaxed">
              Born on August 14, 1953, Pa Peter Abiodun Oyenuga grew up with a relentless thirst for knowledge and moral uprightness. His formative years were defined by hard work, scholarly excellence, and an innate calling towards service and agricultural development.
            </p>
          </div>

          <div className="border-t border-neutral-800 pt-3">
            <h4 className="font-cinzel text-amber-300 font-bold text-sm tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Career & Community Impact</span>
            </h4>
            <p className="font-serif text-neutral-300 leading-relaxed">
              Throughout a distinguished career spanning over three decades, Pa Peter served with unblemished honesty and dedication. He mentored hundreds of young professionals, established educational endowments, and was widely sought after for his peacemaking wisdom and leadership.
            </p>
          </div>

          <div className="border-t border-neutral-800 pt-3">
            <h4 className="font-cinzel text-amber-300 font-bold text-sm tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-amber-400" />
              <span>Devotion to God & Family Legacy</span>
            </h4>
            <p className="font-serif text-neutral-300 leading-relaxed">
              Above all professional accolades, Pa Peter cherished his relationship with the Lord and his beloved family. As an elder at Vine Branch Church, he spent his retirement years in daily intercessory prayers, philanthropic giving, and nurturing his children and grandchildren in the ways of righteousness.
            </p>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-3 pt-2">
          <h4 className="font-cinzel text-amber-300 text-sm font-bold tracking-wider uppercase text-center">
            Key Life Milestones
          </h4>
          <div className="space-y-2.5">
            {defaultMilestones.map((ms, idx) => (
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
