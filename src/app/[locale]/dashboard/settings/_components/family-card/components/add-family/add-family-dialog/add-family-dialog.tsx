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
import { cn } from '@/lib/utils';

import { AddFamilyForm } from '../add-family-form';

export const AddFamilyDialog = ({
  className,
  currencies,
  timezones,
  mobileSmallVersion
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
  mobileSmallVersion?: boolean;
}) => {
  const t = useTranslations('settings.addFamily');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mobileSmallVersion ? (
          <Button
            className={cn(
              className,
              'w-11! md:w-auto! md:h-11 md:px-4 md:py-2 md:has-[>svg]:px-3'
            )}
            variant='secondary'
            size='icon'
            aria-label={t('title')}
          >
            <UserPlus2 className='h-4 w-4' />
            <span className='hidden md:inline'>{t('title')}</span>
          </Button>
        ) : (
          <Button className={className} variant='secondary'>
            <UserPlus2 className='h-4 w-4' />
            {t('title')}
          </Button>
        )}
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
