import React, { useState, useEffect } from 'react';
import {
  MemorialProfile,
  TributeItem,
  PhotoMemory,
  ThemeColor,
} from './types';
import {
  defaultMemorial,
  defaultTributes,
  defaultPhotos,
} from './data/defaultMemorial';
import { PhoneContainer } from './components/PhoneContainer';
import { NavigationBottom, TabType } from './components/NavigationBottom';
import { ScreenProgram } from './components/ScreenProgram';
import { ScreenMemorialCard } from './components/ScreenMemorialCard';
import { ScreenOrderOfService } from './components/ScreenOrderOfService';
import { ScreenTributes } from './components/ScreenTributes';
import { ScreenPhotos } from './components/ScreenPhotos';
import { ScreenHymns } from './components/ScreenHymns';
import { ScreenBiography } from './components/ScreenBiography';
import { ScreenShare } from './components/ScreenShare';
import { ProgramCustomizerModal } from './components/ProgramCustomizerModal';
import { toggleMemorialAudio, stopMemorialAudio } from './utils/audioChime';

export default function App() {
  const [memorial, setMemorial] = useState<MemorialProfile>(defaultMemorial);
  const [tributes, setTributes] = useState<TributeItem[]>(defaultTributes);
  const [photos, setPhotos] = useState<PhotoMemory[]>(defaultPhotos);
  const [currentTab, setCurrentTab] = useState<TabType>('program');
  const [selectedHymnRef, setSelectedHymnRef] = useState<string | undefined>(undefined);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Check URL parameters for dynamic image & memorial loading
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const customName = searchParams.get('name');
      const customPhoto = searchParams.get('photo');
      const customBirth = searchParams.get('birth');
      const customPass = searchParams.get('pass');
      const customAge = searchParams.get('age');
      const customTheme = searchParams.get('theme') as ThemeColor | null;

      if (customName || customPhoto) {
        setMemorial((prev) => ({
          ...prev,
          fullName: customName || prev.fullName,
          portraitUrl: customPhoto ? decodeURIComponent(customPhoto) : prev.portraitUrl,
          birthYear: customBirth || prev.birthYear,
          passingYear: customPass || prev.passingYear,
          age: customAge ? Number(customAge) : prev.age,
          sealLabel: customAge ? `AGED ${customAge} YEARS` : prev.sealLabel,
          themeColor: customTheme || prev.themeColor,
        }));
      }
    }

    return () => {
      stopMemorialAudio();
    };
  }, []);

  const handleToggleAudio = () => {
    toggleMemorialAudio((playing) => {
      setIsAudioPlaying(playing);
    });
  };

  const handleAddTribute = (newTribute: TributeItem) => {
    setTributes((prev) => [newTribute, ...prev]);
  };

  const handleAddPhoto = (newPhoto: PhotoMemory) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleOpenHymnFromOrder = (hymnRef: string) => {
    setSelectedHymnRef(hymnRef);
    setCurrentTab('hymns');
  };

  return (
    <PhoneContainer
      onOpenCustomizer={() => setIsCustomizerOpen(true)}
      title="Heaven's Gain • Memorial"
      isAudioPlaying={isAudioPlaying}
      onToggleAudio={handleToggleAudio}
    >
      {/* Dynamic Screen View Switching */}
      <div className="w-full flex-1 relative flex flex-col justify-between overflow-hidden">
        {currentTab === 'program' && (
          <ScreenProgram
            memorial={memorial}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onLightCandle={() => setCurrentTab('tributes')}
          />
        )}

        {currentTab === 'memorial-card' && (
          <ScreenMemorialCard
            memorial={memorial}
            onBack={() => setCurrentTab('program')}
            onShare={() => setCurrentTab('share')}
          />
        )}

        {currentTab === 'order-of-service' && (
          <ScreenOrderOfService
            memorial={memorial}
            onOpenHymn={handleOpenHymnFromOrder}
          />
        )}

        {currentTab === 'tributes' && (
          <ScreenTributes
            memorial={memorial}
            tributes={tributes}
            onAddTribute={handleAddTribute}
          />
        )}

        {currentTab === 'photos' && (
          <ScreenPhotos
            memorial={memorial}
            photos={photos}
            onAddPhoto={handleAddPhoto}
          />
        )}

        {currentTab === 'hymns' && (
          <ScreenHymns
            initialHymnId={selectedHymnRef}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
          />
        )}

        {currentTab === 'biography' && (
          <ScreenBiography memorial={memorial} />
        )}

        {currentTab === 'share' && (
          <ScreenShare memorial={memorial} />
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <NavigationBottom
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        tributesCount={tributes.length}
      />

      {/* Program Customizer Modal */}
      <ProgramCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        memorial={memorial}
        onSave={(updated) => setMemorial(updated)}
        onReset={() => setMemorial(defaultMemorial)}
      />
    </PhoneContainer>
  );
}
