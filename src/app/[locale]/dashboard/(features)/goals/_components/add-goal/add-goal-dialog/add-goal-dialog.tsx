'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
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

import { AddGoalForm } from '../add-goal-form';

export const AddGoalDialog = ({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const t = useTranslations('goals.addGoal');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='secondary'
            aria-label={t('button')}
            data-tour='add-goal-button'
          >
            <PlusCircle className='size-4' />
            <span className='hidden md:inline'>{t('button')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='add-goal-form'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <AddGoalForm closeDialog={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
