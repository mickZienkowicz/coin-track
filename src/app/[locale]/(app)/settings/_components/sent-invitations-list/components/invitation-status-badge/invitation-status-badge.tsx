import { InvitationStatus } from '@prisma/client';
import { Check, Clock, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const InvitationStatusBadge = ({
  status,
  className
}: {
  status: InvitationStatus;
  className?: string;
}) => {
  const t = useTranslations('settings.invitations.sent');

  return (
    <Badge
      variant='outline'
      className={cn(
        status === InvitationStatus.PENDING && '  bg-yellow-700 text-yellow-50',
        status === InvitationStatus.ACCEPTED && '  bg-green-700 text-green-50',
        status === InvitationStatus.REJECTED && '  bg-red-700 text-red-50',
        className
      )}
    >
      {status === InvitationStatus.PENDING && (
        <>
          <Clock className='mr-1 h-4 w-4' />
          {t('pending')}
        </>
      )}
      {status === InvitationStatus.ACCEPTED && (
        <>
          <Check className='mr-1 h-4 w-4' />
          {t('accepted')}
        </>
      )}
      {status === InvitationStatus.REJECTED && (
        <>
          <X className='mr-1 h-4 w-4' />
          {t('rejected')}
        </>
      )}
    </Badge>
  );
};
