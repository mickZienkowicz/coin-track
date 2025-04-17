'use client';

import { useState } from 'react';
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

import { EditGoalOutcomeForm } from '../edit-goal-outcome-form';

export const EditGoalOutcomeDialog = ({
  className,
  children,
  outcomeId,
  valueCents
}: {
  className?: string;
  children?: React.ReactNode;
  outcomeId: string;
  valueCents: number;
}) => {
  const t = useTranslations('goals.editGoalOutcome');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='outline'
            size='sm'
            aria-label={t('button')}
          >
            <Pencil className='size-4' />
            <span className='hidden md:inline'>{t('button')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditGoalOutcomeForm
          closeDialog={() => setIsOpen(false)}
          outcomeId={outcomeId}
          valueCents={valueCents}
        />
      </DialogContent>
    </Dialog>
  );
};
