import type {
  MemberSplit,
  SplitMember,
  SplitPendingItem,
} from '@/features/money/types';

function useSplitPreview(
  selectedItemIds: string[],
  selectedMemberIds: string[],
  items: SplitPendingItem[],
  members: SplitMember[],
): { selectedItems: SplitPendingItem[]; memberSplits: MemberSplit[] } {
  const selectedItems = items.filter(({ id }) => selectedItemIds.includes(id));
  const selectedMembers = members.filter(({ userId }) =>
    selectedMemberIds.includes(userId),
  );

  const totalAmount = selectedItems.reduce(
    (sum, { amount }) => sum + amount,
    0,
  );
  const perPerson =
    selectedMembers.length > 0 ? totalAmount / selectedMembers.length : 0;

  const memberSplits = selectedMembers.map(
    ({ userId, username, avatarKey }) => {
      const paid = selectedItems
        .filter(({ createdBy }) => createdBy === userId)
        .reduce((sum, { amount }) => sum + amount, 0);
      const net = Math.round(paid - perPerson);
      return {
        userId,
        username,
        avatarKey,
        status: net >= 0 ? ('receivable' as const) : ('payable' as const),
        amount: Math.abs(net),
      };
    },
  );

  return { selectedItems, memberSplits };
}

export default useSplitPreview;
