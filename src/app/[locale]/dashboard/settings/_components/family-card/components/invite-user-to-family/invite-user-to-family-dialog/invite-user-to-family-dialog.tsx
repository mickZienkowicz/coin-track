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

import { InviteUserToFamilyForm } from '../invite-user-to-family-form';

export const InviteUserToFamilyDialog = ({
  familyName,
  familyId,
  className,
  isSelectedFamily
}: {
  familyName: string;
  familyId: string;
  className?: string;
  isSelectedFamily?: boolean;
}) => {
  const t = useTranslations('settings.inviteUserToFamily');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn('@md:w-auto w-full', className)}
          size='sm'
          data-tour={
            isSelectedFamily
              ? 'active-family-card-invite-user-button'
              : undefined
          }
        >
          <UserPlus2 className='h-4 w-4' />
          {t('button')}
        </Button>
      </DialogTrigger>
      <DialogContent
        data-tour={
          isSelectedFamily ? 'active-family-card-invite-user-dialog' : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description', { familyName })}
          </DialogDescription>
        </DialogHeader>

        <InviteUserToFamilyForm
          familyId={familyId}
          closeDialog={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
