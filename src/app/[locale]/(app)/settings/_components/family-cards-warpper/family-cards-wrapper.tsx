import { getFamilies } from '@/server/family/queries/get-families';
import { getSelectedFamilyId } from '@/server/family/queries/get-selected-family-id';
import { getUser } from '@/server/user/queries/get-user';

import { FamilyCards } from './family-cards';

export const FamilyCardsWrapper = async () => {
  const [families, currentUser, selectedFamilyId] = await Promise.all([
    getFamilies(),
    getUser(),
    getSelectedFamilyId()
  ]);

  return (
    <FamilyCards
      families={families}
      currentUserId={currentUser.id}
      selectedFamilyId={selectedFamilyId}
    />
  );
};
