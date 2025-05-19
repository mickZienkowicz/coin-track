import { UserRound, UsersRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { FamilyWithUsers } from '@/server/family/queries/get-families';

import { EditFamilyDialog } from './components/edit-family/edit-family-dialog';
import { FamilyUsersList } from './components/family-users-list';
import { InviteUserToFamilyDialog } from './components/invite-user-to-family/invite-user-to-family-dialog/invite-user-to-family-dialog';
import { LeaveFamilyDialog } from './components/leave-family/leave-family-dialog';
import { RemoveFamilyDialog } from './components/remove-family-dialog/remove-family-dialog';
import { SwitchFamilyButton } from './components/switch-family-button/switch-family-button';

export const FamilyCard = ({
  family,
  currentUserId,
  selectedFamilyId,
  setOptimisticSelectedFamilyId
}: {
  currentUserId: string;
  selectedFamilyId: string | undefined;
  setOptimisticSelectedFamilyId: (familyId: string) => void;
  family: FamilyWithUsers;
}) => {
  const t = useTranslations('settings');
  const isCurrentUserOwner = family.ownerId === currentUserId;
  const isSelectedFamily = family.id === selectedFamilyId;

  return (
    <Card
      key={family.id}
      className={cn(
        '@container gap-5',
        isSelectedFamily &&
          'ring-2 ring-brand-primary ring-offset-4 ring-offset-background'
      )}
      data-tour={isSelectedFamily ? 'active-family-card' : 'family-card'}
    >
      <CardHeader className='flex items-center justify-start gap-2'>
        <CardTitle className='w-full grow text-2xl'>
          <h3>{family.name}</h3>
        </CardTitle>
        {isSelectedFamily && (
          <Badge
            variant='brand'
            data-tour={
              isSelectedFamily ? 'active-family-card-active-badge' : undefined
            }
          >
            {t('familyCard.activeBadge')}
          </Badge>
        )}
        {!isSelectedFamily && (
          <SwitchFamilyButton
            familyId={family.id}
            setOptimisticSelectedFamilyId={setOptimisticSelectedFamilyId}
            className='@sm:flex hidden'
          />
        )}
      </CardHeader>
      <CardContent>
        <div className='mb-5 flex items-center justify-between'>
          <div>
            <p className='mb-2 flex items-center gap-2 text-sm font-medium'>
              <span className='flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-muted'>
                {family.users.length === 1 ? (
                  <UserRound className='h-4 w-4' />
                ) : (
                  <UsersRound className='h-4 w-4' />
                )}
              </span>
              {family.users.length}{' '}
              {family.users.length === 1
                ? t('familyCard.member')
                : t('familyCard.members')}
            </p>
            <p className='text-sm text-muted-foreground'>
              {t('familyCard.role')}
              <span className='font-semibold'>
                {isCurrentUserOwner
                  ? t('familyCard.owner')
                  : t('familyCard.member')}
              </span>
            </p>
          </div>
          <div className='flex gap-2'>
            {isCurrentUserOwner && (
              <EditFamilyDialog
                name={family.name}
                timezone={family.timezone}
                familyId={family.id}
                isSelectedFamily={isSelectedFamily}
              />
            )}
            {isCurrentUserOwner && (
              <RemoveFamilyDialog
                familyId={family.id}
                isSelectedFamily={isSelectedFamily}
              />
            )}
          </div>
        </div>

        <FamilyUsersList
          familyId={family.id}
          users={family.users}
          currentUserId={currentUserId}
          isCurrentUserOwner={isCurrentUserOwner}
        />
      </CardContent>
      <CardFooter className='@sm:flex-row flex grow flex-col items-end justify-end gap-3'>
        {isCurrentUserOwner ? (
          <InviteUserToFamilyDialog
            familyName={family.name}
            familyId={family.id}
            className='@sm:w-auto w-full'
            isSelectedFamily={isSelectedFamily}
          />
        ) : (
          <LeaveFamilyDialog
            familyId={family.id}
            className='@sm:w-auto w-full'
          />
        )}
        {!isSelectedFamily && (
          <SwitchFamilyButton
            familyId={family.id}
            setOptimisticSelectedFamilyId={setOptimisticSelectedFamilyId}
            className='@sm:hidden flex w-full'
          />
        )}
      </CardFooter>
    </Card>
  );
};
