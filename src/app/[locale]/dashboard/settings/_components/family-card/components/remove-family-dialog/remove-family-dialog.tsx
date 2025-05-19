'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
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
import { deleteFamily } from '@/server/family/actions/delete-family';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const RemoveFamilyDialog = ({
  familyId,
  isSelectedFamily
}: {
  familyId: string;
  isSelectedFamily?: boolean;
}) => {
  const t = useTranslations('settings.removeFamily');
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteFamily,
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
        <Button
          variant='destructive'
          size='iconSmall'
          aria-label={t('title')}
          data-tour={
            isSelectedFamily ? 'active-family-card-delete-button' : undefined
          }
        >
          <Trash2 className='h-3 w-3' />
        </Button>
      </DialogTrigger>
      <DialogContent
        data-tour={
          isSelectedFamily ? 'active-family-card-delete-dialog' : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <Button
          variant='destructive'
          onClick={() => mutate({ familyId })}
          loading={isPending}
          disabled={isPending}
          className='w-full'
        >
          {t('removeButton')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
