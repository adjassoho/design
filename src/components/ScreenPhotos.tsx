import React, { useState } from 'react';
import { PhotoMemory, MemorialProfile } from '../types';
import { Image as ImageIcon, Plus, X, ZoomIn, Sparkles, ExternalLink, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScreenPhotosProps {
  memorial: MemorialProfile;
  photos: PhotoMemory[];
  onAddPhoto: (photo: PhotoMemory) => void;
}

export const ScreenPhotos: React.FC<ScreenPhotosProps> = ({
  memorial,
  photos,
  onAddPhoto,
}) => {
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
      title: newTitle.trim() || 'Cherished Memory',
      caption: newCaption.trim() || 'Celebration of a blessed life.',
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

  const filteredPhotos =
    activeCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between overflow-y-auto bg-neutral-950 text-neutral-100 p-4 font-sans-custom select-none">
      {/* Header */}
      <div className="relative z-10 space-y-3 pb-3 border-b border-amber-500/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-cinzel tracking-[0.3em] text-amber-400 font-semibold uppercase">
              Photo & Memory Gallery
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient uppercase mt-0.5">
              Celebration of Life
            </h2>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1 shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 text-xs no-scrollbar">
          {['All', 'Celebration', 'Family', 'Service & Faith', 'Youth & Milestones'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
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
              className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 shadow-lg cursor-pointer aspect-4/5"
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
                  <span className="text-[10px] text-amber-300 font-cinzel font-bold">
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

              <div className="absolute top-2 right-2 p-1 rounded-full bg-neutral-900/60 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
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
              className="relative max-w-lg w-full bg-neutral-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl space-y-3"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-neutral-950/80 text-neutral-300 hover:text-white"
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
                  <span className="text-xs text-amber-400 font-cinzel font-bold">
                    {selectedPhoto.category} {selectedPhoto.year && `• ${selectedPhoto.year}`}
                  </span>
                </div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-100">
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
              className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-amber-400" />
                  <h3 className="font-cinzel text-base font-bold text-amber-200">
                    Add Photo by Dynamic URL
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPhotoSubmit} className="space-y-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Image URL or Data URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/... or any photo link"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-400 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Supports HTTPS image links, Unsplash URLs, or uploaded image URLs.
                  </p>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Title / Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Thanksgiving Service with Family"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="Celebration">Celebration</option>
                      <option value="Family">Family</option>
                      <option value="Service & Faith">Service & Faith</option>
                      <option value="Youth & Milestones">Youth & Milestones</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2023"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-hidden focus:border-amber-400"
                    >
                    </input>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Memory Caption
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief caption or memory describing this photo..."
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-neutral-950 font-bold"
                  >
                    Save Photo
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
