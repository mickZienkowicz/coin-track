'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
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
import { deleteFortuneDebt } from '@/server/fortune/actions/delete-fortune-debt';
import { updateFortuneDebt } from '@/server/fortune/actions/update-fortune-debt';
import { DebtWithAdditionalInfo } from '@/server/fortune/queries/get-forune-summary';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const DeleteDebtDialog = ({
  className,
  children,
  debt
}: {
  className?: string;
  children?: React.ReactNode;
  debt: DebtWithAdditionalInfo;
}) => {
  const t = useTranslations('fortune.debts.deleteDebt');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTotalDeleteModalOpen, setIsTotalDeleteModalOpen] = useState(false);

  const { mutate: deleteDebt, isPending: isDeleting } = useMutation({
    mutationFn: deleteFortuneDebt,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      setIsTotalDeleteModalOpen(false);
      toast.success(message);
      revalidatePathAction(pathGenerators.fortune());
    }
  });

  const { mutate: updateDebt, isPending: isUpdating } = useMutation({
    mutationFn: updateFortuneDebt,
    onError: () => {
      toast.error(t('error'));
    },
    onSuccess: ({ success, message }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      setIsDeleteModalOpen(false);
      toast.success(message);
      revalidatePathAction(pathGenerators.fortune());
    }
  });

  return (
    <>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button
              className={className}
              variant='outline'
              size='sm'
              data-tour='delete-debt-dialog'
            >
              <Trash2 className='size-4' />
              <span className='hidden min-[350px]:inline'>{t('button')}</span>
              <span className='inline min-[350px]:hidden'>
                {t('buttonMobile')}
              </span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent data-tour='delete-debt-dialog-content'>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>
              {t('description')}
              <button
                className='font-bold underline'
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setIsTotalDeleteModalOpen(true);
                }}
              >
                {t('descriptionDeleteButton')}
              </button>
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-4'>
            <Button
              variant='destructive'
              className='w-full'
              onClick={() =>
                updateDebt({
                  debtId: debt.id,
                  data: {
                    name: debt.name,
                    description: debt.description,
                    valueCents: 0
                  }
                })
              }
              loading={isUpdating}
              disabled={isUpdating}
            >
              {t('deleteDebtButton')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isTotalDeleteModalOpen}
        onOpenChange={setIsTotalDeleteModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('totalDeleteTitle')}</DialogTitle>
            <DialogDescription>{t('totalDeleteDescription')}</DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-4'>
            <Button
              variant='destructive'
              className='w-full'
              onClick={() => deleteDebt({ debtId: debt.id })}
              loading={isDeleting}
              disabled={isDeleting}
            >
              {t('totalDeleteButton')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
