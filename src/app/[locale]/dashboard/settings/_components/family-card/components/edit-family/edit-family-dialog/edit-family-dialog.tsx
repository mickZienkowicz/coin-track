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
  timezone,
  familyId,
  isSelectedFamily
}: {
  name: string;
  familyId: string;
  timezone: string;
  isSelectedFamily?: boolean;
}) => {
  const t = useTranslations('settings.editFamily');
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size='iconSmall'
          aria-label={t('title')}
          variant='secondary'
          data-tour={
            isSelectedFamily ? 'active-family-card-edit-button' : undefined
          }
        >
          <Edit className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent
        data-tour={
          isSelectedFamily ? 'active-family-card-edit-dialog' : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <EditFamilyForm
          name={name}
          familyId={familyId}
          timezone={timezone}
          closeDialog={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
};
