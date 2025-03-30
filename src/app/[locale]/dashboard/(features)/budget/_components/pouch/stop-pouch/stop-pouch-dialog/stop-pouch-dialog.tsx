'use client';

import { useState } from 'react';
import { RecurrenceType, type Pouch } from '@prisma/client';
import { Ban } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { RemovePouchDialog } from '../../remove-pouch/remove-pouch-dialog/remove-pouch-dialog';
import { StopPouchForm } from '../stop-pouch-form';

export const StopPouchDialog = ({
  className,
  children,
  pouch
}: {
  className?: string;
  children?: React.ReactNode;
  pouch: Pouch;
}) => {
  const t = useTranslations('budget.pouch.pouchCard.stopPouch');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='outline'
            aria-label={t('stopButton')}
            size='sm'
          >
            <Ban className='size-5' />
            {t('stopButton')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('descriptionAttention')} <b>{t('descriptionAttentionStop')}</b>{' '}
            {t('descriptionAttentionStopPouch')}
          </DialogDescription>
          <DialogDescription>
            {t('descriptionDeleteTitle')}
            <RemovePouchDialog
              pouchId={pouch.id}
              isOneTime={pouch.recurrence === RecurrenceType.ONE_TIME}
            >
              <Button
                className='inline h-auto cursor-pointer p-0 text-base font-bold underline hover:bg-transparent'
                variant='ghost'
              >
                {t('descriptionDeleteButton')}
              </Button>
            </RemovePouchDialog>
            . {t('descriptionDeleteAttention')}
          </DialogDescription>
        </DialogHeader>
        <StopPouchForm closeDialog={() => setIsOpen(false)} pouch={pouch} />
      </DialogContent>
    </Dialog>
  );
};
