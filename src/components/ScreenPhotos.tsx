import React, { useState } from 'react';
import { PhotoMemory, FuneralProfile } from '../types';
import { Image as ImageIcon, Plus, X, ZoomIn, Sparkles, ExternalLink, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getThemeStyles } from '../utils/themeStyles';

interface ScreenPhotosProps {
  memorial: FuneralProfile;
  photos: PhotoMemory[];
  onAddPhoto: (photo: PhotoMemory) => void;
}

export const ScreenPhotos: React.FC<ScreenPhotosProps> = ({
  memorial,
  photos,
  onAddPhoto,
}) => {
  const isEn = memorial.language === 'en';
  const theme = getThemeStyles(memorial.themeColor);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // New photo form state
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<PhotoMemory['category']>('Celebration');
  const [newYear, setNewYear] = useState('2024');

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const item: PhotoMemory = {
      id: `photo-${Date.now()}`,
      title: newTitle.trim() || (isEn ? 'Cherished Memory' : 'Précieux Souvenir'),
      caption: newCaption.trim() || (isEn ? 'Celebration of a blessed life.' : 'Célébration d’une vie bénie.'),
      category: newCategory,
      year: newYear.trim() || undefined,
      imageUrl: newUrl.trim(),
    };

    onAddPhoto(item);
    setNewTitle('');
    setNewCaption('');
    setNewUrl('');
    setIsAddModalOpen(false);
  };

  const categories = isEn
    ? ['All', 'Celebration', 'Family', 'Service & Faith', 'Youth & Milestones']
    : ['Tous', 'Célébration', 'Famille', 'Foi & Église', 'Jeunesse & Étapes'];

  const filteredPhotos =
    activeCategory === 'All' || activeCategory === 'Tous'
      ? photos
      : photos.filter((p) => {
          if (activeCategory === 'Celebration' || activeCategory === 'Célébration') return p.category === 'Celebration';
          if (activeCategory === 'Family' || activeCategory === 'Famille') return p.category === 'Family';
          if (activeCategory === 'Service & Faith' || activeCategory === 'Foi & Église') return p.category === 'Service & Faith';
          if (activeCategory === 'Youth & Milestones' || activeCategory === 'Jeunesse & Étapes') return p.category === 'Youth & Milestones';
          return true;
        });

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between bg-neutral-950 text-neutral-100 p-4 font-sans-custom select-none pb-6">
      {/* Header */}
      <div className={`relative z-10 space-y-3 pb-3 border-b ${theme.borderColor}`}>
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-[10px] font-cinzel tracking-[0.3em] ${theme.accentText} font-semibold uppercase`}>
              {isEn ? 'Photo & Memory Gallery' : 'Galerie Photos & Souvenirs'}
            </span>
            <h2 className={`font-cinzel text-xl sm:text-2xl font-bold ${theme.titleGradient} uppercase mt-0.5`}>
              {isEn ? 'Celebration of Life' : 'Instants Précieux de Vie'}
            </h2>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold text-xs flex items-center gap-1 shadow transition-all active:scale-95 cursor-pointer`}
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? 'Add Photo' : 'Ajouter Photo'}</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? `bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold shadow-xs`
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Photos */}
      <div className="relative z-10 flex-1 py-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredPhotos.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedPhoto(item)}
              className={`group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:${theme.borderColor} shadow-lg cursor-pointer aspect-4/5`}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute inset-x-0 bottom-0 p-2.5 text-xs">
                {item.year && (
                  <span className={`text-[10px] ${theme.accentLightText} font-cinzel font-bold`}>
                    {item.year}
                  </span>
                )}
                <h4 className="font-cinzel text-xs font-bold text-white line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[10px] text-neutral-300 line-clamp-1 font-serif italic mt-0.5">
                  {item.caption}
                </p>
              </div>

              <div className={`absolute top-2 right-2 p-1 rounded-full bg-neutral-900/60 ${theme.accentText} opacity-0 group-hover:opacity-100 transition-opacity`}>
                <ZoomIn className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative max-w-lg w-full bg-neutral-900 border ${theme.borderColor} rounded-3xl overflow-hidden shadow-2xl space-y-3`}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-neutral-950/80 text-neutral-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-[60vh] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${theme.accentText} font-cinzel font-bold`}>
                    {selectedPhoto.category} {selectedPhoto.year && `• ${selectedPhoto.year}`}
                  </span>
                </div>
                <h3 className={`font-cinzel text-base sm:text-lg font-bold ${theme.accentLightText}`}>
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-serif italic">
                  “{selectedPhoto.caption}”
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Photo Dynamic Link Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-neutral-900 border ${theme.borderColor} rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 text-xs`}
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Link2 className={`w-5 h-5 ${theme.accentText}`} />
                  <h3 className={`font-cinzel text-base font-bold ${theme.accentLightText}`}>
                    {isEn ? 'Add Photo by Dynamic URL' : 'Ajouter une Photo via Lien URL'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPhotoSubmit} className="space-y-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {isEn ? 'Image URL or Data URL *' : 'URL de l’image ou Lien Web *'}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder={isEn ? "https://images.unsplash.com/... or any photo link" : "https://... ou lien image"}
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-400 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    {isEn
                      ? 'Supports HTTPS image links, Unsplash URLs, or uploaded image URLs.'
                      : 'Compatible avec les liens HTTPS, Unsplash ou hébergements d’images.'}
                  </p>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {isEn ? 'Title / Subject' : 'Titre / Sujet'}
                  </label>
                  <input
                    type="text"
                    placeholder={isEn ? "e.g., Thanksgiving Service with Family" : "Ex: Messe d’action de grâce en famille"}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      {isEn ? 'Category' : 'Catégorie'}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="Celebration">{isEn ? 'Celebration' : 'Célébration'}</option>
                      <option value="Family">{isEn ? 'Family' : 'Famille'}</option>
                      <option value="Service & Faith">{isEn ? 'Service & Faith' : 'Foi & Église'}</option>
                      <option value="Youth & Milestones">{isEn ? 'Youth & Milestones' : 'Jeunesse & Étapes'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      {isEn ? 'Year' : 'Année'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2023"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {isEn ? 'Memory Caption' : 'Légende & Souvenir'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={isEn ? "Brief caption or memory describing this photo..." : "Brève description ou souvenir lié à cette photo..."}
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold cursor-pointer"
                  >
                    {isEn ? 'Cancel' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold cursor-pointer`}
                  >
                    {isEn ? 'Save Photo' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
