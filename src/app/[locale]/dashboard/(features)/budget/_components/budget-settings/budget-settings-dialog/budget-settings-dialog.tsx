'use client';

import { useState } from 'react';
import type { Budget } from '@prisma/client';
import { Cog } from 'lucide-react';
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

import { BudgetSettingsForm } from '../budget-settings-form';

export const BudgetSettingsDialog = ({
  className,
  budget
}: {
  className?: string;
  budget: Budget;
}) => {
  const t = useTranslations('budgetSettings');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant='secondary'>
          <Cog className='mr-2 h-4 w-4' />
          {t('title')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <BudgetSettingsForm
          closeDialog={() => setIsOpen(false)}
          budget={budget}
        />
      </DialogContent>
    </Dialog>
  );
};
