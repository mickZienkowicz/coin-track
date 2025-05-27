'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart } from 'lucide-react';
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
import { getCurrentBudgetPouches } from '@/server/budget/queries/get-current-budget-pouches';
import type { PouchWithCurrentBudgetOccurance } from '@/server/budget/types';

import { AddPouchOutcomeForm } from '../add-pouch-outcome-form';

export const AddPouchOutcomeDialog = ({
  className,
  children,
  pouches,
  pouchId
}: {
  className?: string;
  children?: React.ReactNode;
  pouches?: PouchWithCurrentBudgetOccurance[];
  pouchId?: string;
}) => {
  const { data: pouchesData } = useQuery({
    queryKey: ['pouches'],
    queryFn: async () => await getCurrentBudgetPouches(),
    initialData: pouches
  });
  const t = useTranslations('budget.pouch.pouchCard.addPouchOutcome');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='outline'
            size='sm'
            data-tour='add-pouch-outcome-dialog'
          >
            <ShoppingCart className='size-4 text-blue-600' />
            {t('button')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='pouch-card-outcome-form'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <AddPouchOutcomeForm
          closeDialog={() => setIsOpen(false)}
          pouches={pouchesData ?? []}
          pouchId={pouchId}
        />
      </DialogContent>
    </Dialog>
  );
};
