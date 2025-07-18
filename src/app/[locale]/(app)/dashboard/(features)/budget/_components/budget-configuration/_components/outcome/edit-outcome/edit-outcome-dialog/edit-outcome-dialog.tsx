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
  outcome
}: {
  className?: string;
  children?: React.ReactNode;
  outcome: Outcome;
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
            data-tour='edit-outcome-button'
          >
            <Pencil className='size-4' />
            {t('editButton')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='edit-outcome-form'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditOutcomeForm
          closeDialog={() => setIsOpen(false)}
          outcome={outcome}
        />
      </DialogContent>
    </Dialog>
  );
};
