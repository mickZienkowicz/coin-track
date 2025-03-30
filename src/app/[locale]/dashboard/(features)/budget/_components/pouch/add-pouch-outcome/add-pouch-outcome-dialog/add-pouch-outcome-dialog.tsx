'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
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
import type { PouchWithCurrentBudgetOccurance } from '@/server/budget/types';

import { AddPouchOutcomeForm } from '../add-pouch-outcome-form';

export const AddPouchOutcomeDialog = ({
  className,
  children,
  currency,
  pouches,
  pouchId
}: {
  className?: string;
  children?: React.ReactNode;
  currency: string;
  pouches: PouchWithCurrentBudgetOccurance[];
  pouchId?: string;
}) => {
  const t = useTranslations('budget.pouch.pouchCard.addPouchOutcome');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={className} variant='outline'>
            <Package className='size-4 text-blue-600' />
            {t('button')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <AddPouchOutcomeForm
          closeDialog={() => setIsOpen(false)}
          currency={currency}
          pouches={pouches}
          pouchId={pouchId}
        />
      </DialogContent>
    </Dialog>
  );
};
