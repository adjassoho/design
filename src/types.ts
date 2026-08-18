export type ThemeColor = 'burgundy' | 'onyx' | 'royal-blue' | 'emerald' | 'imperial-gold';

export interface ServiceDetail {
  title: string;
  dateTime: string;
  isoDateTime?: string;
  lyingInState?: string;
  serviceStartTime?: string;
  venueName: string;
  address: string;
  latitude?: number;
  longitude?: number;
  locationMapUrl?: string;
}

export interface FuneralStep {
  id: string;
  time: string;
  title: string;
  venue: string;
  description?: string;
  icon?: string;
}

export interface BiographySection {
  earlyLifeTitle?: string;
  earlyLifeText?: string;
  careerTitle?: string;
  careerText?: string;
  faithTitle?: string;
  faithText?: string;
  narrativeSummary?: string;
}

export interface FamilyContact {
  id?: string;
  name: string;
  phone: string;
  role: string;
}

export interface FuneralProfile {
  id: string;
  headerSuperTitle: string;
  mainHeadline: string;
  transitionPreamble: string;
  fullName: string;
  honorific?: string;
  birthYear: string;
  passingYear: string;
  exactDateOfBirth?: string;
  exactDateOfPassing?: string;
  age: number;
  sealLabel: string;
  epitaph?: string;
  portraitUrl: string;
  backgroundUrl: string;
  bibleVerse: string;
  verseReference: string;
  dressCode?: string;
  familyContacts?: FamilyContact[];
  serviceOfSongs: ServiceDetail;
  funeralService: ServiceDetail;
  intermentNote: string;
  receptionDetail?: {
    venue: string;
    time: string;
    note: string;
  };
  scheduleSteps: FuneralStep[];
  biography?: BiographySection;
  milestones?: LifeMilestone[];
  orderOfService?: OrderOfServiceItem[];
  themeColor: ThemeColor;
  language?: 'fr' | 'en';
  officiatingChurch: string;
  // Geolocation destination coordinates for direct GPS routing
  venueLat: number;
  venueLng: number;
  // FedaPay status
  isPaid: boolean;
  paymentDetails?: {
    transactionId: string | number;
    reference?: string;
    amount: number;
    currency: string;
    status?: string;
    method?: string;
    paidAt: string;
    customerName?: string;
    customerPhone?: string;
  };
}

// Alias for compatibility
export type MemorialProfile = FuneralProfile;

export interface GuestItem {
  id: string;
  cardId: string;
  displayName: string; // "Aïcha Mensah", "Tonton Koffi" (null or empty for shared link)
  slug: string; // unique URL token
  seats: number; // Max seats allocated
  phone?: string;
  linkKind: 'personal' | 'shared';
  rsvpStatus: 'pending' | 'yes' | 'no';
  rsvpSeats?: number;
  rsvpAt?: string;
  condolenceMessage?: string;
  openCount: number;
  firstOpenedAt?: string;
}

export interface RsvpSubmission {
  id: string;
  guestId?: string;
  guestSlug?: string;
  name: string;
  status: 'yes' | 'no';
  seats: number;
  condolence?: string;
  candleLit?: boolean;
  createdAt: string;
}

export type TributeRelationship =
  | 'Wife / Spouse'
  | 'Children'
  | 'Grandchildren'
  | 'Siblings'
  | 'Church & Ministry'
  | 'Colleague / Friend'
  | 'Well-Wisher'
  | 'Famille'
  | 'Ami(e)'
  | string;

export interface TributeItem {
  id: string;
  author: string;
  relationship: TributeRelationship;
  content: string;
  date: string;
  candleLit: boolean;
  candleColor?: string;
  photoUrl?: string;
  location?: string;
}

export interface OrderItem {
  id: string;
  orderNumber: number;
  title: string;
  subtitle?: string;
  officiant?: string;
  hymnRef?: string;
  durationMinutes?: number;
  isCompleted?: boolean;
  timeEstimate?: string;
  details?: string;
  conductedBy?: string;
}

export type OrderOfServiceItem = OrderItem;

export interface HymnStanza {
  stanzaNumber: number;
  lines: string[];
}

export interface HymnItem {
  id: string;
  number: number | string;
  title: string;
  hymnal?: string;
  theme?: string;
  category?: string;
  hymnAuthor?: string;
  stanzas?: HymnStanza[];
  lyrics?: string[];
  chorus?: string[];
  audioChimeUrl?: string;
}

export interface PhotoMemory {
  id: string;
  url?: string;
  imageUrl?: string;
  caption: string;
  title?: string;
  year?: string;
  category: string;
}

export interface LifeMilestone {
  year: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface FuneralThemeTemplate {
  id: string;
  name: string;
  subtitle?: string;
  colorClass?: string;
  accentHex?: string;
  themeColor?: ThemeColor;
  previewBg?: string;
  tag?: string;
  primaryColor?: string;
  accentColor?: string;
  description?: string;
  previewBadge?: string;
}

export interface FuneralBackgroundTemplate {
  id: string;
  name: string;
  nameEn: string;
  url: string;
  description: string;
  descriptionEn: string;
  tag: string;
  tagEn: string;
}
