import type { MemberSplit } from '@/features/money/types';

import { SplitParticipant } from './SplitParticipant';

type SplitResultPreviewProps = {
  memberSplits: MemberSplit[];
};

function SplitResultPreview({ memberSplits }: SplitResultPreviewProps) {
  return (
    <div className="flex flex-col pb-5">
      <p className="font-heading-sm pb-3 text-neutral-900">預覽分帳結果</p>

      {memberSplits.map(({ userId, username, avatarKey, status, amount }) => (
        <SplitParticipant
          key={userId}
          name={username}
          avatarKey={avatarKey}
          status={status}
          amount={amount}
        />
      ))}
    </div>
  );
}

export default SplitResultPreview;
