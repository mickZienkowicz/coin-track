import { InvitationStatus } from '@prisma/client';
import { format } from 'date-fns';
import { Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Card, CardContent } from '@/components/ui/card';
import { getSentInvitations } from '@/server/invitation/queries/get-sent-invitations';

import { InvitationStatusBadge } from './components/invitation-status-badge';
import { RejectInvitationButton } from './components/reject-invitation-button';

export const SentInvitationsList = async () => {
  const [invitations, t] = await Promise.all([
    getSentInvitations(),
    getTranslations('settings.invitations.sent')
  ]);

  return (
    <div className='mt-16'>
      <h2 className='mb-6 text-2xl font-semibold'>{t('title')}</h2>

      {invitations?.length <= 0 && (
        <Card data-tour='family-sent-invitations'>
          <CardContent className='flex flex-col items-center gap-2'>
            <h3 className='text-xl font-semibold'>{t('noInvitationsTitle')}</h3>
            <p className='text-muted-foreground'>
              {t('noInvitationsDescription')}
            </p>
          </CardContent>
        </Card>
      )}

      <div className='flex flex-col gap-4'>
        {invitations.map((invitation) => (
          <Card key={invitation.id} data-tour='family-sent-invitations'>
            <CardContent className='relative flex flex-col items-end justify-between gap-4 md:flex-row'>
              <div className='flex w-full flex-col gap-2'>
                <h3 className='mb-2 flex items-center gap-2 truncate font-semibold md:mb-3'>
                  <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-muted'>
                    <Mail className='h-4 w-4' />
                  </span>
                  {invitation.toUser.email}
                </h3>
                <InvitationStatusBadge
                  status={invitation.status}
                  className='right-6 top-0 mb-3 w-full md:absolute md:w-auto'
                />
                <p className='flex gap-1 truncate text-sm text-muted-foreground'>
                  {t('for')}
                  <span className='font-semibold'>
                    {invitation.toUser.name}
                  </span>
                </p>
                <p className='flex gap-1 truncate text-sm text-muted-foreground'>
                  {t('family')}
                  <span className='font-semibold'>
                    {invitation.family.name}
                  </span>
                </p>
                <p className='flex gap-1 truncate text-sm text-muted-foreground'>
                  {t('sent')}
                  <span className='font-semibold'>
                    {format(invitation.createdAt, 'dd/MM/yyyy HH:mm')}
                  </span>
                </p>
              </div>

              {invitation.status === InvitationStatus.PENDING && (
                <RejectInvitationButton
                  invitationId={invitation.id}
                  className='w-full md:w-auto'
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
