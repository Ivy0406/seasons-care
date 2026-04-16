import { Check } from 'lucide-react';

import getAvatarSrcByKey from '@/assets/images/avatars';
import SingleAvatar from '@/components/common/SingleAvatar';
import type { MemberSplit } from '@/features/money/types';
import cn from '@/lib/utils';

type SplitParticipantSelectProps = {
  name: string;
  avatarKey: string;
  selected: boolean;
  onToggle: () => void;
};

type SplitParticipantProps = Pick<
  MemberSplit,
  'status' | 'avatarKey' | 'amount'
> & {
  name: string;
};

function SplitParticipantSelect({
  name,
  avatarKey,
  selected,
  onToggle,
}: SplitParticipantSelectProps) {
  return (
    <div className="flex h-14 items-center gap-3 px-3 py-2">
      <SingleAvatar
        src={getAvatarSrcByKey(avatarKey)}
        name={name}
        className="size-10 ring-neutral-900"
      />

      <span className="font-paragraph-md flex-1 text-neutral-900">{name}</span>

      <button
        type="button"
        aria-label={selected ? '取消參與分帳' : '加入參與分帳'}
        className={cn(
          'flex size-6 items-center justify-center rounded-full transition-colors',
          selected ? 'bg-primary-default' : 'bg-neutral-400',
        )}
        onClick={onToggle}
      >
        <Check className="size-2.5 text-white" strokeWidth={4.5} />
      </button>
    </div>
  );
}

function SplitParticipant({
  name,
  avatarKey,
  status,
  amount,
}: SplitParticipantProps) {
  return (
    <div className="flex items-center gap-4 px-3 py-2">
      <SingleAvatar
        src={getAvatarSrcByKey(avatarKey)}
        name={name}
        className="size-10 ring-neutral-900"
      />

      <p className="font-paragraph-md flex-1 text-neutral-900">{name}</p>

      <p
        className={cn(
          'font-paragraph-md border-b-2 pb-0.5 text-neutral-900',
          status === 'receivable'
            ? 'border-primary-default'
            : 'border-secondary-dark',
        )}
      >
        {status === 'receivable' ? '應收' : '應付'} ${amount.toLocaleString()}
      </p>
    </div>
  );
}

export { SplitParticipant, SplitParticipantSelect };
