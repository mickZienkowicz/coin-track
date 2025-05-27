import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { useRouter } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';

const PARAM_NAME = 'chooseSubscription';

export const useShouldShowSubscriptionModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const showSubscriptionModal = !!searchParams.get(PARAM_NAME);

  useEffect(() => {
    if (showSubscriptionModal) {
      router.replace(pathGenerators.settings());
    }
  }, [showSubscriptionModal, router]);

  return showSubscriptionModal;
};
