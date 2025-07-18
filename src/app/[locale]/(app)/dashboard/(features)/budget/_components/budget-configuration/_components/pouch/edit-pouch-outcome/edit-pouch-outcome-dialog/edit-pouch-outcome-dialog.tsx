'use client';

import { useState } from 'react';
import type { PouchExpense } from '@prisma/client';
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

import { EditPouchOutcomeForm } from '../edit-pouch-outcome-form';

export const EditPouchOutcomeDialog = ({
  children,
  pouchOutcome
}: {
  children?: React.ReactNode;
  pouchOutcome: PouchExpense;
}) => {
  const t = useTranslations('budget.pouch.pouchCard.editPouchOutcome');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant='outline'
            size='sm'
            aria-label={t('button')}
            data-tour='edit-pouch-card-outcome-button'
          >
            <Pencil className='size-4' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='edit-pouch-card-outcome-form'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditPouchOutcomeForm
          closeDialog={() => setIsOpen(false)}
          pouchOutcome={pouchOutcome}
        />
      </DialogContent>
    </Dialog>
  );
};
