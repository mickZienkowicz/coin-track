'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { pathGenerators } from '@/lib/paths';
import { setSelectedFamily } from '@/server/family/actions/set-selected-family';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const SwitchFamilyButton = ({
  familyId,
  setOptimisticSelectedFamilyId,
  className
}: {
  familyId: string;
  setOptimisticSelectedFamilyId: (familyId: string) => void;
  className?: string;
}) => {
  const t = useTranslations('settings');
  const { mutate, isPending } = useMutation({
    mutationFn: setSelectedFamily,
    onError: () => {
      toast.error(t('familyCard.switchFamilyDefaultError'));
    },
    onSuccess: async () => {
      await revalidatePathAction(pathGenerators.dashboard(), 'layout');
    }
  });

  return (
    <Button
      disabled={isPending}
      loading={isPending}
      onClick={async () => {
        await mutate({ familyId });
        setOptimisticSelectedFamilyId(familyId);
      }}
      variant='outline'
      className={className}
      size='sm'
    >
      {t('familyCard.switchFamilyButton')}
    </Button>
  );
};
