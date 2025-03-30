'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserRoundX } from 'lucide-react';
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
import { leaveFamily } from '@/server/family/actions/leave-family';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const LeaveFamilyDialog = ({
  familyId,
  className
}: {
  familyId: string;
  className?: string;
}) => {
  const t = useTranslations('settings.leaveFamily');
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: leaveFamily,
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
        <Button variant='destructive' className={className}>
          <UserRoundX className='h-4 w-4' />
          {t('title')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <Button
          variant='destructive'
          onClick={() => mutate({ familyId })}
          loading={isPending}
          disabled={isPending}
        >
          <UserRoundX className='h-4 w-4' />
          {t('leaveButton')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
