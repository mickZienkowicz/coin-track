'use client';

import { useState } from 'react';
import { Outcome } from '@prisma/client';
import { Pencil } from 'lucide-react';
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

import { EditOutcomeForm } from '../edit-outcome-form';

export const EditOutcomeDialog = ({
  className,
  children,
  outcome,
  currency
}: {
  className?: string;
  children?: React.ReactNode;
  outcome: Outcome;
  currency: string;
}) => {
  const t = useTranslations('budget.outcomes.editOutcome');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='outline'
            size='sm'
            aria-label={t('editButton')}
          >
            <Pencil className='size-4' />
            {t('editButton')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditOutcomeForm
          closeDialog={() => setIsOpen(false)}
          outcome={outcome}
          currency={currency}
        />
      </DialogContent>
    </Dialog>
  );
};
