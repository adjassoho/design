import React from 'react';
import { Layers, Heart, Image as ImageIcon, Share2, BookOpen, ScrollText } from 'lucide-react';

export type TabType = 'program' | 'memorial-card' | 'order-of-service' | 'tributes' | 'photos' | 'hymns' | 'biography' | 'share';

interface NavigationBottomProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  tributesCount?: number;
}

export const NavigationBottom: React.FC<NavigationBottomProps> = ({
  currentTab,
  onSelectTab,
  tributesCount = 5,
}) => {
  return (
    <nav
      id="memorial-bottom-navigation"
      aria-label="Memorial Navigation"
      className="bg-neutral-900/95 backdrop-blur-md border-t border-amber-500/20 px-2 py-2 flex items-center justify-around z-30 shadow-2xl relative"
    >
      {/* Tab 1: Program (Screen 1) */}
      <button
        id="nav-tab-program"
        onClick={() => onSelectTab('program')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
          currentTab === 'program'
            ? 'text-amber-300 font-semibold scale-105'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className={`p-1 rounded-md ${currentTab === 'program' ? 'bg-amber-500/20' : ''}`}>
          <Layers className="w-5 h-5" />
        </div>
        <span className="text-[11px] tracking-wide mt-0.5">Program</span>
      </button>

      {/* Tab 2: Memorial Card (Screen 2) */}
      <button
        id="nav-tab-memorial-card"
        onClick={() => onSelectTab('memorial-card')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all ${
          currentTab === 'memorial-card'
            ? 'text-amber-300 font-semibold scale-105'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className={`p-1 rounded-md ${currentTab === 'memorial-card' ? 'bg-amber-500/20' : ''}`}>
          <ScrollText className="w-5 h-5" />
        </div>
        <span className="text-[11px] tracking-wide mt-0.5">Card</span>
      </button>

      {/* Tab 3: Tributes */}
      <button
        id="nav-tab-tributes"
        onClick={() => onSelectTab('tributes')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all relative ${
          currentTab === 'tributes'
            ? 'text-amber-300 font-semibold scale-105'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className={`p-1 rounded-md ${currentTab === 'tributes' ? 'bg-amber-500/20' : ''}`}>
          <Heart className="w-5 h-5 fill-current/30" />
        </div>
        <span className="text-[11px] tracking-wide mt-0.5">Tributes</span>
        {tributesCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-amber-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center shadow">
            {tributesCount}
          </span>
        )}
      </button>

      {/* Tab 4: Photos */}
      <button
        id="nav-tab-photos"
        onClick={() => onSelectTab('photos')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
          currentTab === 'photos'
            ? 'text-amber-300 font-semibold scale-105'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className={`p-1 rounded-md ${currentTab === 'photos' ? 'bg-amber-500/20' : ''}`}>
          <ImageIcon className="w-5 h-5" />
        </div>
        <span className="text-[11px] tracking-wide mt-0.5">Photos</span>
      </button>

      {/* Tab 5: Share */}
      <button
        id="nav-tab-share"
        onClick={() => onSelectTab('share')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
          currentTab === 'share'
            ? 'text-amber-300 font-semibold scale-105'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className={`p-1 rounded-md ${currentTab === 'share' ? 'bg-amber-500/20' : ''}`}>
          <Share2 className="w-5 h-5" />
        </div>
        <span className="text-[11px] tracking-wide mt-0.5">Share</span>
      </button>
    </nav>
  );
};
