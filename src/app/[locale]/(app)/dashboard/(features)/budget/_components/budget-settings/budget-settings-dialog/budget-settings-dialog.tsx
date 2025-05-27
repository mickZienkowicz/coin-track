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
import { cn } from '@/lib/utils';

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
        <Button
          className={cn(
            className,
            'md:h-11 md:w-auto md:px-4 md:py-2 md:has-[>svg]:px-3'
          )}
          variant='secondary'
          size='icon'
          aria-label={t('title')}
          data-tour='budget-settings'
        >
          <Cog className='h-4 w-4 md:mr-2' />
          <span className='hidden md:inline'>{t('title')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent data-tour='budget-settings-form'>
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
