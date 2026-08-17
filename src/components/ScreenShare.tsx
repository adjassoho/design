import React, { useState } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScreenShareProps {
  memorial: FuneralProfile;
  onOpenPayment?: () => void;
}

export const ScreenShare: React.FC<ScreenShareProps> = ({ memorial, onOpenPayment }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'print'>('link');

  const isEn = memorial.language === 'en';

  // Build clean dynamic shareable URL without hardcoded guest name
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://convive-obseques.app';

  const dynamicParams = new URLSearchParams({
    name: memorial.fullName,
    age: String(memorial.age),
    birth: memorial.birthYear,
    pass: memorial.passingYear,
    theme: memorial.themeColor,
  }).toString();

  const shareableDynamicUrl = `${currentUrl}?${dynamicParams}`;

  const handleCopyLink = () => {
    if (!memorial.isPaid && onOpenPayment) {
      onOpenPayment();
      return;
    }
    navigator.clipboard.writeText(shareableDynamicUrl);
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
      <div className="relative z-10 space-y-2 pb-3 border-b border-amber-500/20 text-center">
        <span className="text-[10px] font-cinzel tracking-[0.3em] text-amber-400 font-semibold uppercase">
          {isEn ? 'Distribution & Sharing' : 'Diffusion & Partage'}
        </span>
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200 uppercase">
          {isEn ? 'Share Invitation' : 'Partager le Faire-part'}
        </h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          {isEn
            ? 'Send the invitation to family and church members via WhatsApp, SMS, or print the church QR code.'
            : 'Envoyez le faire-part à vos proches via WhatsApp, SMS, ou imprimez le QR Code pour le culte.'}
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
                    ? 'Activate your official sharing link and church QR code via FedaPay (MTN, Moov, Wave, Card).'
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
                ? 'bg-amber-500 text-neutral-950 shadow font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {isEn ? 'Link & WhatsApp' : 'Lien & WhatsApp'}
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-amber-500 text-neutral-950 shadow font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {isEn ? 'Church QR Code' : 'QR Code Église'}
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'print'
                ? 'bg-amber-500 text-neutral-950 shadow font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {isEn ? 'Print / PDF' : 'Imprimer / PDF'}
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="relative z-10 flex-1 py-4 space-y-4">
        {/* 1. Shareable Dynamic Link */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <div className="bg-neutral-900 rounded-2xl p-4 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-cinzel text-sm font-bold text-amber-200">
                  {isEn ? 'Digital Invitation Link' : 'Lien d’Invitation Numérique'}
                </h3>
              </div>
              <p className="text-xs text-neutral-300">
                {isEn
                  ? 'All recipients can open the wax-sealed envelope with solemn requiem music, and see the full order of service.'
                  : 'Tous les destinataires peuvent ouvrir l’enveloppe à sceau de cire avec musique nécrologique solennelle, suivre le culte, et déposer un mot de condoléance.'}
              </p>

              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl p-2">
                <input
                  type="text"
                  readOnly
                  value={shareableDynamicUrl}
                  className="bg-transparent text-xs text-amber-300 flex-1 focus:outline-hidden font-mono truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (isEn ? 'Copied!' : 'Copié !') : (isEn ? 'Copy' : 'Copier')}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={
                  memorial.isPaid
                    ? `https://api.whatsapp.com/send?text=${encodeURIComponent(
                        isEn
                          ? `In Loving Memory of ${memorial.fullName} (${memorial.birthYear}-${memorial.passingYear}). View the Digital Memorial Program & Order of Service: ${shareableDynamicUrl}`
                          : `À la mémoire pieuse de ${memorial.fullName} (${memorial.birthYear}-${memorial.passingYear}). Faire-part d’obsèques, programme & culte : ${shareableDynamicUrl}`
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
                    ? `Please find the digital memorial program for ${memorial.fullName} at: ${shareableDynamicUrl}`
                    : `Veuillez trouver le faire-part et programme des obsèques de ${memorial.fullName} au lien suivant : ${shareableDynamicUrl}`
                )}`}
                className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Send via Email' : 'Envoyer par Email'}</span>
              </a>
            </div>
          </div>
        )}

        {/* 2. QR Code for Funeral Attendees */}
        {activeTab === 'qr' && (
          <div className="bg-neutral-900 rounded-3xl p-5 border border-amber-500/30 text-center space-y-4">
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
              <h4 className="font-cinzel text-base font-bold text-amber-200 uppercase">
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
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print QR Standee' : 'Imprimer le Chevalet QR'}</span>
            </button>
          </div>
        )}

        {/* 3. Print Ready Pamphlet */}
        {activeTab === 'print' && (
          <div className="bg-neutral-900 rounded-2xl p-4 border border-amber-500/30 space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-amber-400" />
              <h4 className="font-cinzel font-bold text-amber-200">
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
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
