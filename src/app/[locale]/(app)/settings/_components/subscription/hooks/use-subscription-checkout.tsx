import { SubscriptionPlan } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Language } from '@/i18n/routing';
import { createCheckoutSession } from '@/server/subscription/actions/create-checkout-session';

export const useSubscriptionCheckout = () => {
  const t = useTranslations('subscription.checkout.create');
  const locale = useLocale();

  return useMutation({
    mutationFn: async (plan: SubscriptionPlan) => {
      const result = await createCheckoutSession({
        language: locale as Language,
        plan
      });

      return result.data?.checkoutUrl;
    },
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: (checkoutUrl) => {
      if (!checkoutUrl) {
        toast.error(t('error'));
        return;
      }

      window.location.href = checkoutUrl;
    }
  });
};
