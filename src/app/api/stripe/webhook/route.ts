import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { SubscriptionPlan } from '@prisma/client';
import Stripe from 'stripe';
import { z } from 'zod';

import { prisma } from '@/lib/prisma/prisma-client';
import { stripe, STRIPE_PLANS } from '@/lib/stripe';
import { updateSubscription } from '@/server/subscription/actions/update-subscription';

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();

  const signature = headerPayload.get('Stripe-Signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('stripe webbookevent:', event);

    if (event.type.startsWith('customer.subscription.')) {
      await updateSubscription(event.data.object as Stripe.Subscription);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const subscriptionId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id || '';
      const metadata = session.metadata;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const customerId =
        typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id || '';

      const validatedMetaData = z
        .object({
          familyId: z.string()
        })
        .parse(metadata);

      const plan =
        subscription.items.data[0].price.id === STRIPE_PLANS.MONTHLY
          ? SubscriptionPlan.MONTHLY
          : SubscriptionPlan.YEARLY;

      await prisma.subscription.upsert({
        where: {
          familyId: validatedMetaData.familyId
        },
        update: {
          status: subscription.status,
          plan: plan,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          currentPeriodStart: new Date(
            subscription.items.data[0].current_period_start * 1000
          ),
          currentPeriodEnd: new Date(
            subscription.items.data[0].current_period_end * 1000
          ),
          stripePriceId: subscription.items.data[0].price.id
        },
        create: {
          familyId: validatedMetaData.familyId,
          status: subscription.status,
          plan: plan,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          currentPeriodStart: new Date(
            subscription.items.data[0].current_period_start * 1000
          ),
          currentPeriodEnd: new Date(
            subscription.items.data[0].current_period_end * 1000
          ),
          stripePriceId: subscription.items.data[0].price.id
        }
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

export const config = {
  api: { bodyParser: false }
};
