import { format } from 'date-fns';

import getAvatarSrcByKey from '@/assets/images/avatars';
import { CURRENT_USER_KEY } from '@/constants/auth';
import type { CareLogEntry } from '@/pages/CareLog/types';
import type { UserInfo } from '@/types/auth';

function getCurrentUserParticipant() {
  const rawCurrentUser = window.localStorage.getItem(CURRENT_USER_KEY);

  if (!rawCurrentUser) {
    return [];
  }

  try {
    const currentUser = JSON.parse(rawCurrentUser) as Partial<UserInfo>;

    if (
      typeof currentUser.id !== 'string' ||
      currentUser.id.length === 0 ||
      typeof currentUser.userName !== 'string' ||
      currentUser.userName.length === 0 ||
      typeof currentUser.avatarKey !== 'string'
    ) {
      return [];
    }

    return [
      {
        id: currentUser.id,
        name: currentUser.userName,
        src: getAvatarSrcByKey(currentUser.avatarKey),
      },
    ];
  } catch {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return [];
  }
}

function createDraftCareLogEntry(selectedDate = new Date()): CareLogEntry {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `diary-${Date.now()}`,
    title: '',
    description: '',
    startsAt: format(selectedDate, "yyyy-MM-dd'T'HH:mm:ssxxx"),
    repeatPattern: 'none',
    participants: getCurrentUserParticipant(),
    status: 'pending',
    isImportant: false,
  };
}

export default createDraftCareLogEntry;
