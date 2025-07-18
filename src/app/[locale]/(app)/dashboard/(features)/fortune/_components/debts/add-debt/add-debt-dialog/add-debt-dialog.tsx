'use client';

import { useState } from 'react';
import { TrendingDown } from 'lucide-react';
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

import { AddDebtForm } from '../add-debt-form/add-debt-form';

export const AddDebtDialog = ({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const t = useTranslations('fortune.debts.addDebt');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='outline'
            data-tour='add-debt-dialog'
          >
            <TrendingDown className='size-4 text-red-700' />
            <span className='hidden min-[350px]:inline'>{t('button')}</span>
            <span className='inline min-[350px]:hidden'>
              {t('buttonMobile')}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='add-debt-form'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <AddDebtForm closeDialog={() => setIsOpen(false)} />{' '}
      </DialogContent>
    </Dialog>
  );
};
