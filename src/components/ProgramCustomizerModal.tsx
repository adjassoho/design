import React, { useState } from 'react';
import { MemorialProfile, ThemeColor } from '../types';
import { portraitDefault, cloudsDefault } from '../data/defaultMemorial';
import { Sliders, X, Check, Upload, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface ProgramCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  memorial: MemorialProfile;
  onSave: (updated: MemorialProfile) => void;
  onReset: () => void;
}

export const ProgramCustomizerModal: React.FC<ProgramCustomizerModalProps> = ({
  isOpen,
  onClose,
  memorial,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<MemorialProfile>({ ...memorial });
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            portraitUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-5 w-full max-w-xl shadow-2xl space-y-4 max-h-[90vh] flex flex-col font-sans-custom text-xs"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-cinzel text-base font-bold text-amber-200">
                Program & Design Customizer
              </h3>
              <p className="text-[11px] text-neutral-400">
                Update personal details, image links, schedule, and styling in real-time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleApply} className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* 1. Personal Identity */}
          <div className="space-y-2.5 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
            <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider">
              1. Celebrated Loved One
            </h4>

            <div>
              <label className="block text-neutral-300 mb-1 font-medium">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-hidden text-xs font-serif text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">
                  Year of Birth
                </label>
                <input
                  type="text"
                  value={formData.birthYear}
                  onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-hidden text-xs"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">
                  Year of Passing
                </label>
                <input
                  type="text"
                  value={formData.passingYear}
                  onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-hidden text-xs"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">
                  Age (Years)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      age: val,
                      sealLabel: `AGED ${val} YEARS`,
                    });
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-hidden text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1 font-medium">
                Memorial Preamble / Tribute Intro
              </label>
              <textarea
                rows={2}
                value={formData.transitionPreamble}
                onChange={(e) => setFormData({ ...formData, transitionPreamble: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-hidden text-xs"
              />
            </div>
          </div>

          {/* 2. Dynamic Images & Portrait */}
          <div className="space-y-2.5 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
            <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
              <span>2. Portrait Image & Dynamic Links</span>
              <span className="text-[10px] text-amber-400/80 font-normal">URL or File Upload</span>
            </h4>

            {/* Current Portrait Preview */}
            <div className="flex items-center gap-3">
              <img
                src={formData.portraitUrl}
                alt="Portrait Preview"
                className="w-14 h-14 rounded-xl object-cover border border-amber-400 shadow"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 space-y-1.5">
                <input
                  type="url"
                  placeholder="Paste direct HTTPS photo URL..."
                  value={formData.portraitUrl.startsWith('data:') ? '' : formData.portraitUrl}
                  onChange={(e) => setFormData({ ...formData, portraitUrl: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-white focus:border-amber-400 focus:outline-hidden text-xs font-mono"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 cursor-pointer font-medium text-[11px]">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload Local Photo</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* 3. Schedule & Church Location */}
          <div className="space-y-2.5 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
            <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider">
              3. Obsequies Schedule
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">
                  Service of Songs Date & Time
                </label>
                <input
                  type="text"
                  value={formData.serviceOfSongs.dateTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serviceOfSongs: { ...formData.serviceOfSongs, dateTime: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-medium">
                  Funeral Service Date
                </label>
                <input
                  type="text"
                  value={formData.funeralService.dateTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      funeralService: { ...formData.funeralService, dateTime: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-hidden text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1 font-medium">
                Officiating Church & Venue
              </label>
              <input
                type="text"
                value={formData.officiatingChurch}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    officiatingChurch: e.target.value,
                    serviceOfSongs: { ...formData.serviceOfSongs, address: e.target.value },
                    funeralService: { ...formData.funeralService, address: e.target.value },
                  })
                }
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-hidden text-xs"
              />
            </div>
          </div>
        </form>

        {/* Modal Actions */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
