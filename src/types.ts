export type ThemeColor = 'burgundy' | 'onyx' | 'royal-blue' | 'emerald' | 'imperial-gold';

export interface ServiceDetail {
  title: string;
  dateTime: string;
  lyingInState?: string;
  serviceStartTime?: string;
  venueName: string;
  address: string;
  locationMapUrl?: string;
}

export interface MemorialProfile {
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
  portraitUrl: string;
  backgroundUrl: string;
  serviceOfSongs: ServiceDetail;
  funeralService: ServiceDetail;
  intermentNote: string;
  receptionDetail?: {
    venue: string;
    time: string;
    note: string;
  };
  themeColor: ThemeColor;
  officiatingChurch: string;
}

export interface TributeItem {
  id: string;
  author: string;
  relationship: 'Wife / Spouse' | 'Children' | 'Grandchildren' | 'Siblings' | 'Church & Ministry' | 'Colleague / Friend' | 'Well-Wisher';
  content: string;
  date: string;
  candleLit: boolean;
  candleColor?: string;
  photoUrl?: string;
  location?: string;
}

export interface PhotoMemory {
  id: string;
  title: string;
  caption: string;
  category: 'Celebration' | 'Family' | 'Youth & Milestones' | 'Service & Faith';
  year?: string;
  imageUrl: string;
}

export interface OrderOfServiceItem {
  id: string;
  orderNumber: number;
  timeEstimate?: string;
  title: string;
  conductedBy?: string;
  details?: string;
  hymnRef?: string;
}

export interface HymnItem {
  id: string;
  number: string;
  title: string;
  lyrics: string[];
  hymnAuthor?: string;
  category?: string;
}

export interface LifeMilestone {
  year: string;
  title: string;
  description: string;
  iconName?: string;
}
