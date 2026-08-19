import React, { useState, useEffect } from 'react';
import { FuneralProfile } from '../types';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Printer,
  Sparkles,
  MessageCircle,
  Mail,
  Zap,
  Lock,
  Clock,
  Calendar,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getThemeStyles } from '../utils/themeStyles';

interface ScreenShareProps {
  memorial: FuneralProfile;
  onOpenPayment?: () => void;
  onUpdateMemorial?: (updated: FuneralProfile) => void;
}

export const ScreenShare: React.FC<ScreenShareProps> = ({
  memorial,
  onOpenPayment,
  onUpdateMemorial,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'print'>('link');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedData, setPublishedData] = useState<{
    id: string;
    url: string;
    createdAt?: string;
    expiresAt?: string;
    daysRemaining?: number;
  }>({
    id: memorial.id || '',
    url: '',
    createdAt: memorial.createdAt,
    expiresAt: memorial.expiresAt,
    daysRemaining: 30,
  });

  const isEn = memorial.language === 'en';
  const theme = getThemeStyles(memorial.themeColor);

  const getBaseOrigin = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${window.location.pathname}`;
    }
    return 'https://convive-obseques.app';
  };

  // Automatically ensure the unique URL is generated & synced on mount
  useEffect(() => {
    const saveUniqueLink = async () => {
      try {
        setIsPublishing(true);
        const res = await fetch('/api/memorial/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memorial, forceNewId: false }),
        });
        const data = await res.json();
        if (data.success) {
          setPublishedData({
            id: data.id,
            url: `${getBaseOrigin()}?id=${data.id}`,
            createdAt: data.createdAt,
            expiresAt: data.expiresAt,
            daysRemaining: data.daysRemaining ?? 30,
          });
          if (onUpdateMemorial && data.memorial) {
            onUpdateMemorial(data.memorial);
          }
        }
      } catch (err) {
        console.warn('Sync server memorial error:', err);
      } finally {
        setIsPublishing(false);
      }
    };

    saveUniqueLink();
  }, [memorial.id]);

  const handleGenerateNewUniqueLink = async () => {
    try {
      setIsPublishing(true);
      const res = await fetch('/api/memorial/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memorial, forceNewId: true }),
      });
      const data = await res.json();
      if (data.success) {
        setPublishedData({
          id: data.id,
          url: `${getBaseOrigin()}?id=${data.id}`,
          createdAt: data.createdAt,
          expiresAt: data.expiresAt,
          daysRemaining: 30,
        });
        if (onUpdateMemorial && data.memorial) {
          onUpdateMemorial(data.memorial);
        }
        try {
          confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } catch (err) {
      console.error('Error generating new link:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const finalShareUrl = publishedData.url || `${getBaseOrigin()}?id=${memorial.id}`;

  const formattedExpiry = publishedData.expiresAt
    ? new Date(publishedData.expiresAt).toLocaleDateString(isEn ? 'en-US' : 'fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const handleCopyLink = () => {
    if (!memorial.isPaid && onOpenPayment) {
      onOpenPayment();
      return;
    }
    navigator.clipboard.writeText(finalShareUrl);
    setCopiedLink(true);
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!memorial.isPaid && onOpenPayment) {
      e.preventDefault();
      onOpenPayment();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between bg-neutral-950 text-neutral-100 p-4 font-sans-custom select-none pb-6">
      {/* Top Header */}
      <div className={`relative z-10 space-y-2 pb-3 border-b ${theme.borderColor} text-center`}>
        <span className={`text-[10px] font-cinzel tracking-[0.3em] ${theme.accentText} font-semibold uppercase`}>
          {isEn ? 'Distribution & Unique Links' : 'Diffusion & Liens Uniques'}
        </span>
        <h2 className={`font-cinzel text-xl sm:text-2xl font-bold ${theme.titleGradient} uppercase`}>
          {isEn ? 'Share Invitation' : 'Partager le Faire-part'}
        </h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          {isEn
            ? 'Each memorial has its own unique 30-day validity URL, ensuring complete independence when multiple people generate invitations.'
            : 'Chaque faire-part dispose de son URL unique valable 30 jours, garantissant une isolation totale même lors de générations simultanées.'}
        </p>

        {/* Payment Warning Banner if Unpaid */}
        {!memorial.isPaid && (
          <div className="bg-amber-950/80 border border-amber-500/50 rounded-2xl p-3 text-left flex items-start justify-between gap-3 shadow-md mt-2">
            <div className="flex items-start gap-2.5">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <h4 className="font-cinzel font-bold text-amber-200">
                  {isEn ? '500 FCFA Payment Required' : 'Paiement de 500 FCFA Requis'}
                </h4>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  {isEn
                    ? 'Activate your official unique link and church QR code via FedaPay (MTN, Moov, Wave, Card).'
                    : 'Réglez les 500 FCFA avec FedaPay (Mobile Money) pour activer la diffusion officielle et le QR Code.'}
                </p>
              </div>
            </div>
            {onOpenPayment && (
              <button
                onClick={onOpenPayment}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-neutral-950 font-bold text-xs rounded-xl shrink-0 cursor-pointer shadow active:scale-95"
              >
                {isEn ? 'Pay 500 F' : 'Payer 500 F'}
              </button>
            )}
          </div>
        )}

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs mt-3">
          <button
            onClick={() => setActiveTab('link')}
            className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'link'
                ? `bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 shadow font-bold`
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {isEn ? 'Unique Link' : 'Lien Unique (30j)'}
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'qr'
                ? `bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 shadow font-bold`
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {isEn ? 'Church QR Code' : 'QR Code Église'}
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'print'
                ? `bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 shadow font-bold`
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {isEn ? 'Print / PDF' : 'Imprimer / PDF'}
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="relative z-10 flex-1 py-4 space-y-4">
        {/* 1. Shareable Dynamic Unique Link */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            {/* 30-Day Validity & Unique ID Badge */}
            <div className="bg-neutral-900/90 rounded-2xl p-3.5 border border-amber-500/30 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? '30-Day Validity Period' : 'Validité de l’URL : 30 Jours'}</span>
                </div>
                <span className="text-[10px] bg-amber-950/80 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-700/60 font-mono font-bold">
                  {publishedData.daysRemaining ?? 30} {isEn ? 'days left' : 'jours restants'}
                </span>
              </div>
              <div className="text-[11px] text-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-neutral-800/80">
                <span className="text-neutral-400">
                  {isEn ? 'Expires on: ' : 'Expire le : '}
                  <strong className="text-white font-mono">{formattedExpiry || '30 jours après création'}</strong>
                </span>
                <span className="text-neutral-400 font-mono text-[10px]">
                  ID: <strong className="text-amber-300">{publishedData.id}</strong>
                </span>
              </div>
            </div>

            <div className={`bg-neutral-900 rounded-2xl p-4 border ${theme.borderColor} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className={`w-5 h-5 ${theme.accentText}`} />
                  <h3 className={`font-cinzel text-sm font-bold ${theme.accentLightText}`}>
                    {isEn ? 'Unique Digital Invitation Link' : 'URL Unique du Faire-part'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateNewUniqueLink}
                  disabled={isPublishing}
                  title={isEn ? 'Generate new unique URL' : 'Générer une nouvelle URL unique'}
                  className="p-1.5 text-neutral-400 hover:text-amber-300 bg-neutral-950 border border-neutral-800 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-all hover:border-amber-400/50"
                >
                  <RefreshCw className={`w-3 h-3 ${isPublishing ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{isEn ? 'New ID' : 'Nouveau lien'}</span>
                </button>
              </div>

              <p className="text-xs text-neutral-300">
                {isEn
                  ? 'This link is unique to your memorial. Recipients opening this URL will view exclusively your personalized tribute and program.'
                  : 'Ce lien est strictement unique à votre faire-part. Les destinataires accèdent exclusivement à votre création.'}
              </p>

              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl p-2">
                <input
                  type="text"
                  readOnly
                  value={finalShareUrl}
                  className={`bg-transparent text-xs ${theme.accentLightText} flex-1 focus:outline-hidden font-mono truncate`}
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold text-xs flex items-center gap-1 shrink-0 transition-all cursor-pointer`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (isEn ? 'Copied!' : 'Copié !') : (isEn ? 'Copy' : 'Copier')}</span>
                </button>
              </div>
            </div>

            {/* WhatsApp Simulated Bubble */}
            <div className="bg-neutral-900/90 rounded-2xl p-3.5 border border-emerald-500/30 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'WhatsApp Link Preview' : 'Aperçu sur WhatsApp'}</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                  {isEn ? 'Cover Image Active' : 'Vignette Active'}
                </span>
              </div>

              <div className="bg-[#054740] rounded-xl p-2.5 text-white max-w-sm mx-auto shadow-md border border-[#0e6358] space-y-2">
                <div className="bg-[#0b332c] rounded-lg overflow-hidden border border-[#135d50]">
                  <div className="relative w-full h-36 bg-neutral-900 overflow-hidden">
                    <img
                      src={
                        memorial.portraitUrl ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
                      }
                      alt={memorial.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] text-amber-300 font-serif font-bold">
                      Faire-part
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <h5 className="font-bold text-xs text-white truncate">
                      Faire-part • {memorial.fullName}
                    </h5>
                    <p className="text-[11px] text-neutral-300 line-clamp-2 leading-tight">
                      À la mémoire pieuse de {memorial.fullName} ({memorial.birthYear} - {memorial.passingYear}). Faire-part officiel d'obsèques, programme du culte & hommages.
                    </p>
                    <span className="text-[9px] text-neutral-400 block font-mono">
                      {typeof window !== 'undefined' ? window.location.hostname : 'faire-part.convive.bj'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#e9edef] leading-snug">
                  {isEn
                    ? `In Loving Memory of ${memorial.fullName}. Open digital invitation & order of service:`
                    : `À la mémoire pieuse de ${memorial.fullName}. Consultez le faire-part et le déroulement du culte :`}
                </p>
                <span className="text-[10px] text-[#53bdeb] underline break-all block font-mono">
                  {finalShareUrl}
                </span>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={
                  memorial.isPaid
                    ? `https://api.whatsapp.com/send?text=${encodeURIComponent(
                        isEn
                          ? `In Loving Memory of ${memorial.fullName} (${memorial.birthYear}-${memorial.passingYear}). View the Digital Memorial Program & Order of Service: ${finalShareUrl}`
                          : `À la mémoire pieuse de ${memorial.fullName} (${memorial.birthYear}-${memorial.passingYear}). Faire-part d’obsèques, programme & culte : ${finalShareUrl}`
                      )}`
                    : '#'
                }
                onClick={handleWhatsAppClick}
                target={memorial.isPaid ? '_blank' : undefined}
                rel="noreferrer"
                className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900/50 transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? 'Share on WhatsApp' : 'Partager sur WhatsApp'}</span>
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  isEn
                    ? `Celebration of Life: ${memorial.fullName}`
                    : `Faire-part d'Obsèques: ${memorial.fullName}`
                )}&body=${encodeURIComponent(
                  isEn
                    ? `Please find the digital memorial program for ${memorial.fullName} at: ${finalShareUrl}`
                    : `Veuillez trouver le faire-part et programme des obsèques de ${memorial.fullName} au lien suivant : ${finalShareUrl}`
                )}`}
                className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <Mail className={`w-4 h-4 ${theme.accentText}`} />
                <span>{isEn ? 'Send via Email' : 'Envoyer par Email'}</span>
              </a>
            </div>
          </div>
        )}

        {/* 2. QR Code for Funeral Attendees */}
        {activeTab === 'qr' && (
          <div className={`bg-neutral-900 rounded-3xl p-5 border ${theme.borderColor} text-center space-y-4`}>
            <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl border-4 border-amber-400">
              <svg viewBox="0 0 100 100" className="w-44 h-44 mx-auto fill-neutral-950">
                <rect x="5" y="5" width="28" height="28" rx="4" stroke="#000" strokeWidth="4" fill="none" />
                <rect x="11" y="11" width="16" height="16" fill="#000" />
                <rect x="67" y="5" width="28" height="28" rx="4" stroke="#000" strokeWidth="4" fill="none" />
                <rect x="73" y="11" width="16" height="16" fill="#000" />
                <rect x="5" y="67" width="28" height="28" rx="4" stroke="#000" strokeWidth="4" fill="none" />
                <rect x="11" y="73" width="16" height="16" fill="#000" />
                <rect x="38" y="10" width="8" height="8" />
                <rect x="50" y="15" width="8" height="8" />
                <rect x="38" y="26" width="8" height="8" />
                <rect x="10" y="42" width="8" height="8" />
                <rect x="22" y="48" width="8" height="8" />
                <rect x="38" y="42" width="12" height="12" fill="#8B0000" />
                <rect x="54" y="38" width="8" height="8" />
                <rect x="70" y="44" width="8" height="8" />
                <rect x="84" y="40" width="8" height="8" />
                <rect x="42" y="60" width="8" height="8" />
                <rect x="58" y="66" width="8" height="8" />
                <rect x="74" y="62" width="8" height="8" />
                <rect x="44" y="78" width="8" height="8" />
                <rect x="60" y="82" width="8" height="8" />
                <rect x="80" y="76" width="8" height="8" />
              </svg>
            </div>

            <div>
              <h4 className={`font-cinzel text-base font-bold ${theme.accentLightText} uppercase`}>
                {isEn ? 'Scan for Digital Program' : 'Scannez pour le Programme'}
              </h4>
              <p className="text-xs text-neutral-300 max-w-xs mx-auto mt-1">
                {isEn
                  ? 'Print this QR code on church entrance boards so attendees can access hymns and the order of service on their phones.'
                  : 'Placez ce QR code à l’entrée de l’église et sur les bancs pour que les fidèles suivent les cantiques et le culte.'}
              </p>
            </div>

            <button
              onClick={handlePrint}
              className={`px-4 py-2 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md`}
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print QR Standee' : 'Imprimer le Chevalet QR'}</span>
            </button>
          </div>
        )}

        {/* 3. Print Ready Pamphlet */}
        {activeTab === 'print' && (
          <div className={`bg-neutral-900 rounded-2xl p-4 border ${theme.borderColor} space-y-3 text-xs`}>
            <div className="flex items-center gap-2">
              <Printer className={`w-4 h-4 ${theme.accentText}`} />
              <h4 className={`font-cinzel font-bold ${theme.accentLightText}`}>
                {isEn ? 'Printable Livret / PDF Brochure' : 'Livret d’Obsèques & Brochure PDF'}
              </h4>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              {isEn
                ? 'Generate a clean, high-contrast, formatted pamphlet of the Obsequies, Order of Service, Hymns, and Tributes.'
                : 'Générez un document soigné haute définition prêt à imprimer pour la veillée et le culte d’enterrement.'}
            </p>

            <button
              onClick={handlePrint}
              className={`w-full py-3 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer`}
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print / Export to PDF' : 'Imprimer / Exporter en PDF'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
