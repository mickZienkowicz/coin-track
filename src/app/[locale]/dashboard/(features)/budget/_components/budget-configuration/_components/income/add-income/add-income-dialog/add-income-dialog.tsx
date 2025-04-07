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
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const t = useTranslations('budget.incomes.addIncome');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={className} variant='outline'>
            <ArrowUpCircle className='size-4 text-green-600' />
            <span className='hidden md:inline'>{t('button')}</span>
            <span className='inline md:hidden'>{t('buttonMobile')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <AddIncomeForm closeDialog={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
