'use client';

import { useState } from 'react';
import { RecurrenceType, type Outcome } from '@prisma/client';
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

import { RemoveOutcomeDialog } from '../../remove-outcome/remove-income-dialog';
import { StopOutcomeForm } from '../stop-outcome-form';

export const StopOutcomeDialog = ({
  className,
  children,
  outcome
}: {
  className?: string;
  children?: React.ReactNode;
  outcome: Outcome;
}) => {
  const t = useTranslations('budget.outcomes.stopOutcome');
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
            {t('descriptionAttention')} <b>{t('descriptionAttentionBold')}</b>{' '}
            {t('descriptionAttentionStop')}
          </DialogDescription>
          <DialogDescription>
            {t('descriptionDeleteTitle')}
            <RemoveOutcomeDialog
              outcomeId={outcome.id}
              isOneTime={outcome.recurrence === RecurrenceType.ONE_TIME}
            >
              <Button
                className='inline h-auto cursor-pointer p-0 text-base font-bold underline hover:bg-transparent'
                variant='ghost'
              >
                {t('descriptionDeleteButton')}
              </Button>
            </RemoveOutcomeDialog>
            . {t('descriptionDeleteAttention')}
          </DialogDescription>
        </DialogHeader>
        <StopOutcomeForm
          closeDialog={() => setIsOpen(false)}
          outcome={outcome}
        />
      </DialogContent>
    </Dialog>
  );
};
