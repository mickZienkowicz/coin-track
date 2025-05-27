'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { pathGenerators } from '@/lib/paths';
import { rejectInvitation } from '@/server/invitation/actions/reject-invitation';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const RejectInvitationDialog = ({
  invitationId,
  className
}: {
  invitationId: string;
  className?: string;
}) => {
  const t = useTranslations('settings.invitations.received.reject');
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: rejectInvitation,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      setIsOpen(false);
      toast.success(message);
      revalidatePathAction(pathGenerators.settings());
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className={className}>
          <X className='h-4 w-4' />
          {t('button')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Button
          variant='destructive'
          onClick={() => mutate({ invitationId })}
          loading={isPending}
          disabled={isPending}
        >
          <X className='h-4 w-4' />
          {t('button')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
