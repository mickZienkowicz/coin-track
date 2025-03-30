import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { RemoveUserFromFamilyDialog } from '../remove-user-from-family-dialog';

export const FamilyUsersList = ({
  users,
  familyId,
  currentUserId,
  isCurrentUserOwner
}: {
  familyId: string;
  currentUserId: string;
  isCurrentUserOwner: boolean;
  users: {
    id: string;
    name: string;
    avatar: string | null;
  }[];
}) => {
  const t = useTranslations('settings');

  if (users.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className='text-md mb-4 font-semibold'>{t('familyCard.members')}</h3>
      <ul className='space-y-3'>
        {users.map((user) => (
          <li key={user.id} className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={user.avatar || ''} />
                <AvatarFallback>
                  {user.name
                    .split(' ')
                    .map((name) => name[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span className='text-sm'>
                {user.name} {user.id === currentUserId && t('familyCard.you')}
              </span>
            </div>
            {isCurrentUserOwner && user.id !== currentUserId && (
              <RemoveUserFromFamilyDialog
                familyId={familyId}
                userToRemoveId={user.id}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
