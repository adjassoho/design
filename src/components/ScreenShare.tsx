import React, { useState } from 'react';
import { MemorialProfile } from '../types';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Printer,
  Code,
  Download,
  ExternalLink,
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScreenShareProps {
  memorial: MemorialProfile;
}

export const ScreenShare: React.FC<ScreenShareProps> = ({ memorial }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'html' | 'print' | 'qr'>('link');

  // Build dynamic shareable URL with parameters
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://memorial-app.run.app';
  
  const dynamicParams = new URLSearchParams({
    name: memorial.fullName,
    age: String(memorial.age),
    birth: memorial.birthYear,
    pass: memorial.passingYear,
    photo: encodeURIComponent(memorial.portraitUrl),
    theme: memorial.themeColor,
  }).toString();

  const shareableDynamicUrl = `${currentUrl}?${dynamicParams}`;

  // Dynamic HTML Embed snippet
  const htmlEmbedSnippet = `<div id="memorial-card-widget" style="max-width:400px;font-family:Georgia,serif;background:linear-gradient(180deg,#4A0E18,#20050A);color:#FFE4B5;border-radius:24px;border:2px solid #D4AF37;padding:24px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
  <div style="letter-spacing:4px;font-size:11px;color:#F5D77F;text-transform:uppercase;">${memorial.headerSuperTitle}</div>
  <h2 style="font-size:22px;color:#FFF0D0;margin:8px 0;letter-spacing:1px;">TRANSITION TO GLORY</h2>
  <img src="${memorial.portraitUrl}" alt="${memorial.fullName}" style="width:140px;height:140px;object-fit:cover;border-radius:50%;border:3px solid #D4AF37;margin:12px auto;" />
  <h3 style="font-size:20px;font-weight:bold;color:#FFFFFF;margin:6px 0;">${memorial.fullName}</h3>
  <div style="font-size:12px;color:#F5D77F;letter-spacing:2px;font-weight:bold;">${memorial.birthYear} — ${memorial.passingYear} (AGED ${memorial.age} YEARS)</div>
  <div style="border-top:1px solid rgba(212,175,55,0.3);margin-top:16px;padding-top:14px;font-size:12px;color:#FFF;">
    <strong>${memorial.funeralService.title}</strong><br/>
    ${memorial.funeralService.dateTime} • ${memorial.funeralService.venueName}
  </div>
  <a href="${shareableDynamicUrl}" target="_blank" style="display:inline-block;margin-top:14px;background:#D4AF37;color:#1A0508;padding:8px 18px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:12px;">View Full Digital Memorial</a>
</div>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableDynamicUrl);
    setCopiedLink(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlEmbedSnippet);
    setCopiedHtml(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col justify-between overflow-y-auto bg-neutral-950 text-neutral-100 p-4 font-sans-custom select-none">
      {/* Top Header */}
      <div className="relative z-10 space-y-2 pb-3 border-b border-amber-500/20 text-center">
        <span className="text-[10px] font-cinzel tracking-[0.3em] text-amber-400 font-semibold uppercase">
          Distribution & Integration
        </span>
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient uppercase">
          Share & Dynamic Links
        </h2>
        <p className="text-xs text-neutral-400">
          Share with family, generate HTML cards, or print service pamphlets.
        </p>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs mt-3">
          <button
            onClick={() => setActiveTab('link')}
            className={`py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'link' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Link
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'qr' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            QR Code
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'html' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            HTML Embed
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'print' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Print
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
                  Dynamic Memorial Program Link
                </h3>
              </div>
              <p className="text-xs text-neutral-300">
                Anyone with this link can view the digital program, light candles, sing hymns, and read tributes on any device without installing an app.
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
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1 shrink-0 transition-all"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `In Loving Memory of ${memorial.fullName} (1953-2024). View the Digital Memorial Program & Order of Service: ${shareableDynamicUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900/40 transition-all"
              >
                <span>Share on WhatsApp</span>
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `Celebration of Life: ${memorial.fullName}`
                )}&body=${encodeURIComponent(
                  `Please find the digital memorial program for ${memorial.fullName} at: ${shareableDynamicUrl}`
                )}`}
                className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all"
              >
                <span>Share via Email</span>
              </a>
            </div>
          </div>
        )}

        {/* 2. QR Code for Funeral Attendees */}
        {activeTab === 'qr' && (
          <div className="bg-neutral-900 rounded-3xl p-5 border border-amber-500/30 text-center space-y-4">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl border-4 border-amber-400">
              {/* Clean SVG QR code representation */}
              <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto fill-neutral-950">
                {/* Visual stylized QR code pattern */}
                <rect x="5" y="5" width="28" height="28" rx="4" stroke="#000" strokeWidth="4" fill="none" />
                <rect x="11" y="11" width="16" height="16" fill="#000" />
                <rect x="67" y="5" width="28" height="28" rx="4" stroke="#000" strokeWidth="4" fill="none" />
                <rect x="73" y="11" width="16" height="16" fill="#000" />
                <rect x="5" y="67" width="28" height="28" rx="4" stroke="#000" strokeWidth="4" fill="none" />
                <rect x="11" y="73" width="16" height="16" fill="#000" />
                {/* Data blocks */}
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
                Scan for Digital Program
              </h4>
              <p className="text-xs text-neutral-300 max-w-xs mx-auto mt-1">
                Print this QR code on church bulletin boards or tables for attendees to access the hymnbook and order of service.
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print QR Standee</span>
            </button>
          </div>
        )}

        {/* 3. HTML Embed Snippet */}
        {activeTab === 'html' && (
          <div className="bg-neutral-900 rounded-2xl p-4 border border-amber-500/30 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                <h4 className="font-cinzel font-bold text-amber-200">
                  Dynamic HTML Card Embed
                </h4>
              </div>
              <button
                onClick={handleCopyHtml}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHtml ? 'Copied HTML!' : 'Copy Code'}</span>
              </button>
            </div>

            <p className="text-neutral-300">
              Paste this HTML snippet into any website, blog, or memorial portal to render an interactive memorial card dynamically linked to images.
            </p>

            <pre className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-[10px] text-amber-300 font-mono overflow-x-auto max-h-40 whitespace-pre-wrap">
              {htmlEmbedSnippet}
            </pre>
          </div>
        )}

        {/* 4. Print Ready Pamphlet */}
        {activeTab === 'print' && (
          <div className="bg-neutral-900 rounded-2xl p-4 border border-amber-500/30 space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-amber-400" />
              <h4 className="font-cinzel font-bold text-amber-200">
                Printable Funeral Program Pamphlet
              </h4>
            </div>

            <p className="text-neutral-300">
              Generate a clean, high-contrast, multi-page printout of the Obsequies, Order of Service, Hymns, and Tributes formatted for standard A4/US Letter brochures.
            </p>

            <button
              onClick={handlePrint}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF Program</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
