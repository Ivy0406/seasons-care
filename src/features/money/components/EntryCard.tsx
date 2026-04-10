import { EllipsisVertical } from 'lucide-react';

import getAvatarSrcByKey from '@/assets/images/avatars';
import {
  CardLabelPrimary,
  CardLabelSecondary,
} from '@/components/common/CardLabel';
import DataFormCard from '@/components/common/DataFormCard';
import SingleAvatar from '@/components/common/SingleAvatar';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import type { ExpenseItem } from '@/features/money/types';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';

import ItemDetails from './ItemDetails';

function EntryCard({ item }: { item: ExpenseItem }) {
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId);
  const creator = groupMembers.find((m) => m.userId === item.createdBy);

  return (
    <AlertDialog>
      <AlertDialogTrigger className="block w-full text-left">
        <div className="w-full rounded-sm border-2 border-neutral-900 bg-neutral-100 p-4">
          <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-3">
            <span className="font-label-lg text-neutral-900">{item.title}</span>
            <div className="flex items-center gap-2">
              {item.splitStatus === 'settled' && (
                <CardLabelPrimary>已分帳</CardLabelPrimary>
              )}
              {item.splitStatus === 'pending' && (
                <CardLabelSecondary>需分帳</CardLabelSecondary>
              )}
              <button
                type="button"
                aria-label="更多選項"
                className="flex size-6 items-center justify-center text-neutral-600"
              >
                <EllipsisVertical className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-label-lg text-neutral-900">
              $ {item.amount.toLocaleString()}
            </span>
            {creator && (
              <SingleAvatar
                src={getAvatarSrcByKey(creator.avatarKey)}
                name={creator.username}
                className="size-7"
              />
            )}
          </div>
        </div>
      </AlertDialogTrigger>

      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup className="border-0 bg-transparent">
          <DataFormCard
            title="帳目"
            className="bg-neutral-800"
            toneClassName="bg-neutral-800 text-neutral-50"
          >
            <DataFormCard.Content>
              <ItemDetails item={item} />
            </DataFormCard.Content>

            <DataFormCard.Footer>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-neutral-50 bg-transparent text-neutral-50"
                >
                  刪除帳目
                </Button>
                <Button className="bg-secondary-default flex-1 rounded-full text-neutral-900">
                  編輯帳目
                </Button>
              </div>
            </DataFormCard.Footer>
          </DataFormCard>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

export default EntryCard;
