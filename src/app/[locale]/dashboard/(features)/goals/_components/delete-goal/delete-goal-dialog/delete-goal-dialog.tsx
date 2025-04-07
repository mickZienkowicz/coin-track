'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
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

import { DeleteGoalForm } from '../delete-goal-form';

export const DeleteGoalDialog = ({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const t = useTranslations('goals.deleteGoal');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='destructive'
            size='sm'
            aria-label={t('button')}
          >
            <Trash2 className='size-4' />
            <span className='hidden min-[359px]:inline'>{t('button')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <DeleteGoalForm />
      </DialogContent>
    </Dialog>
  );
};
