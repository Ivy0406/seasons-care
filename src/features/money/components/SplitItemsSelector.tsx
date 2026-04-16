import type { SplitItem } from '@/features/money/types';

import SplitItemCard from './SplitItemCard';

type SplitItemsSelectorProps = {
  items: SplitItem[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
};

function SplitItemsSelector({
  items,
  selectedIds,
  onSelectedIdsChange,
}: SplitItemsSelectorProps) {
  const total = items
    .filter(({ id }) => selectedIds.includes(id))
    .reduce((sum, { amount }) => sum + amount, 0);

  const handleToggle = (id: string, checked: boolean) => {
    if (checked) {
      onSelectedIdsChange([...selectedIds, id]);
    } else {
      onSelectedIdsChange(selectedIds.filter((sid) => sid !== id));
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 border-b-2 border-neutral-900 pb-3">
      <p className="font-heading-sm text-neutral-900">選擇平分項目</p>

      <div className="flex max-h-50.5 flex-col gap-2 overflow-y-auto">
        {items.map(({ id, title, amount }) => (
          <SplitItemCard
            key={id}
            title={title}
            amount={amount}
            checked={selectedIds.includes(id)}
            onChange={(checked) => handleToggle(id, checked)}
          />
        ))}
      </div>

      <div className="flex items-baseline justify-end gap-3">
        <p className="font-heading-md text-neutral-900">總計</p>
        <p className="font-heading-md text-neutral-900">
          $ {total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default SplitItemsSelector;
