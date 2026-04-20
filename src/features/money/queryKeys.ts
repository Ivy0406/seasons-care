const moneyKeys = {
  all: ['expenses'] as const,
  group: (careGroupId: string) => [...moneyKeys.all, careGroupId] as const,
  list: (careGroupId: string, month: string) =>
    [...moneyKeys.group(careGroupId), month] as const,
  detail: (careGroupId: string, expenseId: string) =>
    [...moneyKeys.group(careGroupId), expenseId] as const,
  memberTotals: (careGroupId: string, month: string) =>
    [...moneyKeys.group(careGroupId), 'member-totals', month] as const,
};

export default moneyKeys;
