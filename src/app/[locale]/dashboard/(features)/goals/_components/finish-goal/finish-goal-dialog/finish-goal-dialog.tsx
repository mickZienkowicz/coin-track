'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Goal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { pathGenerators } from '@/lib/paths';
import { finishGoal } from '@/server/goal/actions/finish-goal';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const FinishGoalDialog = ({
  className,
  children,
  goalId
}: {
  className?: string;
  children?: React.ReactNode;
  goalId: string;
}) => {
  const t = useTranslations('goals.finishGoal');
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: finishGoal,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      setIsOpen(false);
      toast.success(message);
      revalidatePathAction(pathGenerators.goals());
    }
  });

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
        <Button
          variant='destructive'
          className='w-full'
          onClick={() => mutate({ goalId })}
          loading={isPending}
          disabled={isPending}
        >
          {t('button')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
