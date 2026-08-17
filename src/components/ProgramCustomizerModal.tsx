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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [formData, setFormData] = useState<FuneralProfile>(() => ({
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
  }));

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleLanguageChange = (lang: 'fr' | 'en') => {
    if (lang === 'en') {
      setFormData((prev) => ({
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
      setFormData((prev) => ({
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
          // Set preview immediately for fast user feedback
          setFormData((prev) => ({
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
                setFormData((prev) => ({
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

  // Milestones handlers
  const handleAddMilestone = () => {
    const newMs: LifeMilestone = {
      year: new Date().getFullYear().toString(),
      title: 'Nouvelle étape',
      description: 'Description de cette période de vie...',
    };
    setFormData((prev) => ({
      ...prev,
      milestones: [...(prev.milestones || []), newMs],
    }));
  };

  const handleUpdateMilestone = (index: number, field: keyof LifeMilestone, value: string) => {
    setFormData((prev) => {
      const list = [...(prev.milestones || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, milestones: list };
    });
  };

  const handleDeleteMilestone = (index: number) => {
    setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      orderOfService: [...(prev.orderOfService || []), newItem],
    }));
  };

  const handleUpdateOrderItem = (index: number, field: keyof OrderOfServiceItem, value: any) => {
    setFormData((prev) => {
      const list = [...(prev.orderOfService || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, orderOfService: list };
    });
  };

  const handleDeleteOrderItem = (index: number) => {
    setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      familyContacts: [...(prev.familyContacts || []), newContact],
    }));
  };

  const handleUpdateContact = (index: number, field: keyof FamilyContact, value: string) => {
    setFormData((prev) => {
      const list = [...(prev.familyContacts || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, familyContacts: list };
    });
  };

  const handleDeleteContact = (index: number) => {
    setFormData((prev) => ({
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
        className="bg-neutral-950 border border-amber-500/40 rounded-3xl p-4 sm:p-6 w-full max-w-3xl shadow-2xl space-y-4 max-h-[92vh] flex flex-col font-sans text-xs text-neutral-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-200">
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                : 'text-neutral-400 hover:text-white bg-neutral-900/50'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>7. Thème & Langue</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleApply} className="flex-1 overflow-y-auto pr-1 space-y-4">
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
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, honorific: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
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
                        setFormData({
                          ...formData,
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
                      onChange={(e) => setFormData({ ...formData, sealLabel: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, exactDateOfBirth: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, exactDateOfPassing: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, epitaph: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, portraitUrl: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, headerSuperTitle: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, mainHeadline: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, transitionPreamble: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, officiatingChurch: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
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
                        setFormData({
                          ...formData,
                          serviceOfSongs: { ...formData.serviceOfSongs, title: e.target.value },
                        })
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
                        setFormData({
                          ...formData,
                          serviceOfSongs: { ...formData.serviceOfSongs, dateTime: e.target.value },
                        })
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
                        setFormData({
                          ...formData,
                          serviceOfSongs: { ...formData.serviceOfSongs, venueName: e.target.value },
                        })
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
                        setFormData({
                          ...formData,
                          serviceOfSongs: { ...formData.serviceOfSongs, address: e.target.value },
                        })
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
                        setFormData({
                          ...formData,
                          funeralService: { ...formData.funeralService, title: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Date & Heure principale</label>
                    <input
                      type="text"
                      value={formData.funeralService.dateTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          funeralService: { ...formData.funeralService, dateTime: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Horaire Levée du corps</label>
                    <input
                      type="text"
                      value={formData.funeralService.lyingInState || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          funeralService: { ...formData.funeralService, lyingInState: e.target.value },
                        })
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
                        setFormData({
                          ...formData,
                          funeralService: { ...formData.funeralService, serviceStartTime: e.target.value },
                        })
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
                        setFormData({
                          ...formData,
                          funeralService: { ...formData.funeralService, venueName: e.target.value },
                        })
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
                        setFormData({
                          ...formData,
                          funeralService: { ...formData.funeralService, address: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
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
                    onChange={(e) => setFormData({ ...formData, intermentNote: e.target.value })}
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
                        setFormData({
                          ...formData,
                          receptionDetail: {
                            venue: e.target.value,
                            time: formData.receptionDetail?.time || 'Dès 14h30',
                            note: formData.receptionDetail?.note || 'Accueil et rafraîchissements',
                          },
                        })
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
                        setFormData({
                          ...formData,
                          receptionDetail: {
                            venue: formData.receptionDetail?.venue || '',
                            time: e.target.value,
                            note: formData.receptionDetail?.note || '',
                          },
                        })
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
                        setFormData({
                          ...formData,
                          receptionDetail: {
                            venue: formData.receptionDetail?.venue || '',
                            time: formData.receptionDetail?.time || '',
                            note: e.target.value,
                          },
                        })
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
                    onChange={(e) => setFormData({ ...formData, bibleVerse: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, verseReference: e.target.value })}
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
                      setFormData({
                        ...formData,
                        biography: { ...formData.biography, earlyLifeTitle: e.target.value },
                      })
                    }
                    placeholder="Titre Section 1 (ex: Enfance & Formation)"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold text-xs"
                  />
                  <textarea
                    rows={3}
                    value={formData.biography?.earlyLifeText || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        biography: { ...formData.biography, earlyLifeText: e.target.value },
                      })
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
                      setFormData({
                        ...formData,
                        biography: { ...formData.biography, careerTitle: e.target.value },
                      })
                    }
                    placeholder="Titre Section 2 (ex: Carrière Professionnelle)"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold text-xs"
                  />
                  <textarea
                    rows={3}
                    value={formData.biography?.careerText || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        biography: { ...formData.biography, careerText: e.target.value },
                      })
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
                      setFormData({
                        ...formData,
                        biography: { ...formData.biography, faithTitle: e.target.value },
                      })
                    }
                    placeholder="Titre Section 3 (ex: Vie Spirituelle & Famille)"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold text-xs"
                  />
                  <textarea
                    rows={3}
                    value={formData.biography?.faithText || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        biography: { ...formData.biography, faithText: e.target.value },
                      })
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
                      onClick={() => setFormData({ ...formData, themeColor: t.color })}
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
        </form>

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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
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
