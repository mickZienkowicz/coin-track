'use client';

import { useState } from 'react';
import { ArrowDownCircle } from 'lucide-react';
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

import { AddOutcomeForm } from '../add-outcome-form';

export const AddOutcomeDialog = ({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const t = useTranslations('budget.outcomes.addOutcome');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='outline'
            data-tour='add-outcome-button'
          >
            <ArrowDownCircle className='size-4 text-red-600' />
            <span className='hidden md:inline'>{t('button')}</span>
            <span className='inline md:hidden'>{t('buttonMobile')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='add-outcome-dialog'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <AddOutcomeForm closeDialog={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
