import React from 'react';
import {
  Layers,
  Heart,
  Share2,
  BookOpen,
  ScrollText,
  Users,
  Music,
  UserCheck,
} from 'lucide-react';
import { ThemeColor } from '../types';
import { getThemeStyles } from '../utils/themeStyles';

export type TabType =
  | 'program'
  | 'memorial-card'
  | 'order-of-service'
  | 'tributes'
  | 'photos'
  | 'hymns'
  | 'biography'
  | 'share'
  | 'dashboard';

interface NavigationBottomProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  tributesCount?: number;
  isPaid?: boolean;
  isGuestMode?: boolean;
  language?: 'fr' | 'en';
  themeColor?: ThemeColor;
}

export const NavigationBottom: React.FC<NavigationBottomProps> = ({
  currentTab,
  onSelectTab,
  tributesCount = 5,
  isGuestMode = false,
  language = 'fr',
  themeColor,
}) => {
  const theme = getThemeStyles(themeColor);

  // Navigation tabs for Guest Mode vs Organizer Mode
  const guestNavItems: { id: TabType; labelFr: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'program', labelFr: 'Programme', labelEn: 'Program', icon: Layers },
    { id: 'memorial-card', labelFr: 'Faire-part', labelEn: 'Card', icon: ScrollText },
    { id: 'order-of-service', labelFr: 'Culte', labelEn: 'Service', icon: BookOpen },
    { id: 'tributes', labelFr: 'Hommages', labelEn: 'Tributes', icon: Heart },
    { id: 'hymns', labelFr: 'Cantiques', labelEn: 'Hymns', icon: Music },
    { id: 'biography', labelFr: 'Biographie', labelEn: 'Biography', icon: UserCheck },
  ];

  const organizerNavItems: { id: TabType; labelFr: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'program', labelFr: 'Programme', labelEn: 'Program', icon: Layers },
    { id: 'memorial-card', labelFr: 'Carte', labelEn: 'Card', icon: ScrollText },
    { id: 'order-of-service', labelFr: 'Culte', labelEn: 'Service', icon: BookOpen },
    { id: 'tributes', labelFr: 'Hommages', labelEn: 'Tributes', icon: Heart },
    { id: 'dashboard', labelFr: 'Invités', labelEn: 'Guests', icon: Users },
    { id: 'share', labelFr: 'Partage', labelEn: 'Share', icon: Share2 },
  ];

  const activeItems = isGuestMode ? guestNavItems : organizerNavItems;

  return (
    <nav
      id="memorial-bottom-navigation"
      aria-label="Memorial Navigation"
      className={`sticky bottom-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md border-t ${theme.borderColor} px-1 pt-1.5 pb-2 shadow-2xl safe-area-pb`}
    >
      <div className="grid grid-cols-6 gap-1 items-center max-w-lg mx-auto">
        {activeItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const label = language === 'en' ? item.labelEn : item.labelFr;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer select-none relative ${
                isActive
                  ? `${theme.accentLightText} font-bold`
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? `${theme.badgeBg} shadow-inner`
                    : 'hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap truncate max-w-full">
                {label}
              </span>

              {/* Tributes Counter Badge */}
              {item.id === 'tributes' && tributesCount > 0 && (
                <span className={`absolute top-0 right-1 sm:right-2 w-3.5 h-3.5 ${theme.buttonGradient} text-[8px] font-bold text-neutral-950 rounded-full flex items-center justify-center shadow`}>
                  {tributesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
