import { EllipsisVertical } from 'lucide-react';

import {
  CardLabelPrimary,
  CardLabelSecondary,
} from '@/components/common/CardLabel';
import SingleAvatar from '@/components/common/SingleAvatar';

type Recorder = {
  name: string;
  src: string;
};

export type ExpenseItem = {
  id: string;
  name: string;
  amount: number;
  needSplit: boolean;
  isSplit: boolean;
  recorder: Recorder;
};

function EntryCard({ item }: { item: ExpenseItem }) {
  return (
    <div className="rounded-sm border-2 border-neutral-900 bg-neutral-100 p-4">
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
          src={item.recorder.src}
          name={item.recorder.name}
          className="size-7"
        />
      </div>
    </div>
  );
}

export default EntryCard;
