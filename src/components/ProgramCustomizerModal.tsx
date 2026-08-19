import React, { useState } from 'react';
import {
  FuneralProfile,
  ThemeColor,
  LifeMilestone,
  OrderOfServiceItem,
  FamilyContact,
} from '../types';
import {
  defaultMilestones,
  defaultOrderOfService,
  defaultBackgroundTemplates,
} from '../data/defaultMemorial';
import {
  Sliders,
  X,
  Check,
  Upload,
  RefreshCw,
  Sparkles,
  MapPin,
  BookOpen,
  Shirt,
  Palette,
  Globe,
  User,
  Heart,
  Calendar,
  Clock,
  Plus,
  Trash2,
  ListOrdered,
  FileText,
  Church,
  Phone,
  ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getThemeStyles } from '../utils/themeStyles';
import { InteractiveLocationPicker } from './InteractiveLocationPicker';

interface ProgramCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  memorial: FuneralProfile;
  onSave: (updated: FuneralProfile) => void;
  onReset: () => void;
}

type CustomizerTab =
  | 'identity'
  | 'ceremonies'
  | 'faith'
  | 'biography'
  | 'orderOfService'
  | 'family'
  | 'appearance';

export const ProgramCustomizerModal: React.FC<ProgramCustomizerModalProps> = ({
  isOpen,
  onClose,
  memorial,
  onSave,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('identity');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const theme = getThemeStyles(memorial.themeColor);

  if (!isOpen) return null;

  const formData: FuneralProfile = {
    ...memorial,
    language: memorial.language || 'fr',
    milestones: memorial.milestones && memorial.milestones.length > 0 ? memorial.milestones : defaultMilestones,
    orderOfService: memorial.orderOfService && memorial.orderOfService.length > 0 ? memorial.orderOfService : defaultOrderOfService,
    familyContacts: memorial.familyContacts || [
      { name: 'Mme Rose Oyenuga', phone: '+229 97 40 12 34', role: 'Épouse du défunt' },
      { name: 'Dr. Samuel Oyenuga', phone: '+229 96 11 22 33', role: 'Fils & Coordination Obsèques' },
      { name: 'Grace Oyenuga-Adeyemi', phone: '+229 95 88 99 00', role: 'Fille aînée' },
    ],
    biography: memorial.biography || {
      earlyLifeTitle: 'Enfance, Racines & Formation',
      earlyLifeText: 'Né au sein d’une famille attachée aux valeurs d’intégrité, de travail et de piété, il a grandi avec une soif constante de savoir et de droiture.',
      careerTitle: 'Carrière Professionnelle & Impact',
      careerText: 'Tout au long d’une carrière exemplaire de plus de trois décennies, il a incarné la rigueur, l’équité et la probité.',
      faithTitle: 'Foi en Christ & Héritage Familial',
      faithText: 'Par-dessus tout, Papa chérissait sa marche quotidienne avec le Seigneur et l’amour inconditionnel de sa famille.',
    },
  };

  // Real-time state update helper that propagates changes directly to parent memorial
  const updateFormData = (updater: Partial<FuneralProfile> | ((prev: FuneralProfile) => FuneralProfile)) => {
    const next = typeof updater === 'function' ? updater(formData) : { ...formData, ...updater };
    onSave(next);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleLanguageChange = (lang: 'fr' | 'en') => {
    if (lang === 'en') {
      updateFormData((prev) => ({
        ...prev,
        language: 'en',
        headerSuperTitle: "H E A V E N ' S   G A I N",
        mainHeadline: 'TRANSITION TO GLORY',
        sealLabel: `AGED ${prev.age} YEARS`,
        serviceOfSongs: {
          ...prev.serviceOfSongs,
          title: 'SERVICE OF SONGS & VIGIL',
        },
        funeralService: {
          ...prev.funeralService,
          title: 'FUNERAL SERVICE & BURIAL',
          lyingInState: 'Lying in State & Final Viewing: 08:30 AM',
          serviceStartTime: 'Thanksgiving & Obsequies: 10:00 AM',
        },
        intermentNote: 'Private interment in the family cemetery immediately following the church service.',
      }));
    } else {
      updateFormData((prev) => ({
        ...prev,
        language: 'fr',
        headerSuperTitle: 'R E P O S   É T E R N E L',
        mainHeadline: 'TRANSITION VERS LA GLOIRE',
        sealLabel: `ÂGÉ DE ${prev.age} ANS`,
        serviceOfSongs: {
          ...prev.serviceOfSongs,
          title: 'VEILLÉE DE PRIÈRES & CHANTS',
        },
        funeralService: {
          ...prev.funeralService,
          title: 'CULTE D’OBSÈQUES & INHUMATION',
          lyingInState: 'Levée du corps & Recueillement : 08h30',
          serviceStartTime: 'Office religieux solennel : 10h00',
        },
        intermentNote: 'Inhumation dans l’intimité familiale immédiatement après l’office religieux.',
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingPhoto(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          // Set preview immediately for fast real-time user feedback
          updateFormData((prev) => ({
            ...prev,
            portraitUrl: base64,
          }));

          // Upload to server to get a real public URL for WhatsApp vignette previews
          try {
            const res = await fetch('/api/upload-portrait', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageBase64: base64,
                mimeType: file.type || 'image/jpeg',
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.fullUrl || data.url) {
                const finalUrl =
                  data.fullUrl ||
                  (typeof window !== 'undefined'
                    ? `${window.location.origin}${data.url}`
                    : data.url);
                updateFormData((prev) => ({
                  ...prev,
                  portraitUrl: finalUrl,
                }));
              }
            }
          } catch (err) {
            console.warn('Fallback: image conservée localement', err);
          } finally {
            setIsUploadingPhoto(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingBackground(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          updateFormData((prev) => ({
            ...prev,
            backgroundUrl: base64,
          }));

          try {
            const res = await fetch('/api/upload-portrait', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageBase64: base64,
                mimeType: file.type || 'image/jpeg',
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.fullUrl || data.url) {
                const finalUrl =
                  data.fullUrl ||
                  (typeof window !== 'undefined'
                    ? `${window.location.origin}${data.url}`
                    : data.url);
                updateFormData((prev) => ({
                  ...prev,
                  backgroundUrl: finalUrl,
                }));
              }
            }
          } catch (err) {
            console.warn('Fallback: arrière-plan conservé localement', err);
          } finally {
            setIsUploadingBackground(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Milestones handlers
  const handleAddMilestone = () => {
    const newMs: LifeMilestone = {
      year: new Date().getFullYear().toString(),
      title: 'Nouvelle étape',
      description: 'Description de cette période de vie...',
    };
    updateFormData((prev) => ({
      ...prev,
      milestones: [...(prev.milestones || []), newMs],
    }));
  };

  const handleUpdateMilestone = (index: number, field: keyof LifeMilestone, value: string) => {
    updateFormData((prev) => {
      const list = [...(prev.milestones || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, milestones: list };
    });
  };

  const handleDeleteMilestone = (index: number) => {
    updateFormData((prev) => ({
      ...prev,
      milestones: (prev.milestones || []).filter((_, i) => i !== index),
    }));
  };

  // Order of service handlers
  const handleAddOrderItem = () => {
    const nextNum = (formData.orderOfService?.length || 0) + 1;
    const newItem: OrderOfServiceItem = {
      id: `ord-${Date.now()}`,
      orderNumber: nextNum,
      title: 'Nouvelle séquence du culte',
      details: 'Détails du déroulement...',
      conductedBy: 'Officiant / Chorale',
      timeEstimate: '10:00 - 10:15',
    };
    updateFormData((prev) => ({
      ...prev,
      orderOfService: [...(prev.orderOfService || []), newItem],
    }));
  };

  const handleUpdateOrderItem = (index: number, field: keyof OrderOfServiceItem, value: any) => {
    updateFormData((prev) => {
      const list = [...(prev.orderOfService || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, orderOfService: list };
    });
  };

  const handleDeleteOrderItem = (index: number) => {
    updateFormData((prev) => ({
      ...prev,
      orderOfService: (prev.orderOfService || []).filter((_, i) => i !== index),
    }));
  };

  // Family contacts handlers
  const handleAddContact = () => {
    const newContact: FamilyContact = {
      id: `cont-${Date.now()}`,
      name: 'Nouveau Contact',
      phone: '+229 00 00 00 00',
      role: 'Membre de la famille',
    };
    updateFormData((prev) => ({
      ...prev,
      familyContacts: [...(prev.familyContacts || []), newContact],
    }));
  };

  const handleUpdateContact = (index: number, field: keyof FamilyContact, value: string) => {
    updateFormData((prev) => {
      const list = [...(prev.familyContacts || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, familyContacts: list };
    });
  };

  const handleDeleteContact = (index: number) => {
    updateFormData((prev) => ({
      ...prev,
      familyContacts: (prev.familyContacts || []).filter((_, i) => i !== index),
    }));
  };

  const themeOptions: { color: ThemeColor; label: string; bg: string; border: string }[] = [
    { color: 'burgundy', label: 'Pourpre Royal', bg: 'bg-amber-950', border: 'border-amber-500' },
    { color: 'onyx', label: 'Onyx & Or Impérial', bg: 'bg-neutral-900', border: 'border-amber-400' },
    { color: 'royal-blue', label: 'Bleu Nuit Céleste', bg: 'bg-blue-950', border: 'border-sky-400' },
    { color: 'emerald', label: 'Émeraude & Espérance', bg: 'bg-emerald-950', border: 'border-emerald-400' },
    { color: 'imperial-gold', label: 'Or Sacré & Ciel', bg: 'bg-amber-900', border: 'border-amber-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className={`bg-neutral-950 border ${theme.borderColor} rounded-3xl p-4 sm:p-6 w-full max-w-3xl shadow-2xl space-y-4 max-h-[92vh] flex flex-col font-sans text-xs text-neutral-200`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${theme.badgeBg} ${theme.accentText} border ${theme.borderColor}`}>
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-cinzel text-base sm:text-lg font-bold ${theme.accentLightText}`}>
                Personnalisation Complète du Faire-part & Programme
              </h3>
              <p className="text-[11px] text-neutral-400">
                Chaque champ modifié ici est directement sauvegardé et dynamiquement appliqué à toutes les pages.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-neutral-800 shrink-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'identity'
                ? `${theme.badgeBg} ${theme.accentLightText} border ${theme.borderColor}`
                : 'text-neutral-400 hover:text-white bg-neutral-900/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Identité & Titres</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ceremonies')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ceremonies'
                ? `${theme.badgeBg} ${theme.accentLightText} border ${theme.borderColor}`
                : 'text-neutral-400 hover:text-white bg-neutral-900/50'
            }`}
          >
            <Church className="w-3.5 h-3.5" />
            <span>2. Cérémonies & Lieux</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faith')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'faith'
                ? `${theme.badgeBg} ${theme.accentLightText} border ${theme.borderColor}`
                : 'text-neutral-400 hover:text-white bg-neutral-900/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>3. Foi & Verset</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('biography')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'biography'
                ? `${theme.badgeBg} ${theme.accentLightText} border ${theme.borderColor}`
                : 'text-neutral-400 hover:text-white bg-neutral-900/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>4. Biographie & Jalons</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orderOfService')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'orderOfService'
                ? `${theme.badgeBg} ${theme.accentLightText} border ${theme.borderColor}`
                : 'text-neutral-400 hover:text-white bg-neutral-900/50'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>5. Ordre du Culte</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'family'
                ? `${theme.badgeBg} ${theme.accentLightText} border ${theme.borderColor}`
                : 'text-neutral-400 hover:text-white bg-neutral-900/50'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>6. Contacts Famille</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'appearance'
                ? `${theme.badgeBg} ${theme.accentLightText} border ${theme.borderColor}`
                : 'text-neutral-400 hover:text-white bg-neutral-900/50'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>7. Thème & Langue</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* TAB 1: IDENTITÉ & TITRES */}
          {activeTab === 'identity' && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-3">
                <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Identité du Défunt</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Nom & Prénoms complets *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => updateFormData({ fullName: e.target.value })}
                      placeholder="Ex: PETER ABIODUN OYENUGA"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-sm font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Titre / Qualité d'honneur
                    </label>
                    <input
                      type="text"
                      value={formData.honorific || ''}
                      onChange={(e) => updateFormData({ honorific: e.target.value })}
                      placeholder="Ex: Pa / Doyen / Maman"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Année Naissance
                    </label>
                    <input
                      type="text"
                      value={formData.birthYear}
                      onChange={(e) => updateFormData({ birthYear: e.target.value })}
                      placeholder="1953"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Année Décès
                    </label>
                    <input
                      type="text"
                      value={formData.passingYear}
                      onChange={(e) => updateFormData({ passingYear: e.target.value })}
                      placeholder="2024"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Âge (Années)
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateFormData({
                          age: val,
                          sealLabel: formData.language === 'en' ? `AGED ${val} YEARS` : `ÂGÉ DE ${val} ANS`,
                        });
                      }}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Texte du Sceau
                    </label>
                    <input
                      type="text"
                      value={formData.sealLabel}
                      onChange={(e) => updateFormData({ sealLabel: e.target.value })}
                      placeholder="ÂGÉ DE 71 ANS"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Date exacte de Naissance
                    </label>
                    <input
                      type="text"
                      value={formData.exactDateOfBirth || ''}
                      onChange={(e) => updateFormData({ exactDateOfBirth: e.target.value })}
                      placeholder="14 Août 1953"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Date exacte de Décès
                    </label>
                    <input
                      type="text"
                      value={formData.exactDateOfPassing || ''}
                      onChange={(e) => updateFormData({ exactDateOfPassing: e.target.value })}
                      placeholder="28 Décembre 2024"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Épitaphe / Hommage de synthèse (Affiché dans la biographie)
                  </label>
                  <input
                    type="text"
                    value={formData.epitaph || ''}
                    onChange={(e) => updateFormData({ epitaph: e.target.value })}
                    placeholder="Époux dévoué, Père bienveillant, Grand-père chéri, Patriarche et serviteur de Dieu."
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs italic"
                  />
                </div>
              </div>

              {/* Photo Portrait */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-2.5">
                <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Photo & Portrait du Défunt</span>
                  <span className="text-[10px] text-amber-400/80 font-normal">URL directe ou Fichier local</span>
                </h4>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={formData.portraitUrl}
                      alt="Portrait Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-amber-400 shadow shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="url"
                      placeholder="Collez une URL d'image HTTPS..."
                      value={formData.portraitUrl.startsWith('data:') ? '' : formData.portraitUrl}
                      onChange={(e) => updateFormData({ portraitUrl: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-white focus:border-amber-400 text-xs font-mono"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-200 cursor-pointer font-medium text-[11px] border border-neutral-700">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isUploadingPhoto ? 'Génération de la vignette...' : 'Uploader depuis téléphone ou PC'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Preamble & Headlines */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-2.5">
                <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider">
                  Titres d'Annonce & En-tête
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Surtitre du haut
                    </label>
                    <input
                      type="text"
                      value={formData.headerSuperTitle}
                      onChange={(e) => updateFormData({ headerSuperTitle: e.target.value })}
                      placeholder="R E P O S   É T E R N E L"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs uppercase font-mono tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Titre principal du faire-part
                    </label>
                    <input
                      type="text"
                      value={formData.mainHeadline}
                      onChange={(e) => updateFormData({ mainHeadline: e.target.value })}
                      placeholder="TRANSITION VERS LA GLOIRE"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs uppercase font-cinzel font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Préambule d'annonce officielle
                  </label>
                  <textarea
                    rows={3}
                    value={formData.transitionPreamble}
                    onChange={(e) => updateFormData({ transitionPreamble: e.target.value })}
                    placeholder="Avec des cœurs remplis d’espérance chrétienne..."
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white focus:border-amber-400 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CÉRÉMONIES & LIEUX */}
          {activeTab === 'ceremonies' && (
            <div className="space-y-3.5">
              {/* Church & Dress code */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-2.5">
                <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Church className="w-4 h-4 text-amber-400" />
                  <span>Paroisse & Code Vestimentaire</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Église / Paroisse Officiante
                    </label>
                    <input
                      type="text"
                      value={formData.officiatingChurch}
                      onChange={(e) => updateFormData({ officiatingChurch: e.target.value })}
                      placeholder="Grand Temple Vine Branch Church"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Tenue Recommandée (Dress Code)
                    </label>
                    <input
                      type="text"
                      value={formData.dressCode || ''}
                      onChange={(e) => updateFormData({ dressCode: e.target.value })}
                      placeholder="Blanc pur & or ou Pagne commémoratif familial"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Service of Songs */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-2.5">
                <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider">
                  1. Veillée de Prières & Chants (Service of Songs)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Intitulé du culte</label>
                    <input
                      type="text"
                      value={formData.serviceOfSongs.title}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          serviceOfSongs: { ...prev.serviceOfSongs, title: e.target.value },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Date & Heure de la Veillée</label>
                    <input
                      type="text"
                      value={formData.serviceOfSongs.dateTime}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          serviceOfSongs: { ...prev.serviceOfSongs, dateTime: e.target.value },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Nom de la salle / lieu</label>
                    <input
                      type="text"
                      value={formData.serviceOfSongs.venueName}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          serviceOfSongs: { ...prev.serviceOfSongs, venueName: e.target.value },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Adresse</label>
                    <input
                      type="text"
                      value={formData.serviceOfSongs.address}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          serviceOfSongs: { ...prev.serviceOfSongs, address: e.target.value },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Funeral Service */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-2.5">
                <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider">
                  2. Culte d’Obsèques & Inhumation (Funeral Service)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Intitulé du culte</label>
                    <input
                      type="text"
                      value={formData.funeralService.title}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          funeralService: { ...prev.funeralService, title: e.target.value },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">
                      Date & Heure du Culte (Décompte en direct)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.funeralService.isoDateTime ? formData.funeralService.isoDateTime.substring(0, 16) : ''}
                      onChange={(e) => {
                        const isoVal = e.target.value;
                        if (isoVal) {
                          const dateObj = new Date(isoVal);
                          const formatted = dateObj.toLocaleDateString(
                            formData.language === 'en' ? 'en-US' : 'fr-FR',
                            {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          );
                          updateFormData((prev) => ({
                            ...prev,
                            funeralService: {
                              ...prev.funeralService,
                              isoDateTime: `${isoVal}:00`,
                              dateTime: formatted,
                            },
                          }));
                        } else {
                          updateFormData((prev) => ({
                            ...prev,
                            funeralService: {
                              ...prev.funeralService,
                              isoDateTime: '',
                            },
                          }));
                        }
                      }}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Texte affiché sur le faire-part</label>
                  <input
                    type="text"
                    value={formData.funeralService.dateTime}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        funeralService: { ...prev.funeralService, dateTime: e.target.value },
                      }))
                    }
                    placeholder="Ex: Vendredi 28 Août 2026 à 10h00"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Horaire Levée du corps</label>
                    <input
                      type="text"
                      value={formData.funeralService.lyingInState || ''}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          funeralService: { ...prev.funeralService, lyingInState: e.target.value },
                        }))
                      }
                      placeholder="Levée du corps & Recueillement : 08h30"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Horaire Office religieux</label>
                    <input
                      type="text"
                      value={formData.funeralService.serviceStartTime || ''}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          funeralService: { ...prev.funeralService, serviceStartTime: e.target.value },
                        }))
                      }
                      placeholder="Office religieux solennel : 10h00"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Nom de l'église / lieu</label>
                    <input
                      type="text"
                      value={formData.funeralService.venueName}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          funeralService: { ...prev.funeralService, venueName: e.target.value },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Adresse</label>
                    <input
                      type="text"
                      value={formData.funeralService.address}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          funeralService: { ...prev.funeralService, address: e.target.value },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Interactive Map & Draggable Pin Geolocation Selector */}
                <div className="pt-2">
                  <InteractiveLocationPicker
                    latitude={formData.venueLat || formData.funeralService.latitude || 6.3654}
                    longitude={formData.venueLng || formData.funeralService.longitude || 2.4183}
                    venueName={formData.funeralService.venueName}
                    venueAddress={formData.funeralService.address}
                    language={formData.language || 'fr'}
                    themeColor={formData.themeColor}
                    onVenueNameChange={(name) => {
                      updateFormData((prev) => ({
                        ...prev,
                        funeralService: { ...prev.funeralService, venueName: name },
                      }));
                    }}
                    onLocationChange={(lat, lng, suggestedAddress) => {
                      updateFormData((prev) => ({
                        ...prev,
                        venueLat: lat,
                        venueLng: lng,
                        funeralService: {
                          ...prev.funeralService,
                          latitude: lat,
                          longitude: lng,
                          address: suggestedAddress || prev.funeralService.address,
                        },
                      }));
                    }}
                  />
                </div>
              </div>

              {/* Interment & Reception */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-2.5">
                <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider">
                  3. Inhumation & Réception
                </h4>
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Note d'Inhumation (Cimetière / Intimité)
                  </label>
                  <input
                    type="text"
                    value={formData.intermentNote}
                    onChange={(e) => updateFormData({ intermentNote: e.target.value })}
                    placeholder="Inhumation dans l’intimité familiale immédiatement après l’office religieux."
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs italic"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Lieu de Réception</label>
                    <input
                      type="text"
                      value={formData.receptionDetail?.venue || ''}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          receptionDetail: {
                            venue: e.target.value,
                            time: prev.receptionDetail?.time || 'Dès 14h30',
                            note: prev.receptionDetail?.note || 'Accueil et rafraîchissements',
                          },
                        }))
                      }
                      placeholder="The Grand Marquee Event Center"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Heure de Réception</label>
                    <input
                      type="text"
                      value={formData.receptionDetail?.time || ''}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          receptionDetail: {
                            venue: prev.receptionDetail?.venue || '',
                            time: e.target.value,
                            note: prev.receptionDetail?.note || '',
                          },
                        }))
                      }
                      placeholder="Dès 14h30"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Note / Collation</label>
                    <input
                      type="text"
                      value={formData.receptionDetail?.note || ''}
                      onChange={(e) =>
                        updateFormData((prev) => ({
                          ...prev,
                          receptionDetail: {
                            venue: prev.receptionDetail?.venue || '',
                            time: prev.receptionDetail?.time || '',
                            note: e.target.value,
                          },
                        }))
                      }
                      placeholder="Accueil fraternel & hommages"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FOI & VERSET */}
          {activeTab === 'faith' && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-3">
                <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Verset Biblique & Espérance Chrétienne</span>
                </h4>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Texte du Verset / Citation Sacrée
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bibleVerse}
                    onChange={(e) => updateFormData({ bibleVerse: e.target.value })}
                    placeholder="J’ai combattu le bon combat, j’ai achevé la course, j’ai gardé la foi..."
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white focus:border-amber-400 text-xs font-serif italic"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Référence du Verset
                  </label>
                  <input
                    type="text"
                    value={formData.verseReference}
                    onChange={(e) => updateFormData({ verseReference: e.target.value })}
                    placeholder="2 Timothée 4:7-8"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BIOGRAPHIE & JALONS */}
          {activeTab === 'biography' && (
            <div className="space-y-3.5">
              {/* Narrative Sections */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-3">
                <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Récit Biographique en 3 Sections</span>
                </h4>

                {/* Section 1 */}
                <div className="space-y-1.5 p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
                  <input
                    type="text"
                    value={formData.biography?.earlyLifeTitle || 'Enfance, Racines & Formation'}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        biography: { ...(prev.biography || { earlyLifeTitle: '', earlyLifeText: '', careerTitle: '', careerText: '', faithTitle: '', faithText: '' }), earlyLifeTitle: e.target.value },
                      }))
                    }
                    placeholder="Titre Section 1 (ex: Enfance & Formation)"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold text-xs"
                  />
                  <textarea
                    rows={3}
                    value={formData.biography?.earlyLifeText || ''}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        biography: { ...(prev.biography || { earlyLifeTitle: '', earlyLifeText: '', careerTitle: '', careerText: '', faithTitle: '', faithText: '' }), earlyLifeText: e.target.value },
                      }))
                    }
                    placeholder="Récit de l'enfance, de la jeunesse et des valeurs familiales..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-200 text-xs font-serif leading-relaxed"
                  />
                </div>

                {/* Section 2 */}
                <div className="space-y-1.5 p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
                  <input
                    type="text"
                    value={formData.biography?.careerTitle || 'Carrière Professionnelle & Impact'}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        biography: { ...(prev.biography || { earlyLifeTitle: '', earlyLifeText: '', careerTitle: '', careerText: '', faithTitle: '', faithText: '' }), careerTitle: e.target.value },
                      }))
                    }
                    placeholder="Titre Section 2 (ex: Carrière Professionnelle)"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold text-xs"
                  />
                  <textarea
                    rows={3}
                    value={formData.biography?.careerText || ''}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        biography: { ...(prev.biography || { earlyLifeTitle: '', earlyLifeText: '', careerTitle: '', careerText: '', faithTitle: '', faithText: '' }), careerText: e.target.value },
                      }))
                    }
                    placeholder="Parcours professionnel, réalisations et impact social..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-200 text-xs font-serif leading-relaxed"
                  />
                </div>

                {/* Section 3 */}
                <div className="space-y-1.5 p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
                  <input
                    type="text"
                    value={formData.biography?.faithTitle || 'Foi en Christ & Héritage Familial'}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        biography: { ...(prev.biography || { earlyLifeTitle: '', earlyLifeText: '', careerTitle: '', careerText: '', faithTitle: '', faithText: '' }), faithTitle: e.target.value },
                      }))
                    }
                    placeholder="Titre Section 3 (ex: Vie Spirituelle & Famille)"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold text-xs"
                  />
                  <textarea
                    rows={3}
                    value={formData.biography?.faithText || ''}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        biography: { ...(prev.biography || { earlyLifeTitle: '', earlyLifeText: '', careerTitle: '', careerText: '', faithTitle: '', faithText: '' }), faithText: e.target.value },
                      }))
                    }
                    placeholder="Dévotion religieuse, rôle dans l'église et héritage transmis..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-200 text-xs font-serif leading-relaxed"
                  />
                </div>
              </div>

              {/* Milestones timeline editor */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider">
                    Grandes Étapes de Vie (Timeline)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-xl flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une étape</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.milestones || []).map((ms, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 flex items-start gap-2"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={ms.year}
                            onChange={(e) => handleUpdateMilestone(idx, 'year', e.target.value)}
                            placeholder="Année (ex: 1953)"
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-amber-300 font-mono font-bold text-xs"
                          />
                          <input
                            type="text"
                            value={ms.title}
                            onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)}
                            placeholder="Titre de l'étape"
                            className="sm:col-span-2 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-white font-bold text-xs"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={ms.description}
                          onChange={(e) => handleUpdateMilestone(idx, 'description', e.target.value)}
                          placeholder="Description de cette étape..."
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-300 text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMilestone(idx)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 bg-neutral-900 rounded-lg border border-neutral-800 cursor-pointer"
                        title="Supprimer cette étape"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ORDRE DU CULTE */}
          {activeTab === 'orderOfService' && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-amber-400" />
                      <span>Séquences de l'Ordre du Culte</span>
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Personnalisez les lectures, cantiques, prédications et temps d'hommages.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddOrderItem}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-xl flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une séquence</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(formData.orderOfService || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-cinzel flex items-center justify-center shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateOrderItem(idx, 'title', e.target.value)}
                            placeholder="Titre de la séquence"
                            className="sm:col-span-2 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-white font-bold text-xs"
                          />
                          <input
                            type="text"
                            value={item.timeEstimate || ''}
                            onChange={(e) => handleUpdateOrderItem(idx, 'timeEstimate', e.target.value)}
                            placeholder="Horaire (ex: 10:00 - 10:30)"
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-amber-300 font-mono text-xs"
                          />
                        </div>
                        <input
                          type="text"
                          value={item.details || ''}
                          onChange={(e) => handleUpdateOrderItem(idx, 'details', e.target.value)}
                          placeholder="Détails (ex: Chant d'ouverture solennel, lecture du Psaume 23...)"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-neutral-300 text-xs"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={item.conductedBy || ''}
                            onChange={(e) => handleUpdateOrderItem(idx, 'conductedBy', e.target.value)}
                            placeholder="Conduit par (ex: Pasteur Officiant, Chœur...)"
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-neutral-400 text-xs"
                          />
                          <select
                            value={item.hymnRef || ''}
                            onChange={(e) => handleUpdateOrderItem(idx, 'hymnRef', e.target.value || undefined)}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-neutral-300 text-xs"
                          >
                            <option value="">-- Aucun cantique associé --</option>
                            <option value="hymn-1">Cantique 01 : Grand est Ta fidélité</option>
                            <option value="hymn-2">Cantique 02 : Mon âme est en paix</option>
                            <option value="hymn-3">Cantique 03 : Reste avec moi</option>
                            <option value="hymn-4">Cantique 04 : Mon Dieu, plus près de Toi</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrderItem(idx)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 bg-neutral-900 rounded-lg border border-neutral-800 cursor-pointer"
                        title="Supprimer cette séquence"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CONTACTS FAMILLE */}
          {activeTab === 'family' && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-amber-400" />
                      <span>Contacts & Coordination de la Famille</span>
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Numéros d'appel pour les proches, délégations et condoléances.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-xl flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter un contact</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.familyContacts || []).map((cont, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                        <input
                          type="text"
                          value={cont.name}
                          onChange={(e) => handleUpdateContact(idx, 'name', e.target.value)}
                          placeholder="Nom (ex: Dr. Samuel Oyenuga)"
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-white font-bold text-xs"
                        />
                        <input
                          type="text"
                          value={cont.phone}
                          onChange={(e) => handleUpdateContact(idx, 'phone', e.target.value)}
                          placeholder="Téléphone (+229 ...)"
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-amber-300 font-mono text-xs"
                        />
                        <input
                          type="text"
                          value={cont.role}
                          onChange={(e) => handleUpdateContact(idx, 'role', e.target.value)}
                          placeholder="Rôle (ex: Fils & Coordination)"
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-neutral-300 text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteContact(idx)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 bg-neutral-900 rounded-lg border border-neutral-800 cursor-pointer"
                        title="Supprimer ce contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: THÈME & LANGUE */}
          {activeTab === 'appearance' && (
            <div className="space-y-3.5">
              {/* Language Selector */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider">
                      Langue d'Affichage du Faire-part
                    </h4>
                  </div>
                  <span className="text-[10px] text-amber-400/80 font-medium">Par défaut : Français</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('fr')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer ${
                      formData.language !== 'en'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>🇫🇷 Français (Par défaut)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('en')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer ${
                      formData.language === 'en'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>🇬🇧 English (International)</span>
                  </button>
                </div>
              </div>

              {/* Background Template Selector */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider">
                      {formData.language === 'en' ? 'Heavenly Background Template' : 'Arrière-plan Céleste & Décor Funèbre'}
                    </h4>
                  </div>
                  <span className="text-[10px] text-amber-400/80 font-medium">
                    {defaultBackgroundTemplates.length} {formData.language === 'en' ? 'presets' : 'modèles'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  {formData.language === 'en'
                    ? 'Select a solemn background theme or upload a custom visual for the memorial.'
                    : 'Choisissez un arrière-plan céleste solennel ou téléchargez votre propre visuel pour le faire-part.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {defaultBackgroundTemplates.map((bg) => {
                    const isSelected = formData.backgroundUrl === bg.url;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => updateFormData({ backgroundUrl: bg.url })}
                        className={`relative rounded-xl border overflow-hidden text-left transition-all group cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-xl'
                            : 'border-neutral-800 hover:border-neutral-600 bg-neutral-950'
                        }`}
                      >
                        {/* Wallpaper Preview */}
                        <div className="h-24 w-full relative overflow-hidden bg-neutral-900">
                          <img
                            src={bg.url}
                            alt={formData.language === 'en' ? bg.nameEn : bg.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-amber-500 text-neutral-950 text-[9px] font-bold shadow-md flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" />
                              <span>Actif</span>
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-2 space-y-0.5 bg-neutral-950/90">
                          <div className="font-cinzel font-bold text-white text-[11px] truncate">
                            {formData.language === 'en' ? bg.nameEn : bg.name}
                          </div>
                          <div className="text-[9px] text-amber-300 font-medium truncate">
                            {formData.language === 'en' ? bg.tagEn : bg.tag}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Background Upload or Custom URL */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 rounded-xl cursor-pointer text-xs text-neutral-200 transition-all">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isUploadingBackground ? 'Téléchargement...' : 'Téléverser un fond personnalisé'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.backgroundUrl && !defaultBackgroundTemplates.some((b) => b.url === formData.backgroundUrl) && (
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Fond personnalisé actif
                    </span>
                  )}
                </div>
              </div>

              {/* Theme Color Selector */}
              <div className="p-3.5 bg-neutral-900/80 rounded-2xl border border-neutral-800 space-y-2.5">
                <h4 className="font-cinzel text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Nuancier Royal & Palette d'Obsèques</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {themeOptions.map((t) => (
                    <button
                      key={t.color}
                      type="button"
                      onClick={() => updateFormData({ themeColor: t.color })}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        formData.themeColor === t.color
                          ? `bg-neutral-900 border-amber-400 shadow-lg ring-1 ring-amber-400`
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${t.bg} border ${t.border} shadow-inner shrink-0`} />
                      <div>
                        <div className="font-cinzel font-bold text-neutral-100 text-xs">
                          {t.label}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {formData.themeColor === t.color ? '✓ Palette active' : 'Sélectionner ce thème'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold flex items-center gap-1.5 border border-neutral-800 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réinitialiser par défaut</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold border border-neutral-800 cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={handleApply}
              className={`px-5 py-2 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95`}
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer & Appliquer</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
