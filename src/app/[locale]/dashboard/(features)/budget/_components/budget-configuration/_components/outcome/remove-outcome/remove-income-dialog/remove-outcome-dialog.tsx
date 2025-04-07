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
import { deleteOutcome } from '@/server/outcome/actions/delete-outcome';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const RemoveOutcomeDialog = ({
  outcomeId,
  isOneTime,
  children,
  onSuccess
}: {
  outcomeId: string;
  isOneTime: boolean;
  children?: React.ReactNode;
  onSuccess?: () => void;
}) => {
  const t = useTranslations('budget.outcomes.removeOutcome');
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteOutcome,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      onSuccess?.();
      setIsOpen(false);
      toast.success(message);
      revalidatePathAction(pathGenerators.budget());
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant='outline' size='sm' aria-label={t('removeButton')}>
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
          onClick={() => mutate({ outcomeId })}
          loading={isPending}
          disabled={isPending}
        >
          {t('removeButton')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
