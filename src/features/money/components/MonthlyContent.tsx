import { useState } from 'react';

import getAvatarSrcByKey from '@/assets/images/avatars';
import FilterDropdownButton from '@/components/common/FilterDropdownButton';
import Modal from '@/components/common/Modal';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import SingleAvatar from '@/components/common/SingleAvatar';
import UserGroup from '@/components/common/UserGroup';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import {
  EXPENSE_CATEGORY_CONFIGS,
  INITIAL_CATEGORY_TOTALS,
} from '@/features/money/constants';
import type {
  CategoryTotals,
  CategoryWithAmount,
  ExpenseItem,
} from '@/features/money/types';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import cn from '@/lib/utils';

import useExpenses from '../hooks/useExpenses';
import useSelectedMonth, { MONTH_OPTIONS } from '../hooks/useSelectedMonth';

import SplitDialog from './SplitDialog';

function calculateCategoryTotals(expenses: ExpenseItem[]): CategoryTotals {
  const totals = { ...INITIAL_CATEGORY_TOTALS };
  expenses.forEach((expense) => {
    totals[expense.category] += expense.amount;
  });
  return totals;
}

function MonthlyContent() {
  const [splitDialogOpen, setSplitDialogOpen] = useState(false);
  const [splitSuccessOpen, setSplitSuccessOpen] = useState(false);
  const { selectedMonth, setSelectedMonth } = useSelectedMonth();
  const { expenses } = useExpenses(selectedMonth);
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId);

  const categoryTotals = calculateCategoryTotals(expenses);

  const categoriesWithAmount: CategoryWithAmount[] =
    EXPENSE_CATEGORY_CONFIGS.map((config) => ({
      ...config,
      amount: categoryTotals[config.category],
    })).filter((cat) => cat.amount > 0);

  const monthlyTotal = Object.values(categoryTotals).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  return (
    <div className="w-full">
      <div className="relative mb-5 flex h-11 items-center justify-center">
        <FilterDropdownButton
          buttonClassName="bg-transparent border-0 rounded-none border-b-2 font-paragraph-md font-bold"
          value={selectedMonth}
          options={MONTH_OPTIONS}
          onChange={setSelectedMonth}
        />
        <UserGroup className="absolute right-0 w-fit" showArrow={false}>
          {groupMembers.map((member) => (
            <SingleAvatar
              key={member.userId}
              src={getAvatarSrcByKey(member.avatarKey)}
              name={member.username}
              className="size-7 ring-2 ring-neutral-900"
            />
          ))}
        </UserGroup>
      </div>

      <p className="font-display-lg mb-3 text-center">
        $ {monthlyTotal.toLocaleString()}
      </p>

      <div className="mb-5 flex h-3 overflow-hidden rounded-full">
        {categoriesWithAmount.map((categoryWithAmount) => (
          <div
            key={categoryWithAmount.label}
            className={cn('h-full', categoryWithAmount.color)}
            style={{
              width:
                monthlyTotal > 0
                  ? `${(categoryWithAmount.amount / monthlyTotal) * 100}%`
                  : '0%',
            }}
          />
        ))}
      </div>

      <ul className="mb-5 flex flex-col gap-2">
        {categoriesWithAmount.map((categoryWithAmount) => (
          <li
            key={categoryWithAmount.label}
            className="flex items-center justify-between"
          >
            <div className="font-label-md flex items-center gap-1">
              <span
                className={cn('inline-block size-2', categoryWithAmount.color)}
              />
              {categoryWithAmount.label}
            </div>
            <p className="font-label-md">
              ${categoryWithAmount.amount.toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <RoundedButtonPrimary
        disabled={expenses.every((e) => e.splitStatus !== 'pending')}
        onClick={() => setSplitDialogOpen(true)}
      >
        一鍵分帳
      </RoundedButtonPrimary>

      <SplitDialog
        open={splitDialogOpen}
        onOpenChange={setSplitDialogOpen}
        scope="monthly"
        onSuccess={() => {
          setSplitDialogOpen(false);
          setSplitSuccessOpen(true);
        }}
      />

      <Modal
        open={splitSuccessOpen}
        variant="success"
        title="分帳完成！"
        statusLayout="icon-first"
        autoCloseMs={1500}
        onClose={() => setSplitSuccessOpen(false)}
      />
    </div>
  );
}

export default MonthlyContent;
