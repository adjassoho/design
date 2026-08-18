import React, { useState } from 'react';
import {
  FuneralProfile,
  GuestItem,
  RsvpSubmission,
} from '../types';
import {
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Share2,
  Copy,
  Plus,
  Flame,
  MessageSquare,
  Smartphone,
  Sparkles,
  Download,
  ExternalLink,
  Zap,
  Check,
  Search,
  UserPlus,
} from 'lucide-react';
import { formatWhatsAppMessage } from '../utils/geolocation';
import { getThemeStyles } from '../utils/themeStyles';

interface OrganizerDashboardProps {
  memorial: FuneralProfile;
  guests: GuestItem[];
  tributesCount: number;
  onAddGuest: (guest: Omit<GuestItem, 'id' | 'openCount' | 'rsvpStatus'>) => void;
  onOpenPaymentModal: () => void;
  onPreviewGuestView: (guestSlug: string) => void;
  onPreviewCollectiveView: () => void;
  onEditProgram: () => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  memorial,
  guests,
  tributesCount,
  onAddGuest,
  onOpenPaymentModal,
  onPreviewGuestView,
  onPreviewCollectiveView,
  onEditProgram,
}) => {
  const isEn = memorial.language === 'en';
  const theme = getThemeStyles(memorial.themeColor);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestSeats, setNewGuestSeats] = useState(1);
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'guests' | 'overview' | 'messages'>('overview');

  const personalGuests = guests.filter((g) => g.linkKind === 'personal');
  const collectiveGuest = guests.find((g) => g.linkKind === 'shared');

  const totalOpened = guests.reduce((acc, g) => acc + (g.openCount > 0 ? 1 : 0), 0);
  const confirmedYes = guests.filter((g) => g.rsvpStatus === 'yes');
  const confirmedNo = guests.filter((g) => g.rsvpStatus === 'no');
  const pendingCount = personalGuests.filter((g) => g.rsvpStatus === 'pending').length;
  const totalSeatsConfirmed = confirmedYes.reduce((acc, g) => acc + (g.rsvpSeats || g.seats || 1), 0);

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${window.location.pathname}`;
    }
    return 'https://convive.app';
  };

  const handleCopyLink = (guestSlug: string, isCollective: boolean = false) => {
    const url = isCollective
      ? `${getBaseUrl()}?collective=true`
      : `${getBaseUrl()}?guest=${encodeURIComponent(guestSlug)}`;

    navigator.clipboard.writeText(url);
    setCopiedId(guestSlug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendWhatsApp = (guest: GuestItem) => {
    const isCollective = guest.linkKind === 'shared';
    const inviteUrl = isCollective
      ? `${getBaseUrl()}?collective=true`
      : `${getBaseUrl()}?guest=${encodeURIComponent(guest.slug)}`;

    const text = formatWhatsAppMessage(
      isCollective ? null : guest.displayName,
      memorial.fullName,
      inviteUrl,
      isCollective
    );

    const whatsappUrl = guest.phone
      ? `https://api.whatsapp.com/send?phone=${guest.phone.replace(/[^0-9]/g, '')}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const slug = newGuestName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-') + `-${Math.floor(100 + Math.random() * 900)}`;

    onAddGuest({
      cardId: memorial.id,
      displayName: newGuestName.trim(),
      slug,
      seats: newGuestSeats || 1,
      phone: newGuestPhone.trim() || undefined,
      linkKind: 'personal',
    });

    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestSeats(1);
    setShowAddForm(false);
  };

  const filteredGuests = personalGuests.filter((g) =>
    g.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex-1 overflow-y-auto p-4 space-y-4 font-sans text-neutral-200">
      {/* Dashboard Top Navigation & Status */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/90 border ${theme.borderColor} rounded-3xl p-4 shadow-xl`}>
        <div className="flex items-center gap-3">
          <img
            src={memorial.portraitUrl}
            alt={memorial.fullName}
            className={`w-12 h-12 rounded-2xl object-cover border ${theme.borderColor} shadow`}
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`font-cinzel text-sm font-bold ${theme.accentLightText}`}>
                {memorial.fullName}
              </h2>
              {memorial.isPaid ? (
                <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-full text-[10px] font-bold">
                  ✓ {isEn ? 'Published' : 'Carte Publiée'}
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-500/40 text-amber-300 rounded-full text-[10px] font-bold animate-pulse">
                  {isEn ? 'Draft Mode' : 'Mode Brouillon'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              {memorial.serviceOfSongs.venueName} • {isEn ? 'Funeral Service' : 'Culte d’Obsèques'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!memorial.isPaid && (
            <button
              onClick={onOpenPaymentModal}
              className={`px-3.5 py-2 bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer`}
            >
              <Zap className="w-3.5 h-3.5 fill-neutral-950" />
              <span>{isEn ? 'Publish with FedaPay (500 F)' : 'Publier avec FedaPay (500 F)'}</span>
            </button>
          )}
          <button
            onClick={onEditProgram}
            className={`px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-200 text-xs font-semibold cursor-pointer border border-neutral-700 hover:${theme.borderColor}`}
          >
            {isEn ? 'Customize Program' : 'Modifier Faire-part'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-neutral-800 pb-1 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? `${theme.accentText} border-current`
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          {isEn ? 'Dashboard & Realtime Metrics' : 'Tableau de Bord & Métriques'}
        </button>
        <button
          onClick={() => setActiveTab('guests')}
          className={`pb-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'guests'
              ? `${theme.accentText} border-current`
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          {isEn ? `Guest Manager (${personalGuests.length})` : `Gestionnaire d'Invités (${personalGuests.length})`}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className={`bg-neutral-900 border border-neutral-800 hover:${theme.borderColor} rounded-2xl p-3 flex flex-col justify-between transition-colors`}>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {isEn ? 'Invites Sent' : 'Liens Envoyés'}
                </span>
                <Users className={`w-4 h-4 ${theme.accentText}`} />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold font-mono text-white">{personalGuests.length}</span>
                <span className="text-[10px] text-neutral-500 block">
                  {isEn ? '/ 150 included' : '/ 150 inclus'}
                </span>
              </div>
            </div>

            <div className={`bg-neutral-900 border border-neutral-800 hover:${theme.borderColor} rounded-2xl p-3 flex flex-col justify-between transition-colors`}>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {isEn ? 'Live Opens' : 'Ouvertures'}
                </span>
                <Eye className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold font-mono text-blue-300">{totalOpened}</span>
                <span className="text-[10px] text-neutral-500 block">
                  {personalGuests.length > 0
                    ? `${Math.round((totalOpened / personalGuests.length) * 100)}% ${isEn ? 'open rate' : 'de taux'}`
                    : (isEn ? 'Awaiting opens' : 'En attente')}
                </span>
              </div>
            </div>

            <div className={`bg-neutral-900 border border-neutral-800 hover:${theme.borderColor} rounded-2xl p-3 flex flex-col justify-between transition-colors`}>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {isEn ? 'RSVP Attending' : 'Présences RSVP'}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold font-mono text-emerald-300">
                  {confirmedYes.length}
                </span>
                <span className="text-[10px] text-emerald-400/80 block">
                  ~ {totalSeatsConfirmed} {isEn ? 'seats' : 'couverts'}
                </span>
              </div>
            </div>

            <div className={`bg-neutral-900 border border-neutral-800 hover:${theme.borderColor} rounded-2xl p-3 flex flex-col justify-between transition-colors`}>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {isEn ? 'Tributes Book' : 'Livre d’Hommages'}
                </span>
                <Flame className={`w-4 h-4 ${theme.accentText}`} />
              </div>
              <div className="mt-2">
                <span className={`text-2xl font-bold font-mono ${theme.accentLightText}`}>{tributesCount}</span>
                <span className="text-[10px] text-neutral-500 block">
                  {isEn ? 'Tributes & Candles' : 'Témoignages & Bougies'}
                </span>
              </div>
            </div>
          </div>

          {/* Broadcast / Mode B Section */}
          <div className={`bg-neutral-900/80 border ${theme.borderColor} rounded-2xl p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className={`w-4 h-4 ${theme.accentText}`} />
                <h3 className={`font-cinzel text-xs font-bold ${theme.accentLightText} uppercase tracking-wider`}>
                  {isEn ? 'Mode B — Public Link & WhatsApp Status' : 'Mode B — Lien Public & Statut WhatsApp'}
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-full text-[10px]">
                {isEn ? 'General Broadcast' : 'Diffusion Générale'}
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {isEn
                ? 'This unique link without a specific name is designed for WhatsApp statuses, family groups, and social posts. It displays the solemn announcement with open condolences.'
                : 'Ce lien unique sans prénom est spécialement conçu pour être partagé sur vos statuts WhatsApp, les groupes de famille et les réseaux. Il affiche l\'annonce générale avec recueil libre des condoléances.'}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-400 truncate">
                {getBaseUrl()}?collective=true
              </div>
              <button
                onClick={() => handleCopyLink('partage-famille', true)}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === 'partage-famille' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isEn ? 'Copied!' : 'Copié !'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Copy' : 'Copier'}</span>
                  </>
                )}
              </button>
              <button
                onClick={() =>
                  collectiveGuest && handleSendWhatsApp(collectiveGuest)
                }
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isEn ? 'WhatsApp Status' : 'Statut WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* Quick Action Preview as Guest */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-white">
                {isEn ? 'Test the Guest Experience' : 'Tester l’expérience invité'}
              </p>
              <p className="text-[11px] text-neutral-400">
                {isEn
                  ? 'Preview the wax seal breaking, solemn hymn playback, and order of service.'
                  : 'Visualisez l’ouverture du sceau de cire et l\'itinéraire comme un invité.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPreviewGuestView('aicha-m')}
                className={`px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 ${theme.accentText} rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer border border-neutral-700`}
              >
                <span>{isEn ? 'Personal Preview' : 'Vue Nominative'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guests' && (
        <div className="space-y-3">
          {/* Header & Add Guest Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder={isEn ? "Search guest by name..." : "Rechercher un invité par nom..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:border-amber-400"
              />
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`px-3.5 py-2 bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isEn ? 'Add Guest' : 'Ajouter un Invité'}</span>
            </button>
          </div>

          {/* Add Guest Inline Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateGuest}
              className={`bg-neutral-900 border ${theme.borderColor} rounded-2xl p-3.5 space-y-3`}
            >
              <h4 className={`font-cinzel text-xs font-bold ${theme.accentLightText} uppercase tracking-wider`}>
                {isEn ? 'New Personalized Guest Invitation' : 'Nouvel Invité Nominatif'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    {isEn ? 'Guest Full Name *' : 'Nom & Prénom de l’invité *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? "e.g., Uncle Emmanuel & Family" : "Ex: Tonton Emmanuel & Famille"}
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    {isEn ? 'Seats' : 'Places / Couverts'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newGuestSeats}
                    onChange={(e) => setNewGuestSeats(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  {isEn ? 'WhatsApp Phone Number (optional)' : 'Numéro WhatsApp (optionnel)'}
                </label>
                <input
                  type="tel"
                  placeholder="+229 97 00 11 22"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold rounded-xl text-xs cursor-pointer shadow`}
                >
                  {isEn ? 'Save & Generate Link' : 'Enregistrer & Générer Lien'}
                </button>
              </div>
            </form>
          )}

          {/* Guest List Items */}
          <div className="space-y-2">
            {filteredGuests.map((guest) => (
              <div
                key={guest.id}
                className={`bg-neutral-900/90 border border-neutral-800 hover:${theme.borderColor} rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs">{guest.displayName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded">
                      {guest.seats} {isEn ? 'seat' : 'place'}{guest.seats > 1 ? 's' : ''}
                    </span>

                    {guest.rsvpStatus === 'yes' && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-full flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        {isEn ? 'Present' : 'Présent'} ({guest.rsvpSeats || guest.seats})
                      </span>
                    )}

                    {guest.rsvpStatus === 'no' && (
                      <span className="text-[10px] px-2 py-0.5 bg-red-950 border border-red-500/40 text-red-300 rounded-full flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {isEn ? 'Declined' : 'Empêché'}
                      </span>
                    )}

                    {guest.rsvpStatus === 'pending' && (
                      <span className="text-[10px] px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {isEn ? 'Pending' : 'En attente'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-blue-400" />
                      {guest.openCount} {isEn ? 'open' : 'ouverture'}{guest.openCount > 1 ? 's' : ''}
                    </span>
                    {guest.phone && (
                      <span className="font-mono text-neutral-500">{guest.phone}</span>
                    )}
                  </div>
                </div>

                {/* Actions: Copy Link, Send WhatsApp, Preview */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyLink(guest.slug)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    title={isEn ? "Copy invitation link" : "Copier le lien d'invitation"}
                  >
                    {copiedId === guest.slug ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleSendWhatsApp(guest)}
                    className="px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => onPreviewGuestView(guest.slug)}
                    className={`p-2 bg-neutral-800 hover:bg-neutral-700 ${theme.accentText} rounded-xl text-xs cursor-pointer`}
                    title={isEn ? "Preview what guest sees" : "Aperçu de ce que voit l'invité"}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
