import type { SplitItem } from '@/features/money/types';

import SplitItemCard from './SplitItemCard';

type SplitItemsPreviewProps = {
  items: SplitItem[];
};

function SplitItemsPreview({ items }: SplitItemsPreviewProps) {
  const totalAmount = items.reduce((sum, { amount }) => sum + amount, 0);

  return (
    <div className="flex flex-col gap-3 border-b-2 border-neutral-900 pb-3">
      <p className="font-heading-sm text-neutral-900">平分項目</p>

      <div className="flex h-50.5 flex-col gap-2 overflow-y-auto">
        {items.map(({ id, title, amount }) => (
          <SplitItemCard
            key={id}
            title={title}
            amount={amount}
            checked
            readOnly
          />
        ))}
      </div>

      <div className="flex items-baseline justify-end gap-3">
        <p className="font-label-md text-neutral-700">共{items.length}筆帳目</p>
        <p className="font-heading-md text-neutral-900">總計</p>
        <p className="font-heading-md text-neutral-900">
          $ {totalAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default SplitItemsPreview;
