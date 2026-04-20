import { format, parseISO } from 'date-fns';
import { X } from 'lucide-react';

import getAvatarSrcByKey from '@/assets/images/avatars';
import {
  CardLabelPrimary,
  CardLabelSecondary,
} from '@/components/common/CardLabel';
import SingleAvatar from '@/components/common/SingleAvatar';
import { AlertDialogClose } from '@/components/ui/alert-dialog';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import { getCategoryLabel } from '@/features/money/constants';
import type { ExpenseItem } from '@/features/money/types';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';

const SPLIT_HASH_COLOR: Record<string, string> = {
  settled: 'text-primary-default',
  pending: 'text-secondary-dark',
  none: 'text-neutral-900',
};

function ItemDetails({ item }: { item: ExpenseItem }) {
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId);
  const creator = groupMembers.find((m) => m.userId === item.createdBy);

  const hashColor = SPLIT_HASH_COLOR[item.splitStatus] ?? 'text-neutral-900';
  const displayDate = format(parseISO(item.expenseDate), 'yyyy/MM/dd HH:mm');

  return (
    <div>
      <div className="flex justify-end">
        <AlertDialogClose
          aria-label="關閉"
          className="flex size-6 items-center justify-center text-neutral-900"
        >
          <X className="size-4" strokeWidth={2.5} />
        </AlertDialogClose>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-paragraph-md text-neutral-900">{displayDate}</p>
        <h2 className="font-heading-md text-neutral-900">{item.title}</h2>
      </div>

      <div className="mt-2 flex gap-2 text-neutral-900">
        {item.splitStatus === 'settled' && (
          <CardLabelPrimary>已分帳</CardLabelPrimary>
        )}
        {item.splitStatus === 'pending' && (
          <CardLabelSecondary>需分帳</CardLabelSecondary>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="font-paragraph-md flex items-center gap-2 text-neutral-900">
          <p>類別</p>
          <p>
            <span className={`font-label-lg ${hashColor}`}>#</span>{' '}
            {getCategoryLabel(item.category)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-paragraph-md text-neutral-900">建立人</p>
          {creator && (
            <div className="flex items-center gap-1">
              <SingleAvatar
                src={getAvatarSrcByKey(creator.avatarKey)}
                name={creator.username}
                className="size-7"
              />
              <p className="font-paragraph-md text-neutral-900">
                {creator.username}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="font-paragraph-md text-neutral-900">金額</p>
          <p className="font-heading-md text-neutral-900">
            $ {(item.amount ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="min-h-8 border-t-2 border-neutral-900">
          {item.notes && (
            <p className="font-paragraph-md h-18 py-3 text-neutral-900">
              {item.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
