'use client';

import { useState } from 'react';
import { Income } from '@prisma/client';
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

import { RemoveIncomeDialog } from '../../remove-income/remove-income-dialog';
import { StopIncomeForm } from '../stop-income-form';

export const StopIncomeDialog = ({
  className,
  children,
  income
}: {
  className?: string;
  children?: React.ReactNode;
  income: Income;
}) => {
  const t = useTranslations('budget.incomes.stopIncome');
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
            <RemoveIncomeDialog incomeId={income.id}>
              <Button
                className='inline h-auto cursor-pointer p-0 text-base font-bold underline hover:bg-transparent'
                variant='ghost'
              >
                {t('descriptionDeleteButton')}
              </Button>
            </RemoveIncomeDialog>
            . {t('descriptionDeleteAttention')}
          </DialogDescription>
        </DialogHeader>
        <StopIncomeForm closeDialog={() => setIsOpen(false)} income={income} />
      </DialogContent>
    </Dialog>
  );
};
