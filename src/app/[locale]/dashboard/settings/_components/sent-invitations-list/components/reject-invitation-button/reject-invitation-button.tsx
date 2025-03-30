'use client';

import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { rejectInvitation } from '@/server/invitation/actions/reject-invitation';

export const RejectInvitationButton = ({
  invitationId,
  className
}: {
  invitationId: string;
  className?: string;
}) => {
  const t = useTranslations('settings.invitations.sent');
  const { mutate, isPending } = useMutation({
    mutationFn: rejectInvitation,
    onSuccess: ({ message, success }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      toast.success(message);
    },
    onError: () => {
      toast.error(t('rejectError'));
    }
  });

  return (
    <Button
      variant='outline'
      onClick={() => mutate({ invitationId })}
      loading={isPending}
      disabled={isPending}
      className={className}
    >
      <X className='mr-1 h-4 w-4' />
      {t('reject')}
    </Button>
  );
};
