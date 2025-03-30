'use client';

import { useState } from 'react';
import type { Pouch } from '@prisma/client';
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

import { EditPouchForm } from '../edit-pouch-form';

export const EditPouchDialog = ({
  className,
  children,
  pouch,
  currency
}: {
  className?: string;
  children?: React.ReactNode;
  pouch: Pouch;
  currency: string;
}) => {
  const t = useTranslations('budget.pouch.pouchCard.editPouch');
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
            {t('button')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditPouchForm
          currency={currency}
          closeDialog={() => setIsOpen(false)}
          pouch={pouch}
        />
      </DialogContent>
    </Dialog>
  );
};
