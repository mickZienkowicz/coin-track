'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
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

import { AddPouchForm } from '../add-pouch-form';

export const AddPouchDialog = ({
  className,
  children,
  currency
}: {
  className?: string;
  children?: React.ReactNode;
  currency: string;
}) => {
  const t = useTranslations('budget.pouch.pouchCard.addPouch');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={className} variant='outline'>
            <Package className='size-4 text-blue-600' />
            {t('button')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <AddPouchForm
          closeDialog={() => setIsOpen(false)}
          currency={currency}
        />
      </DialogContent>
    </Dialog>
  );
};
