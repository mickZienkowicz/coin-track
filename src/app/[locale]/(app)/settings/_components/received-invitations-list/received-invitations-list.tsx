import { format } from 'date-fns';
import { UsersRound } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Card, CardContent } from '@/components/ui/card';
import { getReceivedInvitations } from '@/server/invitation/queries/get-received-invitations';

import { AcceptInvitationButton } from './components/accept-invitation-button';
import { RejectInvitationDialog } from './components/reject-invitation-dialog';

export const ReceivedInvitationsList = async () => {
  const [invitations, t] = await Promise.all([
    getReceivedInvitations(),
    getTranslations('settings.invitations.received')
  ]);

  return (
    <div className='mt-16'>
      <h2 className='mb-6 text-2xl font-semibold'>{t('title')}</h2>

      {invitations?.length <= 0 && (
        <Card data-tour='family-invitations'>
          <CardContent className='flex flex-col items-center gap-2'>
            <h3 className='text-xl font-semibold'>{t('noInvitationsTitle')}</h3>
            <p className='text-muted-foreground'>
              {t('noInvitationsDescription')}
            </p>
          </CardContent>
        </Card>
      )}

      <div className='space-y-4'>
        {invitations.map((invitation) => (
          <Card key={invitation.id} data-tour='family-invitation'>
            <CardContent className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div className='flex w-full flex-col gap-2'>
                <h4 className='mb-3 flex items-center gap-2 truncate font-semibold'>
                  <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-muted'>
                    <UsersRound className='h-4 w-4' />
                  </span>
                  {invitation.family.name}
                </h4>
                <p className='flex gap-1 truncate text-ellipsis text-sm text-muted-foreground'>
                  {t('for')}
                  <span className='font-semibold'>
                    {invitation.fromUser.name}
                  </span>
                </p>
                <p className='flex gap-1 truncate text-sm text-muted-foreground'>
                  {t('sent')}
                  <span className='text-ellipsis font-semibold'>
                    {format(invitation.createdAt, 'dd/MM/yyyy HH:mm')}
                  </span>
                </p>
              </div>

              <div className='flex w-full flex-col justify-end gap-2 sm:flex-row'>
                <RejectInvitationDialog
                  invitationId={invitation.id}
                  className='grow md:grow-0'
                />
                <AcceptInvitationButton
                  invitationId={invitation.id}
                  className='grow md:grow-0'
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
