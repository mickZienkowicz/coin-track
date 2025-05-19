'use client';

import { useState } from 'react';
import { Goal } from '@prisma/client';
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

import { EditGoalForm } from '../edit-goal-form';

export const EditGoalDialog = ({
  className,
  children,
  goal
}: {
  className?: string;
  children?: React.ReactNode;
  goal: Goal;
}) => {
  const t = useTranslations('goals.editGoal');
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
            data-tour='edit-goal-button'
          >
            <Pencil className='size-4' />
            <span className='hidden min-[359px]:inline'>{t('button')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='edit-goal-form'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditGoalForm closeDialog={() => setIsOpen(false)} goal={goal} />
      </DialogContent>
    </Dialog>
  );
};
