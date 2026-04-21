import { PiggyBank } from 'lucide-react';

import type { ExpenseItem } from '@/features/money/types';
import type { GroupMember } from '@/types/group';

import NotificationBar from './NotificationBar';

type SplitExpenseBarProps = {
  expense: ExpenseItem;
  groupMembers: GroupMember[];
  label?: string;
  onClick?: () => void;
};

function SplitExpenseBar({
  expense,
  groupMembers,
  label = '已執行分帳',
  onClick,
}: SplitExpenseBarProps) {
  const creator = groupMembers.find((m) => m.userId === expense.createdBy);
  const title = creator ? `${creator.username} ${label}` : label;

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
