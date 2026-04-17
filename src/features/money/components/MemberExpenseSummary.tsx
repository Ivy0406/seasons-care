import getAvatarSrcByKey from '@/assets/images/avatars';
import SingleAvatar from '@/components/common/SingleAvatar';
import useMemberTotals from '@/features/money/hooks/useMemberTotals';

function MemberExpenseSummary() {
  const { members } = useMemberTotals();

  if (members.length === 0) return null;

  return (
    <section className="flex w-full flex-col gap-3 bg-neutral-800 px-6 py-5">
      <h3 className="font-heading-md text-neutral-50">各成員累積花費</h3>
      <ul className="font-paragraph-sm grid grid-cols-4 gap-x-4 gap-y-5 py-3 text-neutral-50">
        {members.map(({ userId, name, avatarUrl, personalPayableTotal }) => (
          <li key={userId} className="flex flex-col items-center gap-2">
            <SingleAvatar
              src={getAvatarSrcByKey(avatarUrl ?? '')}
              name={name}
              className="size-15 ring-neutral-900"
            />
            <div className="flex flex-col items-center">
              <p>{name}</p>
              <p>${(personalPayableTotal ?? 0).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MemberExpenseSummary;
