'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { deletePouchOutcome } from '@/server/pouch/actions/delete-pouch-outcome';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const RemovePouchOutcomeDialog = ({
  children,
  pouchOutcomeId
}: {
  children?: React.ReactNode;
  pouchOutcomeId: string;
}) => {
  const t = useTranslations('budget.pouch.removePouchOutcome');
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deletePouchOutcome,
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
      queryClient.invalidateQueries({ queryKey: ['pouches'] });
      revalidatePathAction(pathGenerators.budget());
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant='destructive'
            size='iconSmall'
            aria-label={t('removeButton')}
          >
            <Trash2 className='size-4' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Button
          variant='destructive'
          className='w-full'
          onClick={() => mutate({ pouchOutcomeId })}
          loading={isPending}
          disabled={isPending}
        >
          {t('removeButton')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
