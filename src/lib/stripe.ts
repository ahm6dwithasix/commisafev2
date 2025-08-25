import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_your_key_here";

export const stripe = loadStripe(stripePublishableKey);

// Stripe Connect OAuth URL generator
export const getStripeConnectOAuthUrl = (
  userId: string,
  userType: "brand" | "influencer",
) => {
  const clientId =
    import.meta.env.VITE_STRIPE_CONNECT_CLIENT_ID || "ca_your_client_id";
  const redirectUri = `${window.location.origin}/stripe/callback`;
  const state = btoa(JSON.stringify({ userId, userType }));

  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
};

// Handle Stripe Connect OAuth callback
export const handleStripeConnectCallback = async (
  code: string,
  state: string,
) => {
  try {
    const decodedState = JSON.parse(atob(state));
    const response = await fetch("/api/stripe/connect/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        userId: decodedState.userId,
        userType: decodedState.userType,
      }),
    });

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Create payment intent for commission payouts
export const createPaymentIntent = async (
  amount: number,
  connectedAccountId: string,
) => {
  try {
    const response = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        connectedAccountId,
      }),
    });

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
