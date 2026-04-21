import { EllipsisVertical } from 'lucide-react';

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
import type { ExpenseItem } from '@/features/money/types';

import ItemDetails from './ItemDetails';

function EntryCard({ item }: { item: ExpenseItem }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="block w-full text-left">
        <div className="w-full rounded-sm border-2 border-neutral-900 bg-neutral-100 p-4">
          <div className="flex items-center justify-between">
            <span className="font-label-lg text-neutral-900">{item.name}</span>
            <div className="flex items-center gap-2">
              {item.isSplit && <CardLabelPrimary>已分帳</CardLabelPrimary>}
              {item.needSplit && !item.isSplit && (
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

          <div className="my-3 border-b border-neutral-900" />

          <div className="flex items-center justify-between">
            <span className="font-label-lg text-neutral-900">
              $ {item.amount.toLocaleString()}
            </span>
            <SingleAvatar
              src={item.creator.src}
              name={item.creator.name}
              className="size-7"
            />
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
              <ItemDetails {...item} />
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
