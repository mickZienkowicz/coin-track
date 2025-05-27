'use client';

import { useMutation } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { pathGenerators } from '@/lib/paths';
import { acceptInvitation } from '@/server/invitation/actions/accept-invitation';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const AcceptInvitationButton = ({
  invitationId,
  className
}: {
  invitationId: string;
  className?: string;
}) => {
  const t = useTranslations('settings.invitations.received.accept');

  const { mutate, isPending } = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: ({ message, success }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      toast.success(message);
      revalidatePathAction(pathGenerators.settings());
    },
    onError: () => {
      toast.error(t('error'));
    }
  });

  return (
    <Button
      onClick={() => mutate({ invitationId })}
      loading={isPending}
      disabled={isPending}
      className={className}
    >
      <Check className='h-4 w-4' />
      {t('button')}
    </Button>
  );
};
