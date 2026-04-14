import DataFormCard from '@/components/common/DataFormCard';
import { Button } from '@/components/ui/button';
import type { ExpenseItem } from '@/features/money/types';

import ItemDetails from './ItemDetails';

function ItemDetailsCard({
  item,
  onDeleteClick,
}: {
  item: ExpenseItem;
  onDeleteClick: () => void;
}) {
  return (
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
            onClick={onDeleteClick}
          >
            刪除帳目
          </Button>
          <Button className="bg-secondary-default flex-1 rounded-full text-neutral-900">
            編輯帳目
          </Button>
        </div>
      </DataFormCard.Footer>
    </DataFormCard>
  );
}

export default ItemDetailsCard;
