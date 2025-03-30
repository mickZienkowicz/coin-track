'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
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

import { EditFamilyForm } from '../edit-family-form';

export const EditFamilyDialog = ({
  name,
  currency,
  timezone,
  familyId,
  currencies,
  timezones
}: {
  name: string;
  familyId: string;
  currency: string;
  timezone: string;
  currencies: {
    label: string;
    value: string;
  }[];
  timezones: {
    label: string;
    value: string;
  }[];
}) => {
  const t = useTranslations('settings.editFamily');
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='iconSmall' aria-label={t('title')} variant='secondary'>
          <Edit className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditFamilyForm
          name={name}
          familyId={familyId}
          currency={currency}
          timezone={timezone}
          currencies={currencies}
          timezones={timezones}
          closeDialog={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
};
