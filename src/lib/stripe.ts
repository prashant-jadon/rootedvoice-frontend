import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = async (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key not found');
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export const confirmPaymentIntent = async (
  clientSecret: string,
  paymentMethod?: any
): Promise<{ success: boolean; error?: string }> => {
  const stripe = await getStripe();
  if (!stripe) {
    return { success: false, error: 'Stripe not initialized' };
  }

  try {
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Payment confirmation failed' };
  }
};

export const confirmPaymentIntentWithCard = async (
  clientSecret: string,
  cardElement: any
): Promise<{ success: boolean; error?: string }> => {
  const stripe = await getStripe();
  if (!stripe) {
    return { success: false, error: 'Stripe not initialized' };
  }

  try {
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Payment confirmation failed' };
  }
};

