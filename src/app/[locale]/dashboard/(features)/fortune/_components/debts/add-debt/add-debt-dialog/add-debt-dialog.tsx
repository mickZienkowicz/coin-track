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
          <Button className={className} variant='outline'>
            <TrendingDown className='size-4 text-red-700' />
            <span className='hidden min-[350px]:inline'>{t('button')}</span>
            <span className='inline min-[350px]:hidden'>
              {t('buttonMobile')}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        {/* <AddIncomeForm closeDialog={() => setIsOpen(false)} /> */}
      </DialogContent>
    </Dialog>
  );
};
