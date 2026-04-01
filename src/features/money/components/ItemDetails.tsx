import { X } from 'lucide-react';

import {
  CardLabelPrimary,
  CardLabelSecondary,
} from '@/components/common/CardLabel';
import SingleAvatar from '@/components/common/SingleAvatar';
import { AlertDialogClose } from '@/components/ui/alert-dialog';
import type { ExpenseItem } from '@/features/money/types';

function ItemDetails({
  name,
  date,
  time,
  category,
  amount,
  needSplit,
  isSplit,
  creator,
  description,
}: ExpenseItem) {
  let hashColor = 'text-neutral-900';
  if (isSplit) hashColor = 'text-primary-default';
  else if (needSplit) hashColor = 'text-secondary-dark';

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
        <p className="font-paragraph-md text-neutral-900">
          {date} {time}
        </p>
        <h2 className="font-heading-md text-neutral-900">{name}</h2>
      </div>

      <div className="mt-2 flex gap-2 text-neutral-900">
        {isSplit && <CardLabelPrimary>已分帳</CardLabelPrimary>}
        {needSplit && !isSplit && (
          <CardLabelSecondary>需分帳</CardLabelSecondary>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="font-paragraph-md flex items-center gap-2 text-neutral-900">
          <p>類別</p>
          <p>
            <span className={`font-label-lg ${hashColor}`}>#</span> {category}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-paragraph-md text-neutral-900">建立人</p>
          <div className="flex items-center gap-1">
            <SingleAvatar
              src={creator.src}
              name={creator.name}
              className="size-7"
            />
            <p className="font-paragraph-md text-neutral-900">{creator.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-paragraph-md text-neutral-900">金額</p>
          <p className="font-heading-md text-neutral-900">
            $ {amount.toLocaleString()}
          </p>
        </div>
        <div className="min-h-8 border-t-2 border-neutral-900">
          {description && (
            <p className="font-paragraph-md h-18 py-3 text-neutral-900">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
