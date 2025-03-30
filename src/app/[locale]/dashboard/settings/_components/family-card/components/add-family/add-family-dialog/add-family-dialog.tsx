'use client';

import { useState } from 'react';
import { UserPlus2 } from 'lucide-react';
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

import { AddFamilyForm } from '../add-family-form';

export const AddFamilyDialog = ({
  className,
  currencies,
  timezones
}: {
  className?: string;
  currencies: {
    label: string;
    value: string;
  }[];
  timezones: {
    label: string;
    value: string;
  }[];
}) => {
  const t = useTranslations('settings.addFamily');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant='secondary'>
          <UserPlus2 className='h-4 w-4' />
          {t('title')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <AddFamilyForm
          closeDialog={() => setIsOpen(false)}
          currencies={currencies}
          timezones={timezones}
        />
      </DialogContent>
    </Dialog>
  );
};
