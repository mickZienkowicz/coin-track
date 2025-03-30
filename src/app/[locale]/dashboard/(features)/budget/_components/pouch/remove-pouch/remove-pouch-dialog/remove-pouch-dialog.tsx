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
import { deletePouch } from '@/server/pouch/actions/delete-pouch';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const RemovePouchDialog = ({
  pouchId,
  children,
  isOneTime
}: {
  pouchId: string;
  isOneTime: boolean;
  children?: React.ReactNode;
}) => {
  const t = useTranslations('budget.pouch.removePouch');
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deletePouch,
    onError: () => {
      toast.error('Coś poszło nie tak.');
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      setIsOpen(false);
      toast.success(message);
      revalidatePathAction(pathGenerators.budget());
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant='outline' size='sm' aria-label='Usuń profil'>
            <Trash2 className='size-4' />
            {t('removeButton')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {isOneTime ? t('descriptionOneTime') : t('descriptionMultiple')}
          </DialogDescription>
        </DialogHeader>

        <Button
          variant='destructive'
          className='w-full'
          onClick={() => mutate({ pouchId })}
          loading={isPending}
          disabled={isPending}
        >
          {t('removeButton')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
