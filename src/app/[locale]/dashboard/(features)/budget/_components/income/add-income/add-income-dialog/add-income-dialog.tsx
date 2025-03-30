'use client';

import { useState } from 'react';
import { ArrowUpCircle } from 'lucide-react';
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

import { AddIncomeForm } from '../add-income-form';

export const AddIncomeDialog = ({
  className,
  children,
  currency
}: {
  className?: string;
  children?: React.ReactNode;
  currency: string;
}) => {
  const t = useTranslations('budget.incomes.addIncome');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={className} variant='outline'>
            <ArrowUpCircle className='size-4 text-green-600' />
            {t('button')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <AddIncomeForm
          closeDialog={() => setIsOpen(false)}
          currency={currency}
        />
      </DialogContent>
    </Dialog>
  );
};
