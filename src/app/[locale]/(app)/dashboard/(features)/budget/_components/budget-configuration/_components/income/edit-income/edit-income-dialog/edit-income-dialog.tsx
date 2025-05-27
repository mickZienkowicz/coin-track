'use client';

import { useState } from 'react';
import { Income } from '@prisma/client';
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

import { EditIncomeForm } from '../edit-income-form';

export const EditIncomeDialog = ({
  className,
  children,
  income
}: {
  className?: string;
  children?: React.ReactNode;
  income: Income;
}) => {
  const t = useTranslations('budget.incomes.editIncome');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='outline'
            size='sm'
            aria-label={t('editIncomeButton')}
            data-tour='edit-income-button'
          >
            <Pencil className='size-4' />
            {t('editIncomeButton')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='edit-income-form'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditIncomeForm closeDialog={() => setIsOpen(false)} income={income} />
      </DialogContent>
    </Dialog>
  );
};
