const careLogKeys = {
  all: ['care-log-entries'] as const,
  list: (careGroupId: string) => [...careLogKeys.all, careGroupId] as const,
};

export default careLogKeys;
