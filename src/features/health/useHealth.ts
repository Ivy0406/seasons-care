import { getLatestHealthData } from '@/features/health/data/healthStorage';

export type { HealthData } from '@/features/health/types';

export default function useHealth() {
  return getLatestHealthData();
}
