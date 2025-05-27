import { useMutation } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Language } from '@/i18n/routing';
import { createPortalSession } from '@/server/subscription/actions/create-portal-session';

export const useSubscriptionPortal = () => {
  const t = useTranslations('subscription.portal.create');
  const locale = useLocale();

  return useMutation({
    mutationFn: async () => {
      const result = await createPortalSession({
        language: locale as Language
      });

      return result.data?.url;
    },
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: (url) => {
      if (!url) {
        toast.error(t('error'));
        return;
      }

      window.location.href = url;
    }
  });
};
