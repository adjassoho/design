// FedaPay Integration Client Service for Convive Platform

export interface PaymentInitiationRequest {
  cardId: string;
  amount: number;
  customer: {
    firstname: string;
    lastname: string;
    email?: string;
    phone_number: {
      number: string;
      country: string;
    };
  };
  paymentMethod: 'mtn' | 'moov' | 'wave' | 'orange' | 'card' | 'standard';
}

export interface PaymentInitiationResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  paymentUrl?: string | null;
  mode?: string;
  status?: string;
  message?: string;
  error?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  status: 'approved' | 'pending' | 'declined' | 'canceled';
  transaction?: any;
  paidAt?: string;
  message?: string;
  error?: string;
}

export async function getFedaPayConfig() {
  try {
    const res = await fetch('/api/fedapay/config');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Config fetch fallback:', err);
  }
  return {
    publicKey: 'pk_sandbox_convive_demo',
    environment: 'sandbox',
    hasSecretKey: false,
    currency: 'XOF',
    launchPrice: 500,
  };
}

export async function initiateFedaPayTransaction(
  payload: PaymentInitiationRequest
): Promise<PaymentInitiationResponse> {
  try {
    const response = await fetch('/api/fedapay/create-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardId: payload.cardId,
        amount: payload.amount,
        customer: payload.customer,
        customMode: payload.paymentMethod,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Erreur initiation FedaPay:', error);
    return {
      success: false,
      error: error.message || 'Impossible de joindre la passerelle FedaPay.',
    };
  }
}

export async function verifyFedaPayTransaction(
  transactionId: string,
  simulateSuccess: boolean = false
): Promise<PaymentVerificationResponse> {
  try {
    const response = await fetch('/api/fedapay/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionId,
        simulateSuccess,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Erreur vérification FedaPay:', error);
    return {
      success: false,
      status: 'declined',
      error: error.message || 'Échec de vérification du statut.',
    };
  }
}
