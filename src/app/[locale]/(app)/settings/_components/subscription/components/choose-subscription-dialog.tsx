'use client';

import { useState } from 'react';
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

import { NoActiveSubscriptionCard } from './no-active-subscryption-card';

export const ChooseSubscriptionDialog = ({
  className,
  currency,
  buttonText,
  defaultOpen = false,
  hideTrigger = false
}: {
  className?: string;
  currency: string;
  buttonText?: string;
  defaultOpen?: boolean;
  hideTrigger?: boolean;
}) => {
  const t = useTranslations('subscription.chooseSubscriptionDialog');
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!hideTrigger ? (
        <DialogTrigger asChild>
          <Button className={className}>{buttonText || t('button')}</Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className='md:w-[calc(100%-2rem)] md:max-w-[calc(100%-2rem)] lg:w-[760px] lg:max-w-[760px]'>
        <DialogHeader className='mb-8'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <NoActiveSubscriptionCard currency={currency} />
      </DialogContent>
    </Dialog>
  );
};
