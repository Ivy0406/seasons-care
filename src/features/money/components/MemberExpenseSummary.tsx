import getAvatarSrcByKey from '@/assets/images/avatars';
import SingleAvatar from '@/components/common/SingleAvatar';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import type { ExpenseItem } from '@/features/money/types';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';

type MemberExpenseSummaryProps = {
  expenses: ExpenseItem[];
};

function MemberExpenseSummary({ expenses }: MemberExpenseSummaryProps) {
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId);

  const membersWithTotals = groupMembers.map((member) => {
    const total = expenses
      .filter((e) => e.createdBy === member.userId)
      .reduce((sum, e) => sum + e.amount, 0);
    return { ...member, total };
  });

  if (membersWithTotals.length === 0) return null;

  return (
    <section className="flex w-full flex-col gap-3 bg-neutral-800 px-6 py-5">
      <h3 className="font-heading-md text-neutral-50">各成員累積花費</h3>
      <ul className="font-paragraph-sm grid grid-cols-4 gap-x-4 gap-y-5 py-3 text-neutral-50">
        {membersWithTotals.map((member) => (
          <li key={member.userId} className="flex flex-col items-center gap-2">
            <SingleAvatar
              src={getAvatarSrcByKey(member.avatarKey)}
              name={member.username}
              className="size-15 ring-neutral-900"
            />
            <div className="flex flex-col items-center">
              <p>{member.username}</p>
              <p>${member.total.toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MemberExpenseSummary;
