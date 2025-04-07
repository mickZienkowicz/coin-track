'use client';

import { useState } from 'react';
import { Goal } from 'lucide-react';
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

import { FinishGoalForm } from '../finish-goal-form';

export const FinishGoalDialog = ({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const t = useTranslations('goals.finishGoal');
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
            <Goal className='size-4' />
            <span className='hidden min-[359px]:inline'>{t('button')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <FinishGoalForm />
      </DialogContent>
    </Dialog>
  );
};
