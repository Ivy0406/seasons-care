import { PiggyBank } from 'lucide-react';

import type { ExpenseItem } from '@/features/money/types';
import type { GroupMember } from '@/types/group';

import NotificationBar from './NotificationBar';

type SplitExpenseBarProps = {
  expense: ExpenseItem;
  groupMembers: GroupMember[];
  label?: string;
  onClick?: () => void;
  expenseCount?: number;
};

function SplitExpenseBar({
  expense,
  groupMembers,
  label = '已執行分帳',
  onClick,
  expenseCount,
}: SplitExpenseBarProps) {
  const executor = groupMembers.find((m) => m.userId === expense.createdBy);
  const countText = expenseCount ? `${expenseCount} 筆` : '';
  const labelWithCount = countText ? `已執行 ${countText}分帳` : label;
  const title = executor
    ? `${executor.username} ${labelWithCount}`
    : labelWithCount;

  return (
    <NotificationBar
      icon={<PiggyBank />}
      eventType="分帳紀錄"
      title={title}
      onClick={onClick}
    />
  );
}

export default SplitExpenseBar;
