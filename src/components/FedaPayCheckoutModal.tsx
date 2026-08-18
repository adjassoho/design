import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  Smartphone,
  CheckCircle,
  X,
  Lock,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  Phone,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  initiateFedaPayTransaction,
  verifyFedaPayTransaction,
  getFedaPayConfig,
  PaymentInitiationRequest,
} from '../utils/fedapay';
import { ThemeColor } from '../types';
import { getThemeStyles } from '../utils/themeStyles';

interface FedaPayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardId: string;
  deceasedName: string;
  onPaymentSuccess: (paymentInfo: {
    transactionId: string;
    reference: string;
    amount: number;
    method: string;
    paidAt: string;
    phone: string;
  }) => void;
  themeColor?: ThemeColor;
  language?: 'fr' | 'en';
}

type PaymentProvider = 'mtn' | 'moov' | 'wave' | 'orange' | 'card';

export const FedaPayCheckoutModal: React.FC<FedaPayCheckoutModalProps> = ({
  isOpen,
  onClose,
  cardId,
  deceasedName,
  onPaymentSuccess,
  themeColor,
  language = 'fr',
}) => {
  const theme = getThemeStyles(themeColor);
  const isEn = language === 'en';
  const [provider, setProvider] = useState<PaymentProvider>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('97123456');
  const [countryCode, setCountryCode] = useState('BJ'); // Bénin (+229)
  const [customerName, setCustomerName] = useState('Famille Organisateur');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'waiting_ussd' | 'success' | 'failed'>('form');
  const [statusMessage, setStatusMessage] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [fedapayConfig, setFedapayConfig] = useState<any>(null);

  useEffect(() => {
    getFedaPayConfig().then((cfg) => setFedapayConfig(cfg));
  }, []);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStep('waiting_ussd');
    setStatusMessage('Initiation du paiement sécurisé FedaPay Mobile Money...');

    const payload: PaymentInitiationRequest = {
      cardId,
      amount: 500, // 500 FCFA Launch price
      customer: {
        firstname: customerName.split(' ')[0] || 'Famille',
        lastname: customerName.split(' ').slice(1).join(' ') || 'Organisateur',
        email: customerEmail || 'contact@convive.bj',
        phone_number: {
          number: phoneNumber.replace(/\s+/g, ''),
          country: countryCode,
        },
      },
      paymentMethod: provider,
    };

    try {
      const res = await initiateFedaPayTransaction(payload);

      if (res.success && res.transactionId) {
        setTransactionRef(res.reference || res.transactionId);

        if (res.paymentUrl) {
          setStatusMessage('Redirection vers la passerelle sécurisée FedaPay...');
          window.open(res.paymentUrl, '_blank');
        } else {
          setStatusMessage(
            `Envoi de l'invite de validation sur votre téléphone (${getCountryPrefix(countryCode)} ${phoneNumber})...`
          );
        }

        // Simulate mobile money USSD prompt approval check (or real verify)
        setTimeout(async () => {
          setStatusMessage('Validation du débit Mobile Money en cours...');

          const verifyRes = await verifyFedaPayTransaction(res.transactionId!, true);

          if (verifyRes.success && verifyRes.status === 'approved') {
            setStep('success');
            setIsProcessing(false);
            triggerConfetti();

            const paymentData = {
              transactionId: res.transactionId!,
              reference: res.reference || `FEDAPAY-${Date.now()}`,
              amount: 500,
              method: `${provider.toUpperCase()} Mobile Money (${countryCode})`,
              paidAt: new Date().toISOString(),
              phone: `${getCountryPrefix(countryCode)} ${phoneNumber}`,
            };

            setTimeout(() => {
              onPaymentSuccess(paymentData);
            }, 1800);
          } else {
            setStep('failed');
            setIsProcessing(false);
            setStatusMessage(verifyRes.message || 'La transaction n’a pas pu être validée.');
          }
        }, 2600);
      } else {
        setStep('failed');
        setIsProcessing(false);
        setStatusMessage(res.error || 'Erreur lors de l’initiation FedaPay.');
      }
    } catch (err: any) {
      setStep('failed');
      setIsProcessing(false);
      setStatusMessage(err.message || 'Erreur de connexion FedaPay.');
    }
  };

  const getCountryPrefix = (code: string) => {
    switch (code) {
      case 'BJ':
        return '+229';
      case 'CI':
        return '+225';
      case 'TG':
        return '+228';
      case 'SN':
        return '+221';
      default:
        return '+229';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`bg-neutral-900 border-2 ${theme.borderColor} rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 text-xs font-sans text-neutral-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl ${theme.badgeBg} border ${theme.borderColor} flex items-center justify-center ${theme.accentText}`}>
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className={`font-cinzel text-sm font-bold ${theme.accentLightText}`}>
                {isEn ? 'FedaPay Payment • Publication' : 'Paiement FedaPay • Publication'}
              </h3>
              <p className="text-[10px] text-neutral-400">
                Mobile Money (MTN, Moov, Wave) & Carte Bancaire
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content based on Step */}
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handlePay}
              className="space-y-4"
            >
              {/* Product Price & Summary Box */}
              <div className={`bg-neutral-950 border ${theme.borderColor} rounded-2xl p-3.5 flex items-center justify-between`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold ${theme.accentText} tracking-wider`}>
                    {isEn ? 'Memorial Invitation Pack' : "Pack Faire-part d'Obsèques"}
                  </span>
                  <p className="text-xs text-white font-medium">
                    {isEn ? 'Animated Memorial for ' : 'Faire-part animé pour '}{deceasedName}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {isEn ? '150 personalized links + WhatsApp collective link + GPS Route' : '150 liens nominatifs + Lien collectif WhatsApp + Itinéraire GPS'}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold font-mono ${theme.accentLightText}`}>
                    500 FCFA
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 ${theme.badgeBg} border ${theme.borderColor} rounded ${theme.accentLightText}`}>
                    {isEn ? 'Launch price' : 'Prix de lancement'}
                  </span>
                </div>
              </div>

              {/* Provider Selection Tabs */}
              <div className="space-y-1.5">
                <label className="block text-[11px] text-neutral-300 font-medium">
                  {isEn ? 'Select your payment method' : 'Sélectionnez votre moyen de paiement'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProvider('mtn')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      provider === 'mtn'
                        ? `${theme.borderColor} ${theme.badgeBg} ${theme.accentLightText}`
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-yellow-400" />
                    <span className="text-[10px] font-bold">MTN MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('moov')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      provider === 'moov'
                        ? `${theme.borderColor} ${theme.badgeBg} ${theme.accentLightText}`
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-bold">Moov Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('wave')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      provider === 'wave'
                        ? `${theme.borderColor} ${theme.badgeBg} ${theme.accentLightText}`
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-bold">Wave</span>
                  </button>
                </div>
              </div>

              {/* Country & Phone Number Fields */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">{isEn ? 'Country' : 'Pays'}</label>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-2 py-2 text-white focus:border-amber-400 text-xs"
                    >
                      <option value="BJ">🇧🇯 Bénin (+229)</option>
                      <option value="CI">🇨🇮 Côte d'Ivoire (+225)</option>
                      <option value="TG">🇹🇬 Togo (+228)</option>
                      <option value="SN">🇸🇳 Sénégal (+221)</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-neutral-300 mb-1 font-medium">
                      {isEn ? 'Number ' : 'Numéro '}{provider === 'mtn' ? 'MTN' : provider === 'moov' ? 'Moov' : 'Mobile'}
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="97 00 11 22"
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-3 py-2 text-white focus:border-amber-400 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    {isEn ? "Organizer / Contact Name" : "Nom de l'organisateur / Contact"}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Famille Oyenuga"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              {/* Security & FedaPay Badge */}
              <div className="flex items-center justify-between text-[10px] text-neutral-400 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Passerelle Sécurisée FedaPay</span>
                </div>
                <span className="text-neutral-500 font-mono">Bénin • UEMOA</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 px-4 bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider font-cinzel active:scale-95 transition-all`}
              >
                <span>{isEn ? 'Pay 500 FCFA with FedaPay' : 'Payer 500 FCFA avec FedaPay'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 'waiting_ussd' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 flex flex-col items-center text-center space-y-4"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <Smartphone className="w-7 h-7 text-amber-400 absolute inset-0 m-auto animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4 className="font-cinzel text-sm font-bold text-amber-200">
                  Validation sur votre téléphone
                </h4>
                <p className="text-xs text-neutral-300 max-w-xs">{statusMessage}</p>
                <p className="text-[10px] text-neutral-500">
                  Entrez votre code secret Mobile Money sur votre écran pour autoriser le débit de 500 FCFA.
                </p>
              </div>

              <div className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-[10px] font-mono text-neutral-400">
                Réf: {transactionRef || 'FEDAPAY-PENDING'}
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 flex flex-col items-center text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-cinzel text-base font-bold text-emerald-300">
                  Paiement Confirmé avec Succès !
                </h4>
                <p className="text-xs text-neutral-300">
                  Votre faire-part d'obsèques est officiellement publié et actif pour 60 jours.
                </p>
              </div>

              <div className="w-full bg-neutral-950 border border-emerald-500/30 rounded-2xl p-3 text-left space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Montant payé:</span>
                  <span className="font-bold text-white">500 FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Moyen de paiement:</span>
                  <span className="text-amber-300 font-medium">
                    {provider.toUpperCase()} Mobile Money
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Numéro:</span>
                  <span className="text-white font-mono">{phoneNumber}</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'failed' && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 flex flex-col items-center text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="font-cinzel text-sm font-bold text-red-300">
                  Échec de la transaction
                </h4>
                <p className="text-xs text-neutral-300">{statusMessage}</p>
              </div>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="py-2 px-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Réessayer avec un autre numéro</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
