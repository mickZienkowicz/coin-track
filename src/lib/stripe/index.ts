import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
  typescript: true
});

export const STRIPE_PLANS = {
  MONTHLY: process.env.STRIPE_MONTHLY_PRICE_ID!,
  YEARLY: process.env.STRIPE_YEARLY_PRICE_ID!
} as const;
