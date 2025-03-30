'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { setSelectedFamily } from '@/server/family/actions/set-selected-family';

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
      variant='secondary'
      className={className}
      size='sm'
    >
      {t('familyCard.switchFamilyButton')}
    </Button>
  );
};
