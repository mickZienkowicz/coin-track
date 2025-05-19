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
import { DebtWithAdditionalInfo } from '@/server/fortune/queries/get-forune-summary';

import { EditDebtForm } from '../edit-debt-form/edit-debt-form';

export const EditDebtDialog = ({
  className,
  children,
  debt
}: {
  className?: string;
  children?: React.ReactNode;
  debt: DebtWithAdditionalInfo;
}) => {
  const t = useTranslations('fortune.debts.editDebt');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={className}
            variant='outline'
            size='sm'
            data-tour='edit-debt-dialog'
          >
            <Pencil className='size-4 ' />
            <span className='hidden min-[350px]:inline'>{t('button')}</span>
            <span className='inline min-[350px]:hidden'>
              {t('buttonMobile')}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-tour='edit-debt-form'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditDebtForm closeDialog={() => setIsOpen(false)} debt={debt} />
      </DialogContent>
    </Dialog>
  );
};
