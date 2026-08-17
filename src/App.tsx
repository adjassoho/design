import React, { useState, useEffect } from 'react';
import {
  FuneralProfile,
  GuestItem,
  TributeItem,
  PhotoMemory,
  ThemeColor,
  RsvpSubmission,
} from './types';
import {
  defaultMemorial,
  defaultGuests,
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
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { GuestWaxSealEnvelope } from './components/GuestWaxSealEnvelope';
import { FedaPayCheckoutModal } from './components/FedaPayCheckoutModal';
import { GuestRsvpModal } from './components/GuestRsvpModal';
import { ProgramCustomizerModal } from './components/ProgramCustomizerModal';
import { PaymentReminderPopup } from './components/PaymentReminderPopup';
import {
  toggleMemorialAudio,
  stopMemorialAudio,
  startMemorialAudio,
} from './utils/audioChime';
import confetti from 'canvas-confetti';

export default function App() {
  const [memorial, setMemorial] = useState<FuneralProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('convive_memorial');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return defaultMemorial;
  });

  const [guests, setGuests] = useState<GuestItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('convive_guests');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return defaultGuests;
  });

  const [tributes, setTributes] = useState<TributeItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('convive_tributes');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return defaultTributes;
  });

  const [photos, setPhotos] = useState<PhotoMemory[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('convive_photos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return defaultPhotos;
  });
  const [currentTab, setCurrentTab] = useState<TabType>('program');
  const [selectedHymnRef, setSelectedHymnRef] = useState<string | undefined>(undefined);

  // Modals & UI States
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Guest envelope & link detection
  const [activeGuest, setActiveGuest] = useState<GuestItem | null>(null);
  const [isCollectiveGuest, setIsCollectiveGuest] = useState(false);
  const [hasBrokenSeal, setHasBrokenSeal] = useState(true); // default true for organizer preview
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('convive_memorial', JSON.stringify(memorial));
    }
  }, [memorial]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('convive_guests', JSON.stringify(guests));
    }
  }, [guests]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('convive_tributes', JSON.stringify(tributes));
    }
  }, [tributes]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('convive_photos', JSON.stringify(photos));
    }
  }, [photos]);

  // Periodic Reminder Popup for the 500 FCFA FedaPay payment before sharing
  useEffect(() => {
    if (memorial.isPaid || isGuestMode) return;

    // First reminder after 20 seconds of editing
    const initialTimer = setTimeout(() => {
      if (!memorial.isPaid && !isGuestMode) {
        setIsReminderOpen(true);
      }
    }, 20000);

    // Periodic reminder every 75 seconds
    const intervalTimer = setInterval(() => {
      if (!memorial.isPaid && !isGuestMode) {
        setIsReminderOpen(true);
      }
    }, 75000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [memorial.isPaid, isGuestMode]);

  // Check URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const guestSlug = searchParams.get('guest');
      const collectiveParam = searchParams.get('collective');
      const statusParam = searchParams.get('status');
      const txIdParam = searchParams.get('id') || searchParams.get('transaction_id');
      const langParam = searchParams.get('lang');

      if (langParam === 'en' || langParam === 'fr') {
        setMemorial((prev) => ({ ...prev, language: langParam as 'fr' | 'en' }));
      }

      // 1. Detect if returning from approved FedaPay transaction
      if (statusParam === 'approved' || searchParams.get('payment') === 'success') {
        setMemorial((prev) => ({
          ...prev,
          isPaid: true,
          paymentDetails: {
            transactionId: txIdParam ? Number(txIdParam) : Date.now(),
            amount: 500,
            currency: 'XOF',
            status: 'approved',
            paidAt: new Date().toISOString(),
          },
        }));

        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#f59e0b', '#10b981'],
          });
        } catch (e) {}
      }

      // 2. Detect Guest Personal or General link
      if (guestSlug) {
        const found = defaultGuests.find((g) => g.slug === guestSlug) || {
          id: `guest-custom-${Date.now()}`,
          cardId: memorial.id,
          displayName: decodeURIComponent(guestSlug.replace(/-/g, ' ')),
          slug: guestSlug,
          seats: 2,
          linkKind: 'personal' as const,
          rsvpStatus: 'pending' as const,
          openCount: 1,
        };

        setActiveGuest(found);
        setIsGuestMode(true);
        setHasBrokenSeal(false);
        setGuests((prev) =>
          prev.map((g) => (g.slug === guestSlug ? { ...g, openCount: g.openCount + 1 } : g))
        );
      } else if (collectiveParam === 'true') {
        setIsCollectiveGuest(true);
        setIsGuestMode(true);
        setHasBrokenSeal(false);
      }

      // 3. Dynamic image & text overriding
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
          sealLabel:
            prev.language === 'en'
              ? `AGED ${customAge || prev.age} YEARS`
              : `ÂGÉ DE ${customAge || prev.age} ANS`,
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

  // Guest breaks wax seal -> instantly start solemn necrological music in loop!
  const handleOpenEnvelope = () => {
    setHasBrokenSeal(true);
    startMemorialAudio((playing) => {
      setIsAudioPlaying(playing);
    });
  };

  const handleToggleLanguage = () => {
    setMemorial((prev) => {
      const nextLang = prev.language === 'en' ? 'fr' : 'en';
      if (nextLang === 'en') {
        return {
          ...prev,
          language: 'en',
          headerSuperTitle: "H E A V E N ' S   G A I N",
          mainHeadline: 'TRANSITION TO GLORY',
          sealLabel: `AGED ${prev.age} YEARS`,
        };
      } else {
        return {
          ...prev,
          language: 'fr',
          headerSuperTitle: 'R E P O S   É T E R N E L',
          mainHeadline: 'TRANSITION VERS LA GLOIRE',
          sealLabel: `ÂGÉ DE ${prev.age} ANS`,
        };
      }
    });
  };

  const handleAddTribute = (newTribute: TributeItem) => {
    setTributes((prev) => [newTribute, ...prev]);
  };

  const handleAddPhoto = (newPhoto: PhotoMemory) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleAddGuest = (newGuest: Omit<GuestItem, 'id' | 'openCount' | 'rsvpStatus'>) => {
    const item: GuestItem = {
      ...newGuest,
      id: `guest-${Date.now()}`,
      openCount: 0,
      rsvpStatus: 'pending',
    };
    setGuests((prev) => [item, ...prev]);
  };

  const handleRsvpSubmission = (submission: RsvpSubmission) => {
    // 1. Update guest status
    if (submission.guestSlug) {
      setGuests((prev) =>
        prev.map((g) =>
          g.slug === submission.guestSlug
            ? {
                ...g,
                rsvpStatus: submission.status,
                rsvpSeats: submission.seats,
                condolenceMessage: submission.condolence,
              }
            : g
        )
      );
    }

    // 2. Add as public tribute if message or candle was lit
    if (submission.condolence || submission.candleLit) {
      const newTribute: TributeItem = {
        id: `trib-${Date.now()}`,
        author: submission.name,
        relationship: 'Proche / Membre de l’assemblée',
        content:
          submission.condolence ||
          `A allumé une bougie du souvenir en hommage à ${memorial.fullName}. Que son âme repose en paix.`,
        candleLit: !!submission.candleLit,
        date: 'À l’instant',
      };
      setTributes((prev) => [newTribute, ...prev]);
    }
  };

  const handlePaymentSuccess = (transactionId: number) => {
    setMemorial((prev) => ({
      ...prev,
      isPaid: true,
      paymentDetails: {
        transactionId,
        amount: 500,
        currency: 'XOF',
        status: 'approved',
        paidAt: new Date().toISOString(),
      },
    }));
    setIsPaymentModalOpen(false);
    setIsReminderOpen(false);
  };

  const handlePreviewGuestView = (guestSlug?: string) => {
    if (guestSlug) {
      const found = guests.find((g) => g.slug === guestSlug) || guests[0];
      setActiveGuest(found);
      setIsCollectiveGuest(false);
    } else {
      setActiveGuest(null);
      setIsCollectiveGuest(true);
    }
    setIsGuestMode(true);
    setHasBrokenSeal(false);
    setCurrentTab('program');
  };

  const handlePreviewCollectiveView = () => {
    setActiveGuest(null);
    setIsCollectiveGuest(true);
    setIsGuestMode(true);
    setHasBrokenSeal(false);
    setCurrentTab('program');
  };

  const handleToggleGuestMode = () => {
    if (isGuestMode) {
      setIsGuestMode(false);
      setHasBrokenSeal(true);
      setActiveGuest(null);
      setIsCollectiveGuest(false);
    } else {
      // Preview general guest view with Madame / Monsieur greeting
      handlePreviewCollectiveView();
    }
  };

  const handleOpenHymnFromOrder = (hymnRef: string) => {
    setSelectedHymnRef(hymnRef);
    setCurrentTab('hymns');
  };

  // Safe navigation handler: If in guest mode, prevent access to dashboard or share tabs
  const handleSelectTab = (tab: TabType) => {
    if (isGuestMode && (tab === 'dashboard' || tab === 'share')) {
      setCurrentTab('program');
      return;
    }
    if (tab === 'share' && !memorial.isPaid) {
      setIsReminderOpen(true);
    }
    setCurrentTab(tab);
  };

  return (
    <PhoneContainer
      onOpenCustomizer={() => setIsCustomizerOpen(true)}
      onNewMemorial={() => setIsCustomizerOpen(true)}
      onOpenPayment={() => setIsPaymentModalOpen(true)}
      title="Convive • Obsèques"
      isAudioPlaying={isAudioPlaying}
      onToggleAudio={handleToggleAudio}
      isPaid={memorial.isPaid}
      isGuestMode={isGuestMode}
      onToggleGuestMode={handleToggleGuestMode}
      language={memorial.language || 'fr'}
      onToggleLanguage={handleToggleLanguage}
    >
      {/* Wax Seal Envelope Opening Animation for Guest View */}
      {!hasBrokenSeal ? (
        <GuestWaxSealEnvelope
          guestName={activeGuest?.displayName || null}
          deceasedName={memorial.fullName}
          age={memorial.age}
          sealLabel={memorial.sealLabel}
          portraitUrl={memorial.portraitUrl}
          isCollective={isCollectiveGuest || !activeGuest}
          onOpenEnvelope={handleOpenEnvelope}
          language={memorial.language || 'fr'}
        />
      ) : (
        <div className="w-full flex-1 relative flex flex-col justify-between">
          {/* Main Screens View */}
          {currentTab === 'program' && (
            <ScreenProgram
              memorial={memorial}
              activeGuest={activeGuest}
              isCollective={isCollectiveGuest}
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onOpenRsvpModal={() => setIsRsvpModalOpen(true)}
              onLightCandle={() => handleSelectTab('tributes')}
            />
          )}

          {currentTab === 'memorial-card' && (
            <ScreenMemorialCard
              memorial={memorial}
              onBack={() => handleSelectTab('program')}
              onShare={!isGuestMode ? () => handleSelectTab('share') : undefined}
              isGuestMode={isGuestMode}
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

          {currentTab === 'dashboard' && !isGuestMode && (
            <OrganizerDashboard
              memorial={memorial}
              guests={guests}
              tributesCount={tributes.length}
              onAddGuest={handleAddGuest}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              onPreviewGuestView={handlePreviewGuestView}
              onPreviewCollectiveView={handlePreviewCollectiveView}
              onEditProgram={() => setIsCustomizerOpen(true)}
            />
          )}

          {currentTab === 'share' && !isGuestMode && (
            <ScreenShare
              memorial={memorial}
              onOpenPayment={() => setIsPaymentModalOpen(true)}
            />
          )}

          {/* Bottom Navigation Bar */}
          <NavigationBottom
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            tributesCount={tributes.length}
            isPaid={memorial.isPaid}
            isGuestMode={isGuestMode}
            language={memorial.language || 'fr'}
          />
        </div>
      )}

      {/* FedaPay Mobile Money Payment Modal */}
      <FedaPayCheckoutModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        memorial={memorial}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Periodic 500 FCFA Payment Reminder Popup */}
      <PaymentReminderPopup
        isOpen={isReminderOpen && !memorial.isPaid && !isGuestMode}
        onClose={() => setIsReminderOpen(false)}
        onOpenPayment={() => setIsPaymentModalOpen(true)}
        language={memorial.language || 'fr'}
      />

      {/* Guest RSVP & Condolences Modal */}
      <GuestRsvpModal
        isOpen={isRsvpModalOpen}
        onClose={() => setIsRsvpModalOpen(false)}
        guest={activeGuest}
        deceasedName={memorial.fullName}
        isCollective={isCollectiveGuest}
        onSubmitRsvp={handleRsvpSubmission}
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
