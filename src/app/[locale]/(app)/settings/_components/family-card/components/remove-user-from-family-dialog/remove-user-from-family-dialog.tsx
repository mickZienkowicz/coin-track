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
import { removeUserFromFamily } from '@/server/family/actions/remove-user-from-family';
import { revalidatePathAction } from '@/server/revalidate/actions/revalidate-path';

export const RemoveUserFromFamilyDialog = ({
  familyId,
  userToRemoveId
}: {
  familyId: string;
  userToRemoveId: string;
}) => {
  const t = useTranslations('settings.removeUserFromFamily');
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: removeUserFromFamily,
    onSuccess: ({ message, success }) => {
      if (!success) {
        toast.error(message);
        return;
      }

      setIsOpen(false);
      toast.success(message);
      revalidatePathAction(pathGenerators.settings());
    },
    onError: () => {
      toast.error(t('error'));
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='iconSmall' aria-label={t('title')}>
          <Trash2 className='h-3 w-3' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Button
          variant='destructive'
          onClick={() => mutate({ familyId, userToRemoveId })}
          loading={isPending}
          disabled={isPending}
        >
          {t('removeButton')}
          <Trash2 className='h-3 w-3' />
        </Button>
      </DialogContent>
    </Dialog>
  );
};
